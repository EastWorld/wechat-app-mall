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
  },
  async recycleOrderClose(e) {
    wx.showModal({
      title: '提示',
      content: '确认要取消该订单吗？',
      success: res => {
        if (res.confirm) {
          this._recycleOrderClose(e)
        }
      }
    })
  },
  async _recycleOrderClose(e) {
    const id = e.currentTarget.dataset.id
    const res = await WXAPI.recycleOrderClose(wx.getStorageSync('token'), id)
    if (res.code != 0) {
      wx.showToast({
        title: res.msg,
        icon: 'none'
      })
      return
    }
    wx.showToast({
      title: '已取消',
    })
    this.recycleOrders()
  },
  async recycleOrderDelete(e) {
    wx.showModal({
      title: '提示',
      content: '确认要删除该订单吗？',
      success: res => {
        if (res.confirm) {
          this._recycleOrderDelete(e)
        }
      }
    })
  },
  async _recycleOrderDelete(e) {
    const id = e.currentTarget.dataset.id
    const res = await WXAPI.recycleOrderDelete(wx.getStorageSync('token'), id)
    if (res.code != 0) {
      wx.showToast({
        title: res.msg,
        icon: 'none'
      })
      return
    }
    wx.showToast({
      title: '删除成功',
    })
    this.recycleOrders()
  }
})