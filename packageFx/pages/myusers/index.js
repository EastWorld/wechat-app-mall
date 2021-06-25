const WXAPI = require('apifm-wxapi')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    number1: 0, // 直推用户数
    number2: 0, // 间推用户数
    activeIndex: 0, // tab点亮索引
    page: 1 // 读取第几页
  },

  onLoad: function () {
    this.fxMembersStatistics()
    this.fxMembers()
  },
  onShow: function () {

  },
  async fxMembersStatistics() {
    const res = await WXAPI.fxMembersStatistics(wx.getStorageSync('token'))
    if (res.code == 0) {
      this.setData({
        number1: res.data.totleFansLevel1,
        number2: res.data.totleFansLevel2
      })
    }
  },
  async fxMembers() {
    const res = await WXAPI.fxMembers({
      token: wx.getStorageSync('token'),
      page: this.data.page,
      level: this.data.activeIndex == 0 ? 1 : 2
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
      const statisticsCommisionMap = res.data.statisticsCommisionMap
      const userCashMap = res.data.userCashMap
      res.data.result.forEach(ele => {
        if (!ele.avatarUrls) {
          ele.avatarUrls = '/images/face.png'
        }
        if (!ele.nicks) {
          ele.nicks = '用户' + ele.uids
        }
        const _statisticsCommisionMap = statisticsCommisionMap[ele.uids]
        if (_statisticsCommisionMap) {
          ele.saleroom = _statisticsCommisionMap.saleroom
          ele.numberOrder = _statisticsCommisionMap.numberOrder
        }
        if (userCashMap) {
          const _userCashMap = userCashMap[ele.uids]
          if (_userCashMap) {
            ele.totleConsumed = _userCashMap.totleConsumed
            ele.totalPayNumber = _userCashMap.totalPayNumber
            ele.totalPayAmount = _userCashMap.totalPayAmount
          }
        }
      })
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
  tabChange(e) {
    this.setData({
      activeIndex: e.detail.index,
      page: 1
    })
    this.fxMembers()
  },
  onReachBottom: function() {
    this.data.page += 1
    this.fxMembers()
  },
  onPullDownRefresh: function() {
    this.data.page = 1
    this.fxMembersStatistics()
    this.fxMembers()
    wx.stopPullDownRefresh()
  },
})