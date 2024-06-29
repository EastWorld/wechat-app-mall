const WXAPI = require('apifm-wxapi')
const dayjs = require("dayjs")
Page({
  data: {
    active: 0,
    tabs: ['本月', '今天', '昨天'],
    page: 1,
    month: undefined,
    today: undefined,
    yesday: undefined,
  },
  onLoad(options) {
    this.setData({
      month: dayjs().format('YYYYMM'),
      today: dayjs().format('YYYYMMDD'),
      yesday: dayjs().add(-1, 'day').format('YYYYMMDD'),
    })
    this.peisongMemberStatistics()
  },
  onShow() {

  },
  onReachBottom() {
    this.data.page++
    this.peisongMemberStatistics()
  },
  tabClick(e) {
    this.data.page = 1
    this.setData({
      active: e.detail.index
    })
    this.peisongMemberStatistics()
  },
  async peisongMemberStatistics() {
    wx.showLoading({
      title: ''
    })
    const data = {
      token: wx.getStorageSync('token'),
      page: this.data.page,
    }
    if (this.data.active == 0) {
      data.day = this.data.month
    } else if (this.data.active == 1) {
      data.day = this.data.today
    } else if (this.data.active == 2) {
      data.day = this.data.yesday
    }
    const res = await WXAPI.peisongMemberStatistics(data)
    wx.hideLoading()
    if (res.code == 0) {
      if (this.data.page == 1) {
        this.setData({
          list: res.data.result
        })
      } else {
        this.setData({
          list: this.data.list.concat(res.data.result)
        })
      }
    } else {
      if (this.data.page > 1) {
        wx.showToast({
          title: '没有更多了~',
          icon: 'none'
        })
      } else {
        this.setData({
          list: null
        })
      }
    }
  },
})