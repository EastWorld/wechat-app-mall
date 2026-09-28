const WXAPI = require('apifm-wxapi')
const AUTH = require('../../utils/auth')
import Poster from 'wxa-plugin-canvas/poster/poster'

// 接龙状态配置
const STATUS_MAP = {
  0: { label: '进行中', color: '#07c160', bg: '#edfff3', icon: '🟢' },
  1: { label: '已取消', color: '#f56c6c', bg: '#fff5f5', icon: '🔴' },
  2: { label: '已成团', color: '#1989fa', bg: '#f0f7ff', icon: '🔵' },
}

// 订单状态配置
const ORDER_STATUS_MAP = {
  '-1': { label: '已关闭', color: '#bbb' },
  '0':  { label: '待付款', color: '#fa8c16' },
  '1':  { label: '待发货', color: '#1989fa' },
  '2':  { label: '待收货', color: '#07c160' },
  '3':  { label: '已完成', color: '#888' },
  '4':  { label: '待评价', color: '#888' },
}

Page({
  data: {
    id: null,
    detail: null,
    info: null,
    broker: null,
    goods: [],
    joinList: [],
    joinTotalRow: 0,
    joinPage: 1,
    joinLoading: false,
    joinPageEnd: false,
    isOrganizer: false,
    activeTab: 0,         // 0=商品列表, 1=参与记录
    // 添加商品弹窗
    showAddGoodsPopup: false,
    searchKeyword: '',
    searchResults: [],
    searching: false,
    // 页面状态
    pageLoading: true,
    pageError: false,
    // 分享面板
    showSharePanel: false,
    // 海报
    posterConfig: null,
    posterImg: '',
    showPosterImg: false,
  },

  onLoad(options) {
    // 同时开启转发和朋友圈分享按钮
    wx.showShareMenu({ withShareTicket: true, menus: ['shareAppMessage', 'shareTimeline'] })

    let id = options.id
    // 支持扫海报二维码进入（scene 格式：listingId,uid）
    if (!id && options.scene) {
      const scene = decodeURIComponent(options.scene)
      id = scene.split(',')[0]
    }

    if (id) {
      this.setData({ id })
      this.loadPageData(id)
    } else {
      wx.showToast({ title: '参数错误', icon: 'none' })
      this.setData({ pageLoading: false, pageError: true })
    }
  },

  onPullDownRefresh() {
    this.loadPageData(this.data.id).then(() => wx.stopPullDownRefresh())
  },

  onReachBottom() {
    if (this.data.activeTab === 1 && !this.data.joinPageEnd && !this.data.joinLoading) {
      this.loadJoinList(this.data.joinPage + 1)
    }
  },

  onShareAppMessage() {
    const info = this.data.info
    return {
      title: info ? `${info.name} — 接龙活动` : '接龙活动',
      path: `/marketing/listing/detail?id=${this.data.id}`,
      imageUrl: info && info.pic ? info.pic : '',
    }
  },

  onShareTimeline() {
    const info = this.data.info
    return {
      title: info ? `${info.name} — 接龙活动` : '接龙活动',
      query: `id=${this.data.id}`,
      imageUrl: info && info.pic ? info.pic : '',
    }
  },

  // ===== 核心数据加载 =====

  async loadPageData(id) {
    this.setData({ pageLoading: true, pageError: false })
    try {
      const res = await WXAPI.listingDetail(id)
      if (res.code != 0) {
        wx.showToast({ title: res.msg || '加载失败', icon: 'none' })
        this.setData({ pageLoading: false, pageError: true })
        return
      }

      const detail = res.data
      const rawInfo = detail.info
      const broker = detail.broker || {}

      // 判断当前用户是否是团长
      // 优先读 globalData 缓存，避免重复请求；字段用 base.id（同 my/index.js 写法）
      const token = wx.getStorageSync('token')
      let isOrganizer = false
      if (token) {
        let myId = null
        const cached = getApp().globalData.apiUserInfoMap
        if (cached && cached.base) {
          myId = cached.base.id || cached.base.uid
        } else {
          const userRes = await WXAPI.userDetail(token)
          if (userRes.code == 0) {
            myId = userRes.data.base.id || userRes.data.base.uid
          }
        }
        if (myId) {
          isOrganizer = String(myId) === String(rawInfo.uid)
        }
      }

      // 保存 listingId，下单时使用
      wx.setStorageSync('listingId', String(id))

      // 附加展示属性到 info
      const sc = STATUS_MAP[rawInfo.status] || STATUS_MAP[0]
      const info = Object.assign({}, rawInfo, {
        statusLabel: sc.label,
        statusColor: sc.color,
        statusBg:    sc.bg,
        statusIcon:  sc.icon,
        amountStr:   (rawInfo.amount || 0).toFixed(2),
        dateAddShort: rawInfo.dateAdd ? rawInfo.dateAdd.slice(0, 10) : '',
      })

      // broker 加首字母字段，供头像占位使用
      const broker = Object.assign({}, res.data.broker || {}, {
        nickInitial: (res.data.broker && res.data.broker.nick)
          ? res.data.broker.nick.slice(0, 1)
          : '?',
      })

      wx.setNavigationBarTitle({ title: info.name || '接龙详情' })

      this.setData({ detail, info, broker, isOrganizer })

      // 并行加载商品和参与列表，全部就绪后再关闭 loading，
      // 避免商品 Tab 在数据返回前短暂闪出"暂无商品"空状态
      await Promise.all([
        this.loadGoods(detail.goodsIds || []),
        this.loadJoinList(1),
      ])

      this.setData({ pageLoading: false })
    } catch (e) {
      console.error('[listing-detail] loadPageData error:', e)
      this.setData({ pageLoading: false, pageError: true })
    }
  },

  // 根据 goodsIds 加载商品详情
  async loadGoods(goodsIds) {
    if (!goodsIds || goodsIds.length === 0) {
      this.setData({ goods: [] })
      return
    }
    const res = await WXAPI.goodsv2({
      gids: goodsIds.join(','),
      pageSize: Math.max(goodsIds.length, 1),
    })
    if (res.code == 0 && res.data && res.data.result) {
      const goods = res.data.result.map(g => Object.assign({}, g, {
        priceStr: (g.minPrice || g.price || 0).toFixed(2),
      }))
      this.setData({ goods })
    } else {
      this.setData({ goods: [] })
    }
  },

  // 加载参与订单列表
  async loadJoinList(page) {
    if (this.data.joinLoading) return
    this.setData({ joinLoading: true })
    const token = wx.getStorageSync('token')
    const res = await WXAPI.listingJoinList({
      token,
      listingId: this.data.id,
      page,
      pageSize: 20,
    })
    this.setData({ joinLoading: false })
    if (res.code == 0 && res.data) {
      const result  = res.data.result  || []
      const userMap = res.data.userMap || {}
      const list = result.map(item => {
        const user = userMap[String(item.uid)] || {}
        const oc = ORDER_STATUS_MAP[String(item.status)] || { label: '未知', color: '#999' }
        const userNick = user.nick || '匿名用户'
        return Object.assign({}, item, {
          userNick,
          userAvatar:   user.avatarUrl || '',
          nickInitial:  userNick.slice(0, 1),
          statusLabel:  oc.label,
          statusColor:  oc.color,
          amountStr:    (item.amount || 0).toFixed(2),
          unitPriceStr: (item.amountSingle || 0).toFixed(2),
        })
      })
      this.setData({
        joinList:     page === 1 ? list : this.data.joinList.concat(list),
        joinPage:     page,
        joinTotalRow: res.data.totalRow || 0,
        joinPageEnd:  list.length < 20,
      })
    }
  },

  // ===== Tab 切换 =====

  switchTab(e) {
    this.setData({ activeTab: Number(e.currentTarget.dataset.index) })
  },

  // ===== 商品管理（团长） =====

  openAddGoodsPopup() {
    this.setData({ showAddGoodsPopup: true, searchKeyword: '', searchResults: [] })
    // 打开弹窗时默认加载全部商品（第一页）
    this._loadGoodsList('')
  },

  closeAddGoodsPopup() {
    this.setData({ showAddGoodsPopup: false })
  },

  onSearchInput(e) {
    // van-search 的 input 事件 e.detail 直接是字符串，不是 {value: string}
    this.setData({ searchKeyword: e.detail })
  },

  // 搜索框回车/点击搜索按钮
  async onSearchConfirm() {
    const kw = (this.data.searchKeyword || '').trim()
    this._loadGoodsList(kw)
  },

  // 统一的商品列表加载方法：keyword 为空时加载全部
  async _loadGoodsList(keyword) {
    const kw = (keyword || '').trim()
    this.setData({ searching: true, searchResults: [] })
    const params = { pageSize: 20 }
    if (kw) params.k = kw
    const res = await WXAPI.goodsv2(params)
    this.setData({ searching: false })
    if (res.code == 0 && res.data && res.data.result) {
      const results = res.data.result.map(g => Object.assign({}, g, {
        priceStr: (g.minPrice || g.price || 0).toFixed(2),
      }))
      this.setData({ searchResults: results })
      if (results.length === 0 && kw) {
        wx.showToast({ title: `未找到"${kw}"相关商品`, icon: 'none' })
      }
    } else {
      this.setData({ searchResults: [] })
    }
  },

  async addGoods(e) {
    const goodsId = e.currentTarget.dataset.id
    const token = wx.getStorageSync('token')
    wx.showLoading({ title: '添加中...' })
    const res = await WXAPI.listingAddGoods({ token, id: this.data.id, goodsId })
    wx.hideLoading()
    if (res.code == 0) {
      wx.showToast({ title: '添加成功' })
      // 弹窗保持打开，用户可继续添加其他商品
      // 后台刷新接龙商品列表，不影响当前操作
      this.loadPageData(this.data.id)
    } else {
      wx.showToast({ title: res.msg || '添加失败', icon: 'none' })
    }
  },

  async removeGoods(e) {
    const goodsId   = e.currentTarget.dataset.id
    const goodsName = e.currentTarget.dataset.name
    wx.showModal({
      title: '移除商品',
      content: `确认将「${goodsName}」从接龙中移除吗？`,
      confirmColor: '#f56c6c',
      success: async (modal) => {
        if (!modal.confirm) return
        const token = wx.getStorageSync('token')
        wx.showLoading({ title: '移除中...' })
        const r = await WXAPI.listingRemoveGoods({ token, id: this.data.id, goodsId })
        wx.hideLoading()
        if (r.code == 0) {
          wx.showToast({ title: '已移除' })
          setTimeout(() => this.loadPageData(this.data.id), 800)
        } else {
          wx.showToast({ title: r.msg || '移除失败', icon: 'none' })
        }
      },
    })
  },

  // ===== 接龙状态操作（团长） =====

  onSuccess() {
    wx.showModal({
      title: '确认成团',
      content: '成团后将截止用户继续参与，后续订单不再计入此接龙。确认操作？',
      success: async (modal) => {
        if (!modal.confirm) return
        const token = wx.getStorageSync('token')
        wx.showLoading({ title: '处理中...' })
        const r = await WXAPI.listingSuccess(token, this.data.id)
        wx.hideLoading()
        if (r.code == 0) {
          wx.showToast({ title: '🎉 成团成功！' })
          setTimeout(() => this.loadPageData(this.data.id), 1500)
        } else {
          wx.showToast({ title: r.msg || '操作失败', icon: 'none' })
        }
      },
    })
  },

  onCancel() {
    wx.showModal({
      title: '取消接龙',
      content: '取消后所有已支付订单将自动退款，此操作不可撤销！确认取消？',
      confirmColor: '#f56c6c',
      success: async (modal) => {
        if (!modal.confirm) return
        const token = wx.getStorageSync('token')
        wx.showLoading({ title: '处理中...' })
        const r = await WXAPI.listingCancel(token, this.data.id)
        wx.hideLoading()
        if (r.code == 0) {
          wx.showToast({ title: '接龙已取消，退款处理中' })
          setTimeout(() => this.loadPageData(this.data.id), 1500)
        } else {
          wx.showToast({ title: r.msg || '操作失败', icon: 'none' })
        }
      },
    })
  },

  onDelete() {
    wx.showModal({
      title: '删除接龙',
      content: '确认永久删除此接龙记录？（仅已取消的接龙可删除）',
      confirmColor: '#f56c6c',
      success: async (modal) => {
        if (!modal.confirm) return
        const token = wx.getStorageSync('token')
        wx.showLoading({ title: '删除中...' })
        const r = await WXAPI.listingDelete(token, this.data.id)
        wx.hideLoading()
        if (r.code == 0) {
          wx.showToast({ title: '已删除' })
          setTimeout(() => wx.navigateBack(), 1500)
        } else {
          wx.showToast({ title: r.msg || '删除失败', icon: 'none' })
        }
      },
    })
  },

  editListing() {
    wx.navigateTo({ url: `/marketing/listing/edit?id=${this.data.id}` })
  },

  // ===== 分享面板 =====

  openSharePanel() {
    this.setData({ showSharePanel: true })
  },

  closeSharePanel() {
    this.setData({ showSharePanel: false })
  },

  // 朋友圈：van-popup 内 shareTimeline 无法可靠触发，引导用户用系统菜单
  guideShareTimeline() {
    this.setData({ showSharePanel: false })
    setTimeout(() => {
      wx.showModal({
        title: '分享到朋友圈',
        content: '点击右上角 ··· 按钮，选择「分享到朋友圈」即可',
        showCancel: false,
        confirmText: '好的',
      })
    }, 300)
  },

  // 生成海报
  async drawSharePoster() {
    this.setData({ showSharePanel: false })
    wx.showLoading({ title: '生成中…' })

    const info = this.data.info
    const broker = this.data.broker
    const accountInfo = wx.getAccountInfoSync()
    const envVersion = accountInfo.miniProgram.envVersion

    // 生成接龙专属小程序码（扫码直接进入接龙详情）
    const qrcodeRes = await WXAPI.wxaQrcode({
      scene: this.data.id + ',' + (wx.getStorageSync('uid') || '0'),
      page: 'marketing/listing/detail',
      is_hyaline: true,
      autoColor: false,
      expireHours: 24 * 30, // 30天有效
      env_version: envVersion,
      check_path: envVersion === 'release',
    })
    wx.hideLoading()

    if (qrcodeRes.code != 0) {
      wx.showToast({ title: '生成失败，请重试', icon: 'none' })
      return
    }
    const qrcode = qrcodeRes.data

    if (info.pic) {
      // 有封面图：计算图片比例后绘制
      wx.showLoading({ title: '绘制中…' })
      wx.getImageInfo({
        src: info.pic,
        success: (res) => {
          wx.hideLoading()
          const imgH = Math.round(600 * res.height / res.width) // 等比缩放到宽600
          this._buildPosterConfig(imgH, qrcode)
        },
        fail: () => {
          wx.hideLoading()
          this._buildPosterConfig(0, qrcode) // 无封面降级
        },
      })
    } else {
      this._buildPosterConfig(0, qrcode)
    }
  },

  _buildPosterConfig(coverHeight, qrcode) {
    const info  = this.data.info
    const broker = this.data.broker
    const hasCover = coverHeight > 0
    const coverY  = 80
    const infoY   = hasCover ? coverY + coverHeight + 60 : 200
    const qrY     = infoY + 220

    const images = []
    if (hasCover) {
      images.push({ x: 75, y: coverY, url: info.pic, width: 600, height: coverHeight })
    }
    images.push({ x: 264, y: qrY, url: qrcode, width: 222, height: 222 })

    const texts = [
      {
        x: 375, y: infoY,
        text: info.name || '接龙活动',
        textAlign: 'center',
        width: 620,
        lineNum: 2,
        fontSize: 42,
        fontWeight: 'bold',
        color: '#1a1a2e',
      },
      {
        x: 375, y: infoY + 120,
        text: `团长：${broker.nick || ''}`,
        textAlign: 'center',
        fontSize: 30,
        color: '#888',
      },
      {
        x: 375, y: qrY - 50,
        text: '扫码参与接龙',
        textAlign: 'center',
        fontSize: 28,
        color: '#aaa',
      },
    ]

    // 若无封面，加渐变色块作为背景装饰
    const blocks = hasCover ? [] : [{
      x: 0, y: 0,
      width: 750,
      height: 160,
      color: '#667eea',
    }]

    this.setData({
      posterConfig: {
        width: 750,
        height: qrY + 222 + 80,
        backgroundColor: '#fff',
        debug: false,
        blocks,
        images,
        texts,
      },
    }, () => {
      Poster.create()
    })
  },

  onPosterSuccess(e) {
    this.setData({ posterImg: e.detail, showPosterImg: true })
  },

  onPosterFail(e) {
    console.error('[listing-poster] fail:', e)
    wx.showToast({ title: '海报生成失败', icon: 'none' })
  },

  savePosterPic() {
    wx.saveImageToPhotosAlbum({
      filePath: this.data.posterImg,
      success: () => {
        wx.showModal({
          content: '海报已保存到手机相册，可分享给好友',
          showCancel: false,
          confirmText: '好的',
        })
      },
      fail: () => {
        wx.showToast({ title: '保存失败，请授权相册权限', icon: 'none' })
      },
      complete: () => {
        this.setData({ showPosterImg: false })
      },
    })
  },

  closePosterImg() {
    this.setData({ showPosterImg: false })
  },

  // ===== 参与者操作 =====

  buyGoods(e) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({ url: `/pages/goods-details/index?id=${id}` })
  },
})
