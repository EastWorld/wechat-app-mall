const WXAPI = require('apifm-wxapi')

Page({
  data: {
    
  },
  onLoad(e) {
    this.recycleOrders()
  },
  onShow() {

  },
  async recycleOrders() {
    wx.showLoading({
      title: '',
    })
    const res = await WXAPI.recycleOrders({
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
    this.recycleOrders()
    wx.stopPullDownRefresh()
  },
  detail(e) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/recycle/order-detail?id=${id}`,
    })
  }
})