const app = getApp()
const WXAPI = require('apifm-wxapi')
const AUTH = require('../../utils/auth')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    growth: 0.00,
    cashlogs: undefined
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    AUTH.checkHasLogined().then(isLogined => {
      if (isLogined) {
        this.initData()
      } else {
        getApp().loginOK = () => {
          this.initData()
        }
      }
    })
  },
  onShow: function () {
  },
  initData: function () {
    const _this = this
    const token = wx.getStorageSync('token')
    WXAPI.userAmount(token).then(function (res) {
      if (res.code == 0) {
        _this.setData({
          growth: res.data.growth
        });
      } else {
        wx.showToast({
          title: res.msg,
          icon: 'none'
        })
      }
    })
    // 读取积分明细
    WXAPI.growthLogs({
      token: token,
      page: 1,
      pageSize: 50
    }).then(res => {
      if (res.code == 0) {
        _this.setData({
          cashlogs: res.data.result
        })
      }
    })
  },
  recharge: function (e) {
    wx.navigateTo({
      url: "/pages/recharge/index"
    })
  },
  withdraw: function (e) {
    wx.navigateTo({
      url: "/pages/withdraw/index"
    })
  }
})