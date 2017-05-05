//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    addressList:[]
  },

  selectTap: function (e) {
    var id = e.currentTarget.dataset.id;
    wx.request({
      url: 'https://api.it120.cc/'+ app.globalData.subDomain +'/user/shipping-address/update',
      data: {
        token:app.globalData.token,
        id:id,
        isDefault:'true'
      },
      success: (res) =>{
        wx.navigateBack({})
      }
    })
  },

  deleteAddress : function (e) {
    var that = this;
    var id = e.currentTarget.dataset.id;
    wx.showModal({
      title: '提示',
      content: '确定要删除该收货地址吗？',
      success: function(res) {
        if (res.confirm) {
          wx.request({
            url: 'https://api.it120.cc/'+ app.globalData.subDomain +'/user/shipping-address/delete',
            data: {
              token:app.globalData.token,
              id:id
            },
            success: (res) =>{
              that.setData({
                addressList:[]
              });
              that.initShippingAddress();
              console.log(res.data)
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },

  addAddess : function () {
    wx.navigateTo({
      url:"/pages/address-add/index"
    })
  },
  
  onLoad: function () {
    console.log('onLoad')

   
  },
  onShow : function () {
    this.initShippingAddress();
  },
  initShippingAddress: function () {
    var that = this;
    wx.request({
      url: 'https://api.it120.cc/'+ app.globalData.subDomain +'/user/shipping-address/list',
      data: {
        token:app.globalData.token
      },
      success: (res) =>{
        if (res.data.code == 0) {
          that.setData({
            addressList:res.data.data
          });
        }
      }
    })
  }

})
