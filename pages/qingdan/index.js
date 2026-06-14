const WXAPI = require('apifm-wxapi')
const AUTH = require('../../utils/auth')

// Json记录的 type 命名空间（所有清单类型统一前缀，便于管理）
const TYPE_PREFIX = 'qingdan_'

// 5 种清单类型配置
const CATEGORY_CONFIG = [
  {
    key: 'todo',
    type: TYPE_PREFIX + 'todo',
    name: '待办',
    icon: '✅',
    color: '#5B8FF9',
    gradient: 'linear-gradient(135deg, #6BA3FF 0%, #4F7AE8 100%)',
    placeholder: '例如：周五前提交周报',
    desc: '管理每日待办事项'
  },
  {
    key: 'shopping',
    type: TYPE_PREFIX + 'shopping',
    name: '购物',
    icon: '🛒',
    color: '#FF7043',
    gradient: 'linear-gradient(135deg, #FF9472 0%, #FF5722 100%)',
    placeholder: '例如：牛奶 / 面包 / 鸡蛋',
    desc: '购物清单不再遗忘'
  },
  {
    key: 'travel',
    type: TYPE_PREFIX + 'travel',
    name: '旅行',
    icon: '✈️',
    color: '#26C0B8',
    gradient: 'linear-gradient(135deg, #4DD0C8 0%, #1C9C94 100%)',
    placeholder: '例如：身份证 / 充电器 / 耳机',
    desc: '出行物品一键打包'
  },
  {
    key: 'movie',
    type: TYPE_PREFIX + 'movie',
    name: '观影',
    icon: '🎬',
    color: '#9B6BFF',
    gradient: 'linear-gradient(135deg, #B58BFF 0%, #7E54E0 100%)',
    placeholder: '例如：星际穿越',
    desc: '想看 / 看过的影片'
  },
  {
    key: 'memo',
    type: TYPE_PREFIX + 'memo',
    name: '备忘',
    icon: '📝',
    color: '#FFB300',
    gradient: 'linear-gradient(135deg, #FFCD47 0%, #F5A300 100%)',
    placeholder: '例如：家人生日 / 灵感记录',
    desc: '随手记下重要的事'
  }
]

