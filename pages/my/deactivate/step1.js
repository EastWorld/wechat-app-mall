Page({
  goBack() {
    wx.navigateBack()
  },
  goNext() {
    wx.navigateTo({ url: '/pages/my/deactivate/step2' })
  },
})
