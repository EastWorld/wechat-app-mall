const WXAPI = require('apifm-wxapi')
const app = getApp()
Page({
  data: {},
  onLoad: function (e) {
    this.data.orderId = e.id
    this.data.trackingNumber = e.trackingNumber
    this.orderDetail()
  },
  onShow: function () {
  },
  async orderDetail() {
    // https://www.yuque.com/apifm/nu0f75/oamel8
    const res = await WXAPI.orderDetail(wx.getStorageSync('token'), this.data.orderId)
    if (res.code != 0) {
      wx.showModal({
        title: '错误',
        content: res.msg,
        showCancel: false,
        success: () => {
          wx.navigateBack()
        }
      })
      return;
    }
    const orderLogisticsShippers = res.data.orderLogisticsShippers
    let trackingNumber = this.data.trackingNumber
    if (!trackingNumber) {
      trackingNumber = res.data.logistics.trackingNumber
    }
    let shipperName = this.data.shipperName
    if (!shipperName) {
      shipperName = res.data.logistics.shipperName
    }
    let logisticsTraces = null
    if (this.data.trackingNumber && orderLogisticsShippers) {
      // 查看子快递单
      const entity = orderLogisticsShippers.find(ele => { return ele.trackingNumber == this.data.trackingNumber })
      if (entity.traces) {
        entity.tracesArray = JSON.parse (entity.traces)
        logisticsTraces = entity.tracesArray.reverse()
      }
    } else {
      if (res.data.logisticsTraces) {
        logisticsTraces = res.data.logisticsTraces.reverse()
      }
    }
    this.setData({
      trackingNumber,
      shipperName,
      orderDetail: res.data,
      logisticsTraces
    });
  },
})
