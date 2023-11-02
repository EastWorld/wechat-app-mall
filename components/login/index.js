const WXAPI = require('apifm-wxapi')

Component({
  options: {
    // 样式隔离 https://developers.weixin.qq.com/miniprogram/dev/framework/custom-component/wxml-wxss.html#%E7%BB%84%E4%BB%B6%E6%A0%B7%E5%BC%8F%E9%9A%94%E7%A6%BB
    styleIsolation: 'apply-shared',
  },
  /**
   * 组件的对外属性，是属性名到属性设置的映射表
   */
  properties: {
    avatarUrl: String,
    name: String,
    show: Boolean,
  },

  /**
   * 组件的内部数据，和 properties 一同用于组件的模板渲染
   */
  data: {
    nick: undefined
  },
  // 组件数据字段监听器，用于监听 properties 和 data 的变化
  observers: {

  },
  lifetimes: {
    attached() {
      this.setData({
        nick: this.data.name
      })
    },
    detached: function () {
      // 在组件实例被从页面节点树移除时执行
    },
  },
  /**
   * 组件的方法列表
   */
  methods: {
    async _editNick() {
      if (!this.data.nick) {
        wx.showToast({
          title: '请填写昵称',
          icon: 'none'
        })
        return
      }
      const postData = {
        token: wx.getStorageSync('token'),
        nick: this.data.nick,
      }
      const res = await WXAPI.modifyUserInfo(postData)
      if (res.code != 0) {
        wx.showToast({
          title: res.msg,
          icon: 'none'
        })
        return
      }
      wx.showToast({
        title: '保存成功',
      })
      this.setData({
        show: false
      })
      getApp().getUserApiInfo()
    },
    async onChooseAvatar(e) {
      let avatarUrl = e.detail.avatarUrl
      let res = await WXAPI.uploadFileV2(wx.getStorageSync('token'), avatarUrl)
      if (res.code != 0) {
        wx.showToast({
          title: res.msg,
          icon: 'none'
        })
        return
      }
      avatarUrl = res.data.url
      res = await WXAPI.modifyUserInfo({
        token: wx.getStorageSync('token'),
        avatarUrl,
      })
      if (res.code != 0) {
        wx.showToast({
          title: res.msg,
          icon: 'none'
        })
        return
      }
      this.setData({
        avatarUrl
      })
    },
    jump() {
      this.setData({
        show: false
      })
    }
  }
})