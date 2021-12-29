const WXAPI = require('apifm-wxapi')
const AUTH = require('../../utils/auth')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    listType: 1, // 1为1个商品一行，2为2个商品一行    
    name: '', // 搜索关键词
    orderBy: '', // 排序规则
    page: 1 // 读取第几页
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      name: options.name,
      categoryId: options.categoryId
    })
    this.search()
    this.readConfigVal()
    // 补偿写法
    getApp().configLoadOK = () => {
      this.readConfigVal()
    }
  },
  onShow: function () {

  },
  readConfigVal() {
    const show_seller_number = wx.getStorageSync('show_seller_number')
    const goods_search_show_type = wx.getStorageSync('goods_search_show_type')
    let listType = 1
    if (goods_search_show_type == 2) {
      listType = 2
    }
    this.setData({
      show_seller_number,
      listType
    })
  },
  async search(){
    wx.showLoading({
      title: '加载中',
    })
    const _data = {
      orderBy: this.data.orderBy,
      page: this.data.page,
      pageSize: 20,
    }
    if (this.data.name) {
      _data.k = this.data.name
    }
    if (this.data.categoryId) {
      _data.categoryId = this.data.categoryId
    }
    const res = await WXAPI.goodsv2(_data)
    wx.hideLoading()
    if (res.code == 0) {
      if (this.data.page == 1) {
        this.setData({
          goods: res.data.result,
        })
      } else {
        this.setData({
          goods: this.data.goods.concat(res.data.result),
        })
      }
    } else {
      if (this.data.page == 1) {
        this.setData({
          goods: null,
        })
      } else {
        wx.showToast({
          title: '没有更多了',
          icon: 'none'
        })
      }
    }
  },
  onReachBottom() {
    this.setData({
      page: this.data.page + 1
    });
    this.search()
  },
  changeShowType(){
    if (this.data.listType == 1) {
      this.setData({
        listType: 2
      })
    } else {
      this.setData({
        listType: 1
      })
    }
  },
  bindinput(e){
    this.setData({
      name: e.detail.value
    })
  },
  bindconfirm(e){
    this.setData({
      page: 1,
      name: e.detail.value
    })
    this.search()
  },
  filter(e){
    this.setData({
      page: 1,
      orderBy: e.currentTarget.dataset.val
    })
    this.search()
  },
  async addShopCar(e) {
    const curGood = this.data.goods.find(ele => {
      return ele.id == e.currentTarget.dataset.id
    })
    if (!curGood) {
      return
    }
    if (curGood.stores <= 0) {
      wx.showToast({
        title: '已售罄~',
        icon: 'none'
      })
      return
    }
    this.addShopCarCheck({
      goodsId: curGood.id,
      buyNumber: 1,
      sku: []
    })
  },
  async addShopCarCheck(options) {
    AUTH.checkHasLogined().then(isLogined => {
      this.setData({
        wxlogin: isLogined
      })
      if (isLogined) {
        // 处理加入购物车的业务逻辑
        this.addShopCarDone(options)
      }
    })
  },
  async addShopCarDone(options) {
    const res = await WXAPI.shippingCarInfoAddItem(wx.getStorageSync('token'), options.goodsId, options.buyNumber, options.sku)
    if (res.code == 30002) {
      // 需要选择规格尺寸
      const skuCurGoodsRes = await WXAPI.goodsDetail(options.goodsId)
      if (skuCurGoodsRes.code != 0) {
        wx.showToast({
          title: skuCurGoodsRes.msg,
          icon: 'none'
        })
        return
      }
      const skuCurGoods = skuCurGoodsRes.data
      skuCurGoods.basicInfo.storesBuy = 1
      this.setData({
        skuCurGoods
      })
      return
    }
    if (res.code != 0) {
      wx.showToast({
        title: res.msg,
        icon: 'none'
      })
      return
    }
    wx.showToast({
      title: '加入成功',
      icon: 'success'
    })
    this.setData({
      skuCurGoods: null
    })
  },
  storesJia() {
    const skuCurGoods = this.data.skuCurGoods
    if (skuCurGoods.basicInfo.storesBuy < skuCurGoods.basicInfo.stores) {
      skuCurGoods.basicInfo.storesBuy++
      this.setData({
        skuCurGoods
      })
    }
  },
  storesJian() {
    const skuCurGoods = this.data.skuCurGoods
    if (skuCurGoods.basicInfo.storesBuy > 1) {
      skuCurGoods.basicInfo.storesBuy--
      this.setData({
        skuCurGoods
      })
    }
  },
  closeSku() {
    this.setData({
      skuCurGoods: null
    })
    wx.showTabBar()
  },
  skuSelect(e) {
    const pid = e.currentTarget.dataset.pid
    const id = e.currentTarget.dataset.id
    // 处理选中
    const skuCurGoods = this.data.skuCurGoods
    const property = skuCurGoods.properties.find(ele => { return ele.id == pid })
    property.childsCurGoods.forEach(ele => {
      if (ele.id == id) {
        ele.active = true
      } else {
        ele.active = false
      }
    })
    this.setData({
      skuCurGoods
    })
  },
  addCarSku() {
    const skuCurGoods = this.data.skuCurGoods
    const propertySize = skuCurGoods.properties.length // 有几组SKU
    const sku = []
    skuCurGoods.properties.forEach(p => {
      const o = p.childsCurGoods.find(ele => { return ele.active })
      if (!o) {
        return
      }
      sku.push({
        optionId: o.propertyId,
        optionValueId: o.id
      })
    })
    if (sku.length != propertySize) {
      wx.showToast({
        title: '请选择规格',
        icon: 'none'
      })
      return
    }
    const options = {
      goodsId: skuCurGoods.basicInfo.id,
      buyNumber: skuCurGoods.basicInfo.storesBuy,
      sku
    }
    this.addShopCarDone(options)
  },
})