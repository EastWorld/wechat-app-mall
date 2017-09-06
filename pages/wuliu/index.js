//index.js
//获取应用实例
var app = getApp()
Page({
  data: {},
  onPullDownRefresh() {
    console.log('--------下拉刷新-------')
    wx.showNavigationBarLoading() //在标题栏中显示加载
    this.onLoad()
    wx.stopPullDownRefresh() //停止下拉刷新
    wx.hideNavigationBarLoading() //完成停止加载
  },
  onReachBottom: function () {
    console.log('ReachBottom')
    wx.hideNavigationBarLoading() //完成停止加载
  },
  onLoad: function (e) {
    var orderId = e.id;
    this.data.orderId = orderId;
  },
  onShow: function () {
    var that = this;
    wx.request({
      url: 'https://api.it120.cc/' + app.globalData.subDomain + '/order/detail',
      data: {
        token: app.globalData.token,
        id: that.data.orderId
      },
      success: (res) => {
        wx.hideLoading();
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
      }
    })
  }
})
