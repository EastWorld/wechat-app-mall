const WXAPI = require('apifm-wxapi')
const AUTH = require('../../utils/auth')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    growth: 0.00,
    page: 1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(e) {
    AUTH.checkHasLogined().then(isLogined => {
      if (isLogined) {
        this.userAmountV2()
        this.growthLogsV2()
      } else {
        getApp().loginOK = () => {
          this.userAmountV2()
          this.growthLogsV2()
        }
      }
    })
  },
  onShow: function () {
  },
  onReachBottom() {
    this.data.page++
    this.growthLogsV2()
  },
  async userAmountV2() {
    // https://www.yuque.com/apifm/nu0f75/wrqkcb
    const res = await WXAPI.userAmountV2(wx.getStorageSync('token'))
    if (res.code == 0) {
      this.setData({
        growth: res.data.growth
      })
    }
  },
  async growthLogsV2() {
    wx.showLoading({
      title: '',
    })
    // https://www.yuque.com/apifm/nu0f75/gpb15y
    const res = await WXAPI.growthLogsV2({
      token: wx.getStorageSync('token'),
      page: this.data.page,
    })
    wx.hideLoading()
    if (res.code == 0) {
      if (this.data.page == 1) {
        this.setData({
          cashlogs: res.data.result
        })
      } else {
        this.setData({
          cashlogs: this.data.cashlogs.concat(res.data.result)
        })
      }
    } else {
      if (this.data.page == 1) {
        this.setData({
          cashlogs: null
        })
      }
    }
  },
  exchangeGrowth: function (e) {
    wx.navigateTo({
      url: '/pages/score-excharge/growth',
    })
  }
})