//index.js
const api = require('../../utils/request.js')
//获取应用实例
var app = getApp()
Page({
  data: {
    coupons: []
  },
  onLoad: function() {},
  onShow: function() {
    this.getMyCoupons();
  },
  getMyCoupons: function() {
    var that = this;
    api.fetchRequest('/discounts/my', {
      token: wx.getStorageSync('token'),
      status: 0
    }).then(function(res) {
      if (res.data.code == 0) {
        var coupons = res.data.data;
        if (coupons.length > 0) {
          that.setData({
            coupons: coupons
          });
        }
      }
    })
  },
  goBuy: function() {
    wx.reLaunch({
      url: '/pages/index/index'
    })
  }

})