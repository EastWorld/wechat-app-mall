const WXAPI = require('../../wxapi/main')
//获取应用实例
const app = getApp()
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
    WXAPI.myCoupons({
      token: wx.getStorageSync('token'),
      status: 0
    }).then(function(res) {
      if (res.code == 0) {
        var coupons = res.data;
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