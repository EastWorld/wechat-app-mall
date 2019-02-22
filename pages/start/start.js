const WXAPI = require('../../wxapi/main')
const CONFIG = require('../../config.js')
//获取应用实例
var app = getApp();
Page({
  data: {
    banners:[
      {
        id:1,
        picUrl: 'https://cdn.it120.cc/apifactory/2019/02/21/2d2717a2ab4782d5e752ec087b9fa5fe.png'
      },
      {
        id: 2,
        picUrl: 'https://cdn.it120.cc/apifactory/2019/02/21/e04ec54592d16c98fc79eb0107a12731.png'
      },
      {
        id: 3,
        picUrl: 'https://cdn.it120.cc/apifactory/2019/02/21/70bccd7ef011cbf7c72cdfac1eb157e8.png'
      } 
    ],
    swiperMaxNumber: 3,
    swiperCurrent: 0,
    height: wx.getSystemInfoSync().windowHeight
  },
  onLoad:function(){    
    wx.setNavigationBarTitle({
      title: wx.getStorageSync('mallName')
    })
    const app_show_pic_version = wx.getStorageSync('app_show_pic_version')
    if (app_show_pic_version && app_show_pic_version == CONFIG.version) {
      wx.switchTab({
        url: '/pages/index/index',
      });
    }
  },
  onShow:function(){
    
  },
  swiperchange: function (e) {
    //console.log(e.detail.current)
    this.setData({
      swiperCurrent: e.detail.current
    })
  },
  goToIndex: function (e) {
    WXAPI.addTempleMsgFormid({
      token: wx.getStorageSync('token'),
      type: 'form',
      formId: e.detail.formId
    })
    if (app.globalData.isConnected) {
      wx.setStorage({
        key: 'app_show_pic_version',
        data: CONFIG.version
      })
      wx.switchTab({
        url: '/pages/index/index',
      });
    } else {
      wx.showToast({
        title: '当前无网络',
        icon: 'none',
      })
    }
  }
});