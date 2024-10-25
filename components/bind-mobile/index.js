const WXAPI = require('apifm-wxapi')
const AUTH = require('../../utils/auth')
Component({
  options: {
    addGlobalClass: true,
  },
  /**
   * 组件的对外属性，是属性名到属性设置的映射表
   */
  properties: {
    title: String,
    alarmText: String,
    show: Boolean,
  },

  /**
   * 组件的内部数据，和 properties 一同用于组件的模板渲染
   */
  data: {
    
  },
  // 组件数据字段监听器，用于监听 properties 和 data 的变化
  observers: {
  },
  lifetimes: {
    attached() {
      
    },
    detached() {
      // 在组件实例被从页面节点树移除时执行
    },
  },
  /**
   * 组件的方法列表
   */
  methods: {
    close() {
      this.triggerEvent('cancel')
    },
    async getPhoneNumber(e) {
      if (e.detail.errMsg.indexOf('privacy permission is not authorized') != -1) {
        wx.showModal({
          content: '请阅读并同意隐私条款以后才能继续本操作',
          confirmText: '阅读协议',
          cancelText: '取消',
          success (res) {
            if (res.confirm) {
              wx.requirePrivacyAuthorize() // 弹出用户隐私授权框
            }
          }
        })
        return
      }
      if (!e.detail.errMsg) {
        wx.showModal({
          content: 'getPhoneNumber异常',
          showCancel: false
        })
        return
      }
      if (e.detail.errMsg == "getPhoneNumber:fail user deny") {
        return
      }
      if (!e.detail.errMsg || e.detail.errMsg != "getPhoneNumber:ok") {
        wx.showModal({
          content: e.detail.errMsg,
          showCancel: false
        })
        return;
      }
      this._getPhoneNumber(e)
    },
    async _getPhoneNumber(e) {
      let res
      const extConfigSync = wx.getExtConfigSync()
      if (extConfigSync.subDomain) {
        // 服务商模式
        const code = await AUTH.wxaCode()
        res = await WXAPI.wxappServiceBindMobile({
          token: wx.getStorageSync('token'),
          code,
          encryptedData: e.detail.encryptedData,
          iv: e.detail.iv,
        })
      } else {
        res = await WXAPI.bindMobileWxappV2(wx.getStorageSync('token'), e.detail.code)
      }
      if (res.code == 0) {
        wx.showToast({
          title: '绑定成功'
        })
        this.data.mobile = res.data
        this.triggerEvent('ok', this.data)
      } else {
        wx.showModal({
          content: res.msg,
          showCancel: false
        })
      }
    },
  }
})