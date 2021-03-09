const WXAPI = require('apifm-wxapi')
const app = getApp()
Page({
  data: {},
  onLoad: function (e) {
    var orderId = e.id;
    this.data.orderId = orderId;
  },
  onShow: function () {
    var that = this;
    WXAPI.orderDetail(wx.getStorageSync('token'), that.data.orderId).then(function (res) {
      if (res.code != 0) {
        wx.showModal({
          title: '错误',
          content: res.msg,
          showCancel: false
        })
        return;
      }
      that.setData({
        orderDetail: res.data,
        logisticsTraces: res.data.logisticsTraces.reverse()
      });
    })
  }
})
