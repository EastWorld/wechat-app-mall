//index.js
const api = require('../../utils/request.js')
//获取应用实例
var app = getApp()
Page({
  data: {
    addressList: []
  },

  selectTap: function(e) {
    var id = e.currentTarget.dataset.id;
    api.fetchRequest('/user/shipping-address/update', {
      token: wx.getStorageSync('token'),
      id: id,
      isDefault: 'true'
    }).then(function(res) {
      wx.navigateBack({})
    })
  },

  addAddess: function() {
    wx.navigateTo({
      url: "/pages/address-add/index"
    })
  },

  editAddess: function(e) {
    wx.navigateTo({
      url: "/pages/address-add/index?id=" + e.currentTarget.dataset.id
    })
  },

  onLoad: function() {
    console.log('onLoad')


  },
  onShow: function() {
    this.initShippingAddress();
  },
  initShippingAddress: function() {
    var that = this;
    api.fetchRequest('/user/shipping-address/list', {
      token: wx.getStorageSync('token')
    }).then(function(res) {
      if (res.data.code == 0) {
        that.setData({
          addressList: res.data.data
        });
      } else if (res.data.code == 700) {
        that.setData({
          addressList: null
        });
      }
    })
  }

})