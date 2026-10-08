const WXAPI = require('apifm-wxapi')
const TOOLS = require('../../utils/tools.js') // TOOLS.showTabBarBadge();

Page({
  data: {
    listType: 1,
    name: '',
    orderBy: '',
    page: 1,
    recommendStatus: '',
    goods: null,
    skuCurGoods: undefined,
    totalCartNum: 0,         // 购物车总数，用于浮动按钮红点
  },

  onLoad: function (options) {
    this.setData({
      name: options.name,
      categoryId: options.categoryId,
      recommendStatus: options.recommendStatus || ''
    })
    this.search()
    this.readConfigVal()
    getApp().configLoadOK = () => {
      this.readConfigVal()
    }
  },

  onShow: function () {
    this.refreshCartNum()
  },

  readConfigVal() {
    const show_seller_number = wx.getStorageSync('show_seller_number')
    const goods_search_show_type = wx.getStorageSync('goods_search_show_type')
    let listType = 1
    if (goods_search_show_type == 2) listType = 2
    this.setData({ show_seller_number, listType })
  },

  async search() {
    wx.showLoading({ title: '加载中' })
    const _data = {
      orderBy: this.data.orderBy,
      page: this.data.page,
      pageSize: 20,
      recommendStatus: this.data.recommendStatus || ''
    }
    if (this.data.name) _data.k = this.data.name
    if (this.data.categoryId) _data.categoryId = this.data.categoryId

    const res = await WXAPI.goodsv2(_data)
    wx.hideLoading()
    if (res.code == 0) {
      const newList = res.data.result
      // 初始化每个商品的购物车数量
      newList.forEach(ele => { ele.cartNum = 0 })
      if (this.data.page == 1) {
        this.setData({ goods: newList })
      } else {
        this.setData({ goods: this.data.goods.concat(newList) })
      }
      // 加载完列表后同步购物车数量
      this.refreshCartNum()
    } else {
      if (this.data.page == 1) {
        this.setData({ goods: null })
      } else {
        wx.showToast({ title: '没有更多了', icon: 'none' })
      }
    }
  },

  onReachBottom() {
    this.setData({ page: this.data.page + 1 })
    this.search()
  },

  changeShowType() {
    this.setData({ listType: this.data.listType == 1 ? 2 : 1 })
  },

  bindinput(e) {
    this.setData({ name: e.detail.value.slice(0, 50) })
  },

  bindconfirm(e) {
    this.setData({ page: 1, name: e.detail.value.slice(0, 50) })
    this.search()
  },

  filter(e) {
    this.setData({ page: 1, orderBy: e.currentTarget.dataset.val })
    this.search()
  },

  // ==================== 加入购物车 ====================

  async addShopCar(e) {
    const curGood = this.data.goods.find(ele => ele.id == e.currentTarget.dataset.id)
    if (!curGood) return

    if (curGood.stores <= 0) {
      wx.showToast({ title: '已售罄~', icon: 'none' })
      return
    }

    if (!curGood.propertyIds && !curGood.hasAddition) {
      const res = await WXAPI.shippingCarInfoAddItem(wx.getStorageSync('token'), curGood.id, 1, [])
      if (res.code == 2000) {
        wx.navigateTo({ url: '/pages/login/index' })
        return
      }
      if (res.code == 30002) {
        this.setData({ skuCurGoods: curGood })
      } else if (res.code == 0) {
        wx.showToast({ title: '加入成功', icon: 'success' })
        wx.showTabBar()
        this.refreshCartNum()
        TOOLS.showTabBarBadge()
      } else {
        wx.showToast({ title: res.msg, icon: 'none' })
      }
    } else {
      this.setData({ skuCurGoods: curGood })
    }
  },

  // goods-pop 加购成功回调
  onAddCartSuccess() {
    this.refreshCartNum()
  },

  // ==================== 购物车数量刷新 ====================

  async refreshCartNum() {
    const token = wx.getStorageSync('token')
    if (!token) return

    const totalCartNum = await TOOLS.showTabBarBadge(true)
    this.setData({ totalCartNum })

    const cartRes = await WXAPI.shippingCarInfo(token)
    if (cartRes.code != 0 || !cartRes.data || !cartRes.data.items) return

    const cartList = cartRes.data.items
    const goods = this.data.goods
    if (!goods || goods.length == 0) return

    const cartMap = {}
    cartList.forEach(cartItem => {
      const gid = cartItem.goodsId || cartItem.id
      if (!gid) return
      cartMap[gid] = (cartMap[gid] || 0) + (cartItem.number || 1)
    })

    let changed = false
    goods.forEach((item, i) => {
      const num = cartMap[item.id] || 0
      if (item.cartNum !== num) {
        goods[i] = Object.assign({}, item, { cartNum: num })
        changed = true
      }
    })
    if (changed) this.setData({ goods })
  },

  // ==================== 跳转购物车 ====================

  goToCart() {
    wx.switchTab({ url: '/pages/shop-cart/index' })
  },
})
