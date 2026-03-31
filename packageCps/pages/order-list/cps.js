const WXAPI = require('apifm-wxapi')

Page({
  data: {
    tabIndex: 0,
    page: 1
  },
  onLoad(e) {
    this.cpsJdOrders()
  },
  onShow() {

  },
  tabChange(e) {
    this.setData({
      page: 1,
      tabIndex: e.detail.index
    })
    if (e.detail.index == 0) {
      this.cpsJdOrders()
    }
    if (e.detail.index == 1) {
      this.cpsPddOrders()
    }
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
  async cpsPddOrders() {
    wx.showLoading({
      title: '',
    })
    const res = await WXAPI.cpsPddOrders({
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
    this.setData({
      page: 1
    })
    if (this.data.tabIndex == 0) {
      this.cpsJdOrders()
    }
    if (this.data.tabIndex == 1) {
      this.cpsPddOrders()
    }
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