const AUTH = require('../../../utils/auth')

Page({
  goBack() {
    wx.navigateBack()
  },
  goNext() {
    wx.navigateTo({ url: '/pages/my/deactivate/step3' })
  },
  loginOut() {
    wx.showModal({
      title: '退出登录',
      content: '确定要退出登录吗？您的账号数据将完整保留。',
      confirmText: '退出登录',
      cancelText: '取消',
      success(res) {
        if (res.confirm) {
          AUTH.loginOut()
          wx.reLaunch({ url: '/pages/login/index' })
        }
      }
    })
  },
})
