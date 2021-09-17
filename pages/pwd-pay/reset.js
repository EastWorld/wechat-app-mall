const WXAPI = require('apifm-wxapi')
const AUTH = require('../../utils/auth')
Page({
  data: {

  },
  onLoad: function (options) {

  },
  onShow: function () {
    AUTH.wxaCode().then(code => {
      this.data.code = code
    })
    this.getUserApiInfo()
  },
  async getUserApiInfo() {
    const res = await WXAPI.userDetail(wx.getStorageSync('token'))
    if (res.code == 2000) {
      AUTH.login(this)
      return
    }
    if (res.code == 0) {
      this.setData({
        mobile: res.data.base.mobile
      })
    }
  },
  async sendSms() {
    const res = await WXAPI.smsValidateCodeByToken(wx.getStorageSync('token'))
    if (res.code == 2000) {
      AUTH.login(this)
      return
    }
    if (res.code == 0) {
      this.setData({
        smsloading: true,
        smsloadingSecond: 60
      })
      wx.showToast({
        title: '短信已发送',
      })
      this.countDown()
    } else {
      wx.showToast({
        title: res.msg,
        icon: 'none'
      })
    }
  },
  countDown() {
    const smsloadingSecond = this.data.smsloadingSecond
    if (smsloadingSecond) {
      this.setData({
        smsloadingSecond: smsloadingSecond-1
      })
      setTimeout(() => {
        this.countDown()
      }, 1000);
    } else {
      this.setData({
        smsloading: false
      })
    }
  },
  async submit() {
    if (!this.data.mobile) {
      wx.showToast({
        title: '请先绑定手机号码',
        icon: 'none'
      })
      return
    }
    if (!this.data.code) {
      wx.showToast({
        title: '请输入短信验证码',
        icon: 'none'
      })
      return
    }
    if (!this.data.pwd) {
      wx.showToast({
        title: '请输入交易密码',
        icon: 'none'
      })
      return
    }
    if (!this.data.pwd2) {
      wx.showToast({
        title: '请再次输入交易密码',
        icon: 'none'
      })
      return
    }
    if (this.data.pwd != this.data.pwd2) {
      wx.showToast({
        title: '两次输入不一致',
        icon: 'none'
      })
      return
    }
    const res = await WXAPI.resetPayPassword(this.data.mobile, this.data.code, this.data.pwd)
    if (res.code == 2000) {
      AUTH.login(this)
      return
    }
    if (res.code != 0) {
      wx.showToast({
        title: res.msg,
        icon: 'none'
      })
      return
    }
    wx.showToast({
      title: '设置成功'
    })
    setTimeout(() => {
      wx.navigateBack({
        delta: 0,
      })
    }, 1000);
  },
  getPhoneNumber: function(e) {
    if (!e.detail.errMsg || e.detail.errMsg != "getPhoneNumber:ok") {
      wx.showModal({
        title: '提示',
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
      res = await WXAPI.wxappServiceBindMobile({
        token: wx.getStorageSync('token'),
        code: this.data.code,
        encryptedData: e.detail.encryptedData,
        iv: e.detail.iv,
      })
    } else {
      res = await WXAPI.bindMobileWxapp(wx.getStorageSync('token'), this.data.code, e.detail.encryptedData, e.detail.iv)
    }
    AUTH.wxaCode().then(code => {
      this.data.code = code
    })
    if (res.code === 10002) {
      AUTH.login(this)
      return
    }
    if (res.code == 0) {
      wx.showToast({
        title: '绑定成功',
        icon: 'success',
        duration: 2000
      })
      this.getUserApiInfo();
    } else {
      wx.showModal({
        title: '提示',
        content: res.msg,
        showCancel: false
      })
    }
  },
})