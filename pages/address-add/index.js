//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    
  },

  bindSave: function() {
    console.log("保存");
  },
  bindCancel: function() {
    console.log("取消");
  },
  bindDelete: function() {
    wx.showModal({
      title: '确定要删除这个地址吗？',
      content: '',
      success: function(res) {
        if (res.confirm) {
          console.log('用户点击确定')
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  onLoad: function () {
    console.log('onLoad')
  }
})
