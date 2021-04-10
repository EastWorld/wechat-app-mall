const WXAPI = require('apifm-wxapi')

Page({
  data: {
    tabIndex: 0
  },
  onLoad(e) {
    this.cpsJdOrders()
  },
  onShow() {

  },
  tabChange(e) {
    this.setData({
      tabIndex: e.detail.index
    })
  },
  async cpsJdOrders() {
    wx.showLoading({
      title: '',
    })
    const res = await WXAPI.cpsJdOrders({
      token: wx.getStorageSync('token')
    })
    wx.hideLoading()
    if (res.code == 0) {
      this.setData({
        list: res.data.result
      })
    }
  },
  onPullDownRefresh() {
    this.cpsJdOrders()
    wx.stopPullDownRefresh()
  },
  huishou(e) {
    console.log(e);
    const type = e.currentTarget.dataset.type
    const orderId = e.currentTarget.dataset.orderid
    const platform = e.currentTarget.dataset.platform
    wx.navigateTo({
      url: `/pages/recycle/index?type=${type}&orderId=${orderId}&platform=${platform}`,
    })
  }
})