//index.js
//获取应用实例
const api = require('../../utils/request.js')
var app = getApp()
Page({
  data: {},
  onLoad: function (e) {
    var orderId = e.id;
    this.data.orderId = orderId;
  },
  onShow: function () {
    var that = this;
    api.fetchRequest('/order/detail', {
      token: wx.getStorageSync('token'),
      id: that.data.orderId
    }).then(function (res) {
      if (res.data.code != 0) {
        wx.showModal({
          title: '错误',
          content: res.data.msg,
          showCancel: false
        })
        return;
      }
      that.setData({
        orderDetail: res.data.data,
        logisticsTraces: res.data.data.logisticsTraces.reverse()
      });
    }).finally(res => {
      wx.hideLoading();
    })
  }
})
