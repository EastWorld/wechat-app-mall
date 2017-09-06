const app = getApp()

Page({
	data: {
		userInfo: {}
	},
  onPullDownRefresh() {
    console.log('--------下拉刷新-------')
    wx.showNavigationBarLoading() //在标题栏中显示加载
    this.onLoad()
    wx.stopPullDownRefresh() //停止下拉刷新
    wx.hideNavigationBarLoading() //完成停止加载
  },
  onReachBottom: function () {
    console.log('我的ReachBottom')
    wx.hideNavigationBarLoading() //完成停止加载
  },
	onLoad() {
    this.getUserInfo();
    this.setData({
      version: app.globalData.version
    });
    this.getUserApiInfo ();
	},	
  getUserInfo: function (cb) {
      var that = this
      wx.login({
        success: function () {
          wx.getUserInfo({
            success: function (res) {
              that.setData({
                userInfo: res.userInfo
              });
            }
          })
        }
      })
  },
  aboutUs : function () {
    wx.showModal({
      title: '关于我们',
      content: '本系统基于开源小程序商城系统 https://github.com/EastWorld/wechat-app-mall 搭建，祝大家使用愉快！',
      showCancel:false
    })
  },
  aboutTianGuoGuo : function (){
    wx.showModal({
      title: '甜果果小铺',
      content: '甜果果，专注馆陶县城周边水果零售外卖业务，将最新鲜最实惠的水果送到您的身边使我们一直不断的追求，甜果果携全体店员时刻准备着，竭诚为您服务！',
      showCancel: false
    })
  },
  getPhoneNumber: function(e) {
    if (!e.detail.errMsg || e.detail.errMsg != "getPhoneNumber:ok") {
      wx.showModal({
        title: '提示',
        content: '无法获取手机号码',
        showCancel: false
      })
      return;
    }
    var that = this;
    wx.request({
      url: 'https://api.it120.cc/' + app.globalData.subDomain + '/user/wxapp/bindMobile',
      data: {
        token: app.globalData.token,
        encryptedData: e.detail.encryptedData,
        iv: e.detail.iv
      },
      success: function (res) {
        if (res.data.code == 0) {
          wx.showToast({
            title: '绑定成功',
            icon: 'success',
            duration: 2000
          })
          that.getUserApiInfo();
        } else {
          wx.showModal({
            title: '提示',
            content: '绑定失败',
            showCancel: false
          })
        }
      }
    })
  },
  getUserApiInfo: function () {
    var that = this;
    wx.request({
      url: 'https://api.it120.cc/' + app.globalData.subDomain + '/user/detail',
      data: {
        token: app.globalData.token
      },
      success: function (res) {
        if (res.data.code == 0) {
          that.setData({
            apiUserInfoMap: res.data.data,
            userMobile: res.data.data.base.mobile
          });
        }
      }
    })

  }
})