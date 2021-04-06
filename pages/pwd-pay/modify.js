const WXAPI = require('apifm-wxapi')
const AUTH = require('../../utils/auth')
Page({
  data: {

  },
  onLoad: function (options) {

  },
  onShow: function () {

  },
  async submit() {
    if (!this.data.pwdOld) {
      wx.showToast({
        title: '请输入原来的交易密码',
        icon: 'none'
      })
      return
    }
    if (!this.data.pwd) {
      wx.showToast({
        title: '请输入新的交易密码',
        icon: 'none'
      })
      return
    }
    if (!this.data.pwd2) {
      wx.showToast({
        title: '请再次输入新的交易密码',
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
    const res = await WXAPI.modifyPayPassword(wx.getStorageSync('token'), this.data.pwdOld, this.data.pwd)
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
      title: '修改成功'
    })
    setTimeout(() => {
      wx.navigateBack({
        delta: 0,
      })
    }, 1000);
  },
})