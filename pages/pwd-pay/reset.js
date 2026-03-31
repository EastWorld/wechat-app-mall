const WXAPI = require('apifm-wxapi')
const AUTH = require('../../utils/auth')
Page({
  data: {

  },
  onLoad: function (options) {

  },
  onShow: function () {
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
  bindMobile() {
    this.setData({
      bindMobileShow: true
    })
  },
  bindMobileOk(e) {
    console.log(e.detail); // 这里是组件里data的数据
    this.setData({
      bindMobileShow: false
    })
    this.getUserApiInfo()
  },
  bindMobileCancel() {
    this.setData({
      bindMobileShow: false
    })
  },
})