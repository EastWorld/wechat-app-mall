const WXAPI = require('apifm-wxapi')
const AUTH = require('../../utils/auth')
Page({
  data: {

  },
  onLoad(options) {
  },
  onShow() {

  },
  xieyiChange(e) {
    this.setData({
      checked: e.detail,
    })
  },
  goxieyi(e) {
    wx.navigateTo({
      url: '/pages/about/index?key=' + e.currentTarget.dataset.key,
    })
  },
  showModal2() {
    wx.showModal({
      title: '温馨提示',
      content: '已经阅读并同意《用户协议》、《隐私协议》',
      cancelText: '不同意',
      confirmText: '同意',
      success: res => {
        if (res.confirm) {
          this.setData({
            checked: true
          })
        }
      }
    })
  },
  showModal(action) {
    wx.showModal({
      title: '温馨提示',
      content: '已经阅读并同意《用户协议》、《隐私协议》',
      cancelText: '不同意',
      confirmText: '同意',
      success: res => {
        if (res.confirm) {
          this.setData({
            checked: true
          })
          if (action == 'loginOne') {
            this.loginOne()
          }
        }
      }
    })
  },
  async loginOne() {
    if (!this.data.checked) {
      this.showModal('loginOne')
      return
    }
    const res = await AUTH.login20241025()
    if (res.code == 10000) {
      // 用户不存在
      wx.showModal({
        content: '您还未注册，请使用《手机号安全登陆》方式登陆',
        showCancel: false
      })
      return
    }
    if (res.code != 0) {
      // 登录错误
      return
    }
    wx.reLaunch({
      url: '/pages/index/index',
    })
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
    let referrer = '' // 推荐人
    let referrer_storge = wx.getStorageSync('referrer');
    if (referrer_storge) {
      referrer = referrer_storge;
    }
    wx.showLoading({
      title: '',
    })
    const code = await AUTH.wxaCode()
    // https://www.yuque.com/apifm/nu0f75/yiglsl
    const res = await WXAPI.loginWxaMobileV3({
      code,
      codeMobile: e.detail.code,
      autoReg: true,
      referrer
    })
    wx.hideLoading()
    if (res.code != 0) {
      // 登录错误
      return
    }
    wx.setStorageSync('token', res.data.token)
    wx.setStorageSync('uid', res.data.uid)
    wx.setStorageSync('openid', res.data.openid)
    wx.setStorageSync('mobile', res.data.mobile)
    wx.reLaunch({
      url: '/pages/index/index',
    })
  },
})