const WXAPI = require('apifm-wxapi')
const AUTH = require('../../utils/auth')

Page({
  data: {
    recordList: [],
    page: 1,
    pageSize: 20,
    totalPage: 0,
    loading: false,
    hasMore: true,
    levelMap: {}
  },

  onLoad(options) {
    this.loadData()
  },

  async loadData() {
    this.setData({ 
      page: 1,
      recordList: [],
      hasMore: true
    })
    await this.loadLevelList()
    await this.loadRecords()
  },

  async loadLevelList() {
    const res = await WXAPI.userLevelList({ page: 1, pageSize: 100 })
    if (res.code === 0) {
      const levelMap = {}
      const list = res.data.result || []
      list.forEach(item => {
        levelMap[item.id] = item.name
      })
      this.setData({ levelMap })
    }
  },

  async loadRecords() {
    if (this.data.loading) return
    
    this.setData({ loading: true })
    
    const res = await WXAPI.userLevelBuyLogs({
      token: wx.getStorageSync('token'),
      page: this.data.page,
      pageSize: this.data.pageSize
    })
    
    this.setData({ loading: false })

    if (res.code === 0) {
      const list = res.data.result || []
      
      // 添加等级名称
      list.forEach(item => {
        item.levelName = this.data.levelMap[item.levelId] || '未知等级'
      })
      const allRecords = [...this.data.recordList, ...list]

      this.setData({
        recordList: allRecords,
        totalPage: res.data.totalPage || 0,
        hasMore: this.data.page < res.data.totalPage
      })
    } else {
      wx.showToast({
        title: res.msg || '加载失败',
        icon: 'none'
      })
    }
  },

  loadMore() {
    if (!this.data.hasMore || this.data.loading) return
    
    this.setData({
      page: this.data.page + 1
    })
    this.loadRecords()
  },

  onPullDownRefresh() {
    this.data.page = 1
    this.data.totalPage = 0
    this.loadData().then(() => {
      wx.stopPullDownRefresh()
    })
  },

  onReachBottom() {
    this.loadMore()
  }
})
