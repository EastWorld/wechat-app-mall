const WXAPI = require('apifm-wxapi')
const AUTH = require('../../utils/auth')

Page({
  data: {
    userLevel: null,
    levelList: [],
    loading: true
  },

  onLoad(options) {
    
  },

  onShow() {
    AUTH.checkHasLogined().then(isLogined => {
      if (!isLogined) {
        AUTH.login(this)
      } else {
        this.loadData()
      }
    })
  },

  async loadData() {
    this.setData({ loading: true })
    await Promise.all([
      this.getUserLevel(),
      this.getLevelList()
    ])
    this.setData({ loading: false })
  },

  async getUserLevel() {
    const res = await WXAPI.userDetail(wx.getStorageSync('token'))
    if (res.code === 0) {
      this.setData({
        userLevel: res.data.userLevel
      })
    }
  },

  async getLevelList() {
    const res = await WXAPI.userLevelList({ page: 1, pageSize: 50 })
    if (res.code === 0) {
      const list = res.data.result || []
      // 按等级排序
      list.sort((a, b) => b.level - a.level)
      this.setData({
        levelList: list
      })
    }
  },

  goLevelDetail(e) {
    const { id } = e.currentTarget.dataset
    wx.navigateTo({
      url: `/pages/vip/detail?id=${id}`
    })
  },

  goBuyHistory() {
    wx.navigateTo({
      url: '/pages/vip/history'
    })
  },

  onPullDownRefresh() {
    this.loadData().then(() => {
      wx.stopPullDownRefresh()
    })
  }
})