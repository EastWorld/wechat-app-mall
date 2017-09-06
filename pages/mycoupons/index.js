//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    coupons:[]
  },
  onPullDownRefresh() {
    console.log('--------下拉刷新-------')
    wx.showNavigationBarLoading() //在标题栏中显示加载
    this.onShow()
    wx.stopPullDownRefresh() //停止下拉刷新
    wx.hideNavigationBarLoading() //完成停止加载
  },
  onReachBottom: function () {
    console.log('首页ReachBottom')
    wx.hideNavigationBarLoading() //完成停止加载
  },
  onLoad: function () {
  },
  onShow : function () {
    this.getMyCoupons();
  },
  getMyCoupons: function () {
    var that = this;
    wx.request({
      url: 'https://api.it120.cc/' + app.globalData.subDomain + '/discounts/my',
      data: {
        token: app.globalData.token,
        status: 0
      },
      success: function (res) {
        if (res.data.code == 0) {
          var coupons = res.data.data;
          if (coupons.length > 0) {
            that.setData({
              coupons: coupons
            });
          }
        }
      }
    })
  },
  goBuy:function(){
    wx.reLaunch({
      url: '/pages/index/index'
    })
  }

})
