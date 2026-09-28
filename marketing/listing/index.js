const WXAPI = require('apifm-wxapi')
const AUTH = require('../../utils/auth')

Page({
  data: {
    listings: [],
    settings: null,
    loading: true,   // 初始即显示加载状态，避免首屏空白
  },

  onLoad() {},

  onShow() {
    AUTH.checkHasLogined().then(isLogined => {
      if (isLogined) {
        this.loadData()
      } else {
        getApp().loginOK = () => {
          this.loadData()
        }
        wx.navigateTo({ url: '/pages/login/index' })
      }
    })
  },

  onPullDownRefresh() {
    this.loadData().then(() => {
      wx.stopPullDownRefresh()
    })
  },

  async loadData() {
    this.setData({ loading: true })
    const token = wx.getStorageSync('token')
    try {
      const [settingsRes, listingsRes] = await Promise.all([
        WXAPI.listingSet(),
        WXAPI.listingMyListing(token),
      ])
      if (settingsRes.code == 0) {
        this.setData({ settings: settingsRes.data })
      }
      if (listingsRes.code == 0) {
        const raw = listingsRes.data || []
        const listings = raw.map(item => this._decorateListing(item))
        this.setData({ listings })
      }
    } catch (e) {
      console.error(e)
    }
    this.setData({ loading: false })
  },

  // 为接龙数据附加状态标签、颜色等展示属性
  _decorateListing(item) {
    const statusMap = {
      0: { label: '进行中', color: '#07c160', bg: '#f0fff5', icon: '🟢' },
      1: { label: '已取消', color: '#999',    bg: '#f5f5f5', icon: '⭕' },
      2: { label: '已成团', color: '#1989fa', bg: '#f0f7ff', icon: '🔵' },
    }
    const sc = statusMap[item.status] || statusMap[0]
    return Object.assign({}, item, {
      statusLabel: sc.label,
      statusColor: sc.color,
      statusBg:    sc.bg,
      statusIcon:  sc.icon,
      amountStr: (item.amount || 0).toFixed(2),
    })
  },

  createListing() {
    wx.navigateTo({ url: '/marketing/listing/edit' })
  },

  goDetail(e) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({ url: `/marketing/listing/detail?id=${id}` })
  },
})
