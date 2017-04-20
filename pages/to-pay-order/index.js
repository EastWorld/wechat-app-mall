//index.js
//获取应用实例
var app = getApp()

Page({
  data: {

  },

 
  onLoad: function (e) {
    console.log('onLoad');

  },
  bindGuiGeTap: function() {
     this.setData({  
        hideShopPopup: false 
    })  
  }
})