Page({
  data: {
    // 分类配置
    categories: CATEGORY_CONFIG,
    currentType: TYPE_PREFIX + 'todo', // 默认选中第一项
    currentKey: 'todo',
    currentCategory: CATEGORY_CONFIG[0],

    // 列表数据
    list: [],           // 当前类型下的全部记录
    displayList: [],    // 经过过滤、排序后用于渲染的列表
    keyword: '',

    // 统计
    total: 0,
    doneCount: 0,
    progress: 0,

    // 统计概览（首页顶部5个分类的数量统计）
    overview: [],

    // 弹窗表单
    showForm: false,
    formMode: 'add',      // add | edit
    editingId: null,
    form: {
      title: '',
      remark: '',
      done: false,
      priority: 0,        // 优先级 0-2
      qty: 1,             // 数量（购物清单用）
      rating: 0,          // 评分（观影清单用）
    },

    // 操作菜单
    showAction: false,
    actionItem: null,

    loading: false,
    pageEnd: false,
    page: 1,
    pageSize: 50,
  },

  onLoad(options) {
    // 支持从入口直接打开特定分类，例如 my 页面跳转时传 type=shopping
    if (options && options.type) {
      const idx = CATEGORY_CONFIG.findIndex(c => c.key === options.type)
      if (idx >= 0) {
        this.setData({
          currentKey: CATEGORY_CONFIG[idx].key,
          currentType: CATEGORY_CONFIG[idx].type,
          currentCategory: CATEGORY_CONFIG[idx]
        })
      }
    }
  },

  onShow() {
    AUTH.checkHasLogined().then(isLogined => {
      if (isLogined) {
        this.refreshAll()
      } else {
        getApp().loginOK = () => {
          this.refreshAll()
        }
        wx.navigateTo({ url: '/pages/login/index' })
      }
    })
  },

  onPullDownRefresh() {
    this.refreshAll().then(() => {
      wx.stopPullDownRefresh()
    })
  },

  // 刷新当前分类 + 概览统计
  async refreshAll() {
    await Promise.all([
      this.loadList(),
      this.loadOverview()
    ])
  },

  // 加载概览：5个分类各自的总数
  async loadOverview() {
    const token = wx.getStorageSync('token')
    const results = await Promise.all(
      CATEGORY_CONFIG.map(c =>
        WXAPI.jsonListV3({ token, type: c.type, page: 1, pageSize: 1 })
      )
    )
    const overview = CATEGORY_CONFIG.map((c, i) => {
      const res = results[i]
      const total = (res && res.code == 0 && res.data && res.data.totalRow) ? res.data.totalRow : 0
      return Object.assign({}, c, { total })
    })
    this.setData({ overview })
  },

  // 切换分类
  switchCategory(e) {
    const key = e.currentTarget.dataset.key
    const idx = CATEGORY_CONFIG.findIndex(c => c.key === key)
    if (idx < 0) return
    this.setData({
      currentKey: key,
      currentType: CATEGORY_CONFIG[idx].type,
      currentCategory: CATEGORY_CONFIG[idx],
      keyword: '',
      list: [],
      displayList: [],
      page: 1,
      pageEnd: false
    })
    this.loadList()
  },

  // 加载当前分类列表
  async loadList() {
    if (this.data.loading || this.data.pageEnd) return
    this.setData({ loading: true })
    const token = wx.getStorageSync('token')
    const res = await WXAPI.jsonListV3({
      token,
      type: this.data.currentType,
      page: this.data.page,
      pageSize: this.data.pageSize,
      orderBy: 'updateDateDesc'
    })
    this.setData({ loading: false })
    if (res.code != 0) {
      // 未登录等场景
      this.setData({ list: [], displayList: [], total: 0, doneCount: 0, progress: 0 })
      return
    }
    const result = (res.data && res.data.result) || []
    // 解析 content 字段（自定义 JSON 数据），补充记录级字段
    // 接口返回结构：{ id, isHighlight, isTop, type, dateUpdate, content }
    const parsed = result.map(item => {
      let data = {}
      try {
        data = typeof item.content === 'string' ? JSON.parse(item.content) : (item.content || {})
      } catch (e) {
        data = {}
      }
      return Object.assign({}, data, {
        id: item.id,
        isTop: item.isTop,
        isHighlight: item.isHighlight,
        dateUpdate: item.dateUpdate
      })
    })
    const all = this.data.page === 1 ? parsed : this.data.list.concat(parsed)
    this.setData({ list: all })
    this.rebuildDisplay()
  },

  onReachBottom() {
    // 简单分页加载（每页50）
    if (this.data.list.length >= this.data.total) return
    this.setData({ page: this.data.page + 1 })
    this.loadList()
  },

  // 重新计算过滤/排序/统计
  rebuildDisplay() {
    const kw = (this.data.keyword || '').trim().toLowerCase()
    let list = this.data.list.slice()
    if (kw) {
      list = list.filter(item =>
        (item.title || '').toLowerCase().indexOf(kw) >= 0 ||
        (item.remark || '').toLowerCase().indexOf(kw) >= 0
      )
    }
    // 排序：置顶优先 -> 高亮 -> 时间倒序
    list.sort((a, b) => {
      if (!!a.isTop !== !!b.isTop) return a.isTop ? -1 : 1
      if (!!a.isHighlight !== !!b.isHighlight) return a.isHighlight ? -1 : 1
      if (a.priority !== b.priority) return (b.priority || 0) - (a.priority || 0)
      return (b.dateUpdate || '').localeCompare(a.dateUpdate || '')
    })

    const total = list.length
    const doneCount = list.filter(i => i.done).length
    const progress = total ? Math.round(doneCount * 100 / total) : 0
    this.setData({ displayList: list, total, doneCount, progress })
  },

  // 搜索
  onSearch(e) {
    this.setData({ keyword: e.detail.value })
    this.rebuildDisplay()
  },
  onSearchClear() {
    this.setData({ keyword: '' })
    this.rebuildDisplay()
  },

  // ============ 增 / 改 ============
  openAdd() {
    const c = this.data.currentCategory
    this.setData({
      showForm: true,
      formMode: 'add',
      editingId: null,
      form: {
        title: '',
        remark: '',
        done: false,
        priority: 0,
        qty: 1,
        rating: 0,
      }
    })
  },

  openEdit(e) {
    const item = e.currentTarget.dataset.item
    this.setData({
      showAction: false,
      actionItem: null,
      showForm: true,
      formMode: 'edit',
      editingId: item.id,
      form: {
        title: item.title || '',
        remark: item.remark || '',
        done: !!item.done,
        priority: item.priority || 0,
        qty: item.qty || 1,
        rating: item.rating || 0,
      }
    })
  },

  closeForm() {
    this.setData({ showForm: false })
  },

  onFormTitle(e) {
    this.setData({ 'form.title': e.detail.value })
  },
  onFormRemark(e) {
    this.setData({ 'form.remark': e.detail.value })
  },
  onFormPriority(e) {
    const idx = e.currentTarget.dataset.idx
    this.setData({ 'form.priority': Number(idx) })
  },
  onFormQty(e) {
    this.setData({ 'form.qty': e.detail })
  },
  onFormRating(e) {
    this.setData({ 'form.rating': e.detail })
  },
  onFormDone(e) {
    this.setData({ 'form.done': e.detail })
  },

  // 保存（新增 / 编辑）
  async submitForm() {
    const title = (this.data.form.title || '').trim()
    if (!title) {
      wx.showToast({ title: '请输入内容', icon: 'none' })
      return
    }
    const token = wx.getStorageSync('token')
    const c = this.data.currentCategory
    const jsonData = {
      title,
      remark: (this.data.form.remark || '').trim(),
      done: !!this.data.form.done,
      priority: this.data.form.priority || 0,
      catKey: c.key,
    }
    // 不同分类记录差异化字段
    if (c.key === 'shopping') jsonData.qty = this.data.form.qty || 1
    if (c.key === 'movie') jsonData.rating = this.data.form.rating || 0

    wx.showLoading({ title: '保存中', mask: true })
    const postData = {
      token,
      type: this.data.currentType,
      content: JSON.stringify(jsonData)
    }
    if (this.data.formMode === 'edit' && this.data.editingId) {
      postData.id = this.data.editingId
    }
    const res = await WXAPI.jsonSetV2(postData)
    wx.hideLoading()
    if (res.code != 0) {
      wx.showToast({ title: res.msg || '保存失败', icon: 'none' })
      return
    }
    this.setData({ showForm: false })
    wx.showToast({ title: '已保存', icon: 'success' })
    // 新增/编辑后重置到第一页
    this.setData({ page: 1, pageEnd: false })
    this.refreshAll()
  },

  // ============ 快捷操作 ============
  // 勾选 / 取消勾选
  async toggleDone(e) {
    const item = e.currentTarget.dataset.item
    const token = wx.getStorageSync('token')
    const jsonData = {
      title: item.title,
      remark: item.remark || '',
      done: !item.done,
      priority: item.priority || 0,
      catKey: item.catKey
    }
    if (item.qty) jsonData.qty = item.qty
    if (item.rating) jsonData.rating = item.rating
    const res = await WXAPI.jsonSetV2({
      token, id: item.id, type: this.data.currentType,
      content: JSON.stringify(jsonData)
    })
    if (res.code != 0) {
      wx.showToast({ title: res.msg || '操作失败', icon: 'none' })
      return
    }
    // 本地更新
    const list = this.data.list.map(it =>
      it.id === item.id ? Object.assign({}, it, { done: !item.done }) : it
    )
    this.setData({ list })
    this.rebuildDisplay()
  },

  // 置顶 / 取消置顶 —— 使用置顶接口
  async toggleTop(e) {
    const item = e.currentTarget.dataset.item
    const token = wx.getStorageSync('token')
    const res = await WXAPI.jsonTopv2({
      token, id: item.id, isTop: !item.isTop
    })
    if (res.code != 0) {
      wx.showToast({ title: res.msg || '操作失败', icon: 'none' })
      return
    }
    wx.showToast({ title: !item.isTop ? '已置顶' : '已取消置顶', icon: 'none' })
    const list = this.data.list.map(it =>
      it.id === item.id ? Object.assign({}, it, { isTop: !item.isTop }) : it
    )
    this.setData({ list })
    this.rebuildDisplay()
  },

  // 高亮 / 取消高亮 —— 使用高亮接口
  async toggleHighlight(e) {
    const item = e.currentTarget.dataset.item
    const token = wx.getStorageSync('token')
    const res = await WXAPI.jsonHighlightv2({
      token, id: item.id, isHighlight: !item.isHighlight
    })
    if (res.code != 0) {
      wx.showToast({ title: res.msg || '操作失败', icon: 'none' })
      return
    }
    wx.showToast({ title: !item.isHighlight ? '已标记' : '已取消标记', icon: 'none' })
    const list = this.data.list.map(it =>
      it.id === item.id ? Object.assign({}, it, { isHighlight: !item.isHighlight }) : it
    )
    this.setData({ list })
    this.rebuildDisplay()
  },

  // ============ 操作菜单 ============
  openAction(e) {
    const item = e.currentTarget.dataset.item
    this.setData({ showAction: true, actionItem: item })
  },
  closeAction() {
    this.setData({ showAction: false, actionItem: null })
  },

  // 删除 —— 使用删除接口
  async deleteCurrent() {
    const item = this.data.actionItem
    if (!item) return
    const that = this
    wx.showModal({
      title: '删除确认',
      content: '确定删除「' + (item.title || '') + '」？',
      confirmColor: '#E4393C',
      success: async (r) => {
        if (!r.confirm) return
        wx.showLoading({ title: '删除中', mask: true })
        const res = await WXAPI.jsonDeleteV2({
          token: wx.getStorageSync('token'),
          id: item.id
        })
        wx.hideLoading()
        if (res.code != 0) {
          wx.showToast({ title: res.msg || '删除失败', icon: 'none' })
          return
        }
        wx.showToast({ title: '已删除', icon: 'success' })
        that.setData({ showAction: false, actionItem: null })
        that.refreshAll()
      }
    })
  },

  // 分享
  onShareAppMessage() {
    return {
      title: '个人全能清单 · ' + this.data.currentCategory.name,
      path: '/pages/qingdan/index?type=' + this.data.currentKey + '&inviter_id=' + (wx.getStorageSync('uid') || '')
    }
  },
  onShareTimeline() {
    return {
      title: '个人全能清单',
      query: 'type=' + this.data.currentKey + '&inviter_id=' + (wx.getStorageSync('uid') || '')
    }
  }
})
