const WXAPI = require('apifm-wxapi')

Page({
  data: {
    activityId: null,
    activityInfo: {},
    banners: [],
    coupons: [],
    allGoods: [],
    showGoods: [],
    goodsExpanded: false,
    disclaimers: [],
    hasMore: false,
  },

  onLoad(options) {
    this.data.activityId = options.id
    this._loadActivity()
  },

  onShow() {},

  onShareAppMessage() {
    return {
      title: this.data.activityInfo.title || '活动商城',
      path: '/pages/huodong/index?id=' + this.data.activityId + '&inviter_id=' + (wx.getStorageSync('uid') || ''),
    }
  },

  onShareTimeline() {
    return {
      title: this.data.activityInfo.title || '活动商城',
      query: 'inviter_id=' + (wx.getStorageSync('uid') || '') + '&id=' + this.data.activityId,
    }
  },

  async _loadActivity() {
    wx.showLoading({ title: '' })
    const res = await WXAPI.activityMallInfoInfo({ id: this.data.activityId })
    wx.hideLoading()
    if (res.code != 0) {
      wx.showToast({ title: res.msg || '加载失败', icon: 'none' })
      return
    }
    const info = res.data.info
    info.dateRange = info.dateStart
      ? (info.dateStart + (info.dateDeadline ? ' - ' + info.dateDeadline : ''))
      : ''
    this.setData({ activityInfo: info })
    wx.setNavigationBarTitle({ title: info.title || '活动商城' })

    await Promise.all([
      this._loadBanners(info.bannerType),
      info.couponRuleIds ? this._loadCoupons(info.couponRuleIds) : Promise.resolve(),
      info.goodsIds ? this._loadGoods(info.goodsIds) : Promise.resolve(),
      info.disclaimerPageKey ? this._loadDisclaimer(info.disclaimerPageKey) : Promise.resolve(),
    ])
  },

  async _loadBanners(type) {
    const res = await WXAPI.banners({ type })
    if (res.code == 0 && res.data) {
      this.setData({
        banners: res.data.map(item => ({
          pic: item.picUrl,
          tag: item.title || '',
        }))
      })
    }
  },

  async _loadCoupons(ids) {
    const res = await WXAPI.coupons({ ids, token: wx.getStorageSync('token') })
    if (res.code == 0 && res.data) {
      this.setData({
        coupons: res.data.map(item => {
          const min = item.moneyMin
          const max = item.moneyMax
          return {
            id: item.id,
            moneyType: item.moneyType,
            moneyMin: min,
            isRange: min !== max,
            moneyHreshold: item.moneyHreshold || '',
            name: item.name || '',
            expire: item.endTime ? item.endTime.substring(5, 10).replace('-', '月') + '日到期' : '',
            needAmount: item.needAmount || 0,
            needScore: item.needScore || 0,
            needSignedContinuous: item.needSignedContinuous || 0,
            isPwd: item.pwd === 'Y',
            received: false,
          }
        })
      })
    }
  },

  async _loadGoods(gids) {
    const res = await WXAPI.goodsv2({ gids, pageSize: 200 })
    if (res.code == 0 && res.data && res.data.result) {
      const allGoods = res.data.result
      this.setData({
        allGoods,
        showGoods: allGoods.slice(0, 6),
        hasMore: allGoods.length > 6,
      })
    }
  },

  async _loadDisclaimer(key) {
    const res = await WXAPI.cmsPage(key)
    if (res.code == 0 && res.data && res.data.info) {
      const text = res.data.info.content || ''
      const stripped = text.replace(/<[^>]+>/g, '\n').replace(/&nbsp;/g, ' ')
      const disclaimers = stripped.split('\n').map(s => s.trim()).filter(s => s.length > 0)
      this.setData({ disclaimers })
    }
  },

  async receiveCoupon(e) {
    const index = e.currentTarget.dataset.index
    const item = this.data.coupons[index]
    if (item.received) return
    const res = await WXAPI.fetchCoupons({ id: item.id, token: wx.getStorageSync('token') })
    if (res.code == 0) {
      const key = 'coupons[' + index + '].received'
      this.setData({ [key]: true })
      wx.showToast({ title: '领取成功', icon: 'success' })
    } else {
      wx.showToast({ title: res.msg || '领取失败', icon: 'none' })
    }
  },

  expandGoods() {
    this.setData({
      showGoods: this.data.allGoods,
      goodsExpanded: true,
      hasMore: false,
    })
  },

  goGoodsDetail(e) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({ url: '/pages/goods-details/index?id=' + id })
  },
})
