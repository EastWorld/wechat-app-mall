const WXAPI = require('apifm-wxapi')
const CONFIG = require('../../config.js')
Page({
  data: {
    banners:[],
    swiperMaxNumber: 0,
    swiperCurrent: 0
  },
  onLoad(e){
    // e.shopId = 6040 // 测试，测试完了注释掉
    this.data.shopId = e.shopId
    this.readConfigVal()
    // 补偿写法
    getApp().configLoadOK = () => {
      this.readConfigVal()
    }
  },
  onShow:function(){
    
  },
  async readConfigVal() {
    const mallName = wx.getStorageSync('mallName')
    if (!mallName) {
      return
    }
    wx.setNavigationBarTitle({
      title: wx.getStorageSync('mallName')
    })
    let shopMod = wx.getStorageSync('shopMod')
    if (!shopMod) {
      shopMod = 0
    }
    const app_show_pic_version = wx.getStorageSync('app_show_pic_version')
    if (app_show_pic_version && app_show_pic_version == CONFIG.version) {
      if (shopMod==1) {
        this.goShopSelectPage()
      } else {
        wx.switchTab({
          url: '/pages/index/index',
        })
      }
    } else {
      // 展示启动页
      const res = await WXAPI.banners({
        type: 'app'
      })
      if (res.code == 700) {
        if (shopMod==1) {
          this.goShopSelectPage()
        } else {
          wx.switchTab({
            url: '/pages/index/index',
          })
        }
      } else {
        this.setData({
          banners: res.data,
          swiperMaxNumber: res.data.length
        });
      }
    }
  },
  swiperchange: function (e) {
    //console.log(e.detail.current)
    this.setData({
      swiperCurrent: e.detail.current
    })
  },
  goLeft() {
    if (this.data.swiperCurrent == 0) {
      this.setData({
        swiperCurrent: this.data.swiperMaxNumber - 1
      })
    } else {
      this.setData({
        swiperCurrent: this.data.swiperCurrent - 1
      })
    }
  },
  goRight() {
    if (this.data.swiperCurrent == this.data.swiperMaxNumber - 1) {
      this.setData({
        swiperCurrent: 0
      })
    } else {
      this.setData({
        swiperCurrent: this.data.swiperCurrent + 1
      })
    }
  },
  goToIndex: function (e) {
    let shopMod = wx.getStorageSync('shopMod')
    if (!shopMod) {
      shopMod = 0
    }
    if (getApp().globalData.isConnected) {
      wx.setStorage({
        key: 'app_show_pic_version',
        data: CONFIG.version
      })
      if (shopMod == 1) {
        this.goShopSelectPage()
      } else {
        wx.switchTab({
          url: '/pages/index/index',
        });
      }
    } else {
      wx.showToast({
        title: '当前无网络',
        icon: 'none',
      })
    }
  },
  async goShopSelectPage() {
    if (!this.data.shopId) {
      wx.redirectTo({
        url: '/pages/shop/select'
      })
      return
    }
    // 有传入门店ID
    const res = await WXAPI.shopSubdetail(this.data.shopId)
    if (res.code != 0) {
      wx.redirectTo({
        url: '/pages/shop/select'
      })
      return
    }
    wx.setStorageSync('shopInfo', res.data.info)
    wx.setStorageSync('shopIds', res.data.info.id)
    wx.switchTab({
      url: '/pages/index/index'
    })
  }
});