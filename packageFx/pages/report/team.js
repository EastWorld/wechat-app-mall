const WXAPI = require('apifm-wxapi')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    page: 1 // 读取第几页
  },

  onLoad(e) {
    this.data.teamId = e.teamId
    this.fxTeamReport()
  },
  onShow: function () {

  },
  async fxTeamReport() {
    const res = await WXAPI.fxTeamReport({
      token: wx.getStorageSync('token'),
      teamId: this.data.teamId,
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
    this.fxTeamReport()
  },
  onPullDownRefresh: function() {
    this.data.page = 1
    this.fxTeamReport()
    wx.stopPullDownRefresh()
  },
})