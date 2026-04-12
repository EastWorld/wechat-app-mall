const WXAPI = require('apifm-wxapi')
const AUTH = require('../../../utils/auth')

Page({
  data: {
    inputVal: '',
    deleting: false,
  },
  goBack() {
    wx.navigateBack()
  },
  async confirmDelete() {
    if (this.data.inputVal !== '注销' || this.data.deleting) return
    this.setData({ deleting: true })
    const token = wx.getStorageSync('token')
    const res = await WXAPI.userDelete(token)
    if (res.code == 0) {
      wx.showToast({ title: '账号已注销', icon: 'success' })
      setTimeout(() => {
        AUTH.loginOut()
        wx.reLaunch({ url: '/pages/login/index' })
      }, 1500)
    } else {
      this.setData({ deleting: false })
      wx.showToast({ title: res.msg || '注销失败，请重试', icon: 'none' })
    }
  },
})
