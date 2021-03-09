const app = getApp()
const WXAPI = require('apifm-wxapi')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    commisionLog: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.adPosition()
  },
  onShow: function () {
    const _this = this
    WXAPI.fxCommisionLog({
      token: wx.getStorageSync('token')
    }).then(res => {
      if (res.code == 0) {
        _this.setData({
          commisionLog: res.data.result
        })
      } else {
        _this.setData({
          commisionLog: []
        })
      }
    })
  },
  async adPosition() {
    const res = await WXAPI.adPosition('fx-top-pic')
    if (res.code == 0) {
      this.setData({
        adPositionFxTopPic: res.data
      })
    }
  },
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  }
})