const WXAPI = require('apifm-wxapi')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    page: 1 // 读取第几页
  },

  onLoad(e) {
    this.data.provinceId = e.provinceId
    this.data.cityId = e.cityId
    this.fxCityReport()
  },
  onShow: function () {

  },
  async fxCityReport() {
    const res = await WXAPI.fxCityReport({
      token: wx.getStorageSync('token'),
      provinceId: this.data.provinceId,
      cityId: this.data.cityId,
      page: this.data.page
    })
    if (res.code == 700) {
      if (this.data.page == 1) {
        this.setData({
          members: []
        })
      } else {
        wx.showToast({
          title: '没有更多了',
          icon: 'none'
        })
      }
    }
    if (res.code == 0) {
      if (this.data.page == 1) {
        this.setData({
          members: res.data.result
        })
      } else {
        this.setData({
          members: this.data.members.concat(res.data.result)
        })
      }
    }
  },
  onReachBottom: function() {
    this.data.page += 1
    this.fxCityReport()
  },
  onPullDownRefresh: function() {
    this.data.page = 1
    this.fxCityReport()
    wx.stopPullDownRefresh()
  },
})