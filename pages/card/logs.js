const WXAPI = require('apifm-wxapi')
Page({

  data: {
    page: 1 // 读取第几页
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data.cardId = options.id
    this.cardMyLogs()
  },
  async cardMyLogs(){
    wx.showLoading({
      title: '',
    })
    const res = await WXAPI.cardMyLogs({
      token: wx.getStorageSync('token'),
      cardId: this.data.cardId,
      page: this.data.page
    })
    wx.hideLoading()
    if (res.code == 0) {
      if (this.data.page == 1) {
        this.setData({
          list: res.data.result,
        })
      } else {
        this.setData({
          list: this.data.list.concat(res.data.result),
        })
      }
    } else {
      if (this.data.page == 1) {
        this.setData({
          list: null,
        })
      } else {
        wx.showToast({
          title: '没有更多了',
          icon: 'none'
        })
      }
    }
  },
  onPullDownRefresh: function () {
    this.data.page = 1
    this.cardMyLogs()
    wx.stopPullDownRefresh()
  },
  onReachBottom() {
    this.data.page++
    this.cardMyLogs()
  },
})