const WXAPI = require('apifm-wxapi')
const AUTH = require('../../utils/auth')
const TOOLS = require('../../utils/tools.js') // TOOLS.showTabBarBadge();

Page({
  /**
   * 页面的初始数据
   */
  data: {
    categories: [],
    activeCategory: 0,
    categorySelected: {
      name: '',
      id: ''
    },
    currentGoods: [],
    onLoadStatus: true,
    scrolltop: 0,

    skuCurGoods: undefined
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.showShareMenu({
      withShareTicket: true
    })
    this.categories();
  },
  async categories() {
    wx.showLoading({
      title: '加载中',
    })
    const res = await WXAPI.goodsCategory()
    wx.hideLoading()
    let categories = [];
    let categoryName = '';
    let categoryId = '';
    if (res.code == 0) {
      if (this.data.categorySelected.id) {
        const _curCategory = res.data.find(ele => {
          return ele.id == this.data.categorySelected.id
        })
        categoryName = _curCategory.name;
        categoryId = _curCategory.id;
      }
      for (let i = 0; i < res.data.length; i++) {
        let item = res.data[i];
        categories.push(item);
        if (i == 0 && !this.data.categorySelected.id) {
          categoryName = item.name;
          categoryId = item.id;
        }
      }
    }
    this.setData({
      categories: categories,
      categorySelected: {
        name: categoryName,
        id: categoryId
      }
    });
    this.getGoodsList();
  },
  async getGoodsList() {
    wx.showLoading({
      title: '加载中',
    })
    const res = await WXAPI.goods({
      categoryId: this.data.categorySelected.id,
      page: 1,
      pageSize: 100000
    })
    wx.hideLoading()
    if (res.code == 700) {
      this.setData({
        currentGoods: null
      });
      return
    }
    this.setData({
      currentGoods: res.data
    });
  },
  onCategoryClick(e) {
    const idx = e.target.dataset.idx
    if (idx == this.data.activeCategory) {
      this.setData({
        scrolltop: 0,
      })
      return
    }
    this.setData({
      activeCategory: idx,
      categorySelected: this.data.categories[idx],
      scrolltop: 0
    });
    this.getGoodsList();
  },
  bindconfirm(e) {
    this.setData({
      inputVal: e.detail
    })
    wx.navigateTo({
      url: '/pages/goods/list?name=' + this.data.inputVal,
    })
  },
  onShareAppMessage() {    
    return {
      title: '"' + wx.getStorageSync('mallName') + '" ' + wx.getStorageSync('share_profile'),
      path: '/pages/index/index?inviter_id=' + wx.getStorageSync('uid')
    }
  },
  onShow() {
    AUTH.checkHasLogined().then(isLogined => {
      if (isLogined) {
        this.setData({
          wxlogin: isLogined
        })
        TOOLS.showTabBarBadge() // 获取购物车数据，显示TabBarBadge
      }
    })
    const _categoryId = wx.getStorageSync('_categoryId')
    wx.removeStorageSync('_categoryId')
    if (_categoryId) {
      this.data.categorySelected.id = _categoryId
      this.categories();
    } else {
      this.data.categorySelected.id = null
    }
  },
  async addShopCar(e) {
    const curGood = this.data.currentGoods.find(ele => {
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
  async addShopCarCheck(options){
    AUTH.checkHasLogined().then(isLogined => {
      this.setData({
        wxlogin: isLogined
      })
      if (isLogined) {
        // 处理加入购物车的业务逻辑
        this.addShopCarDone(options)
      } else {
        AUTH.openLoginDialog()
      }
    })
  },
  async addShopCarDone(options){
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
      wx.hideTabBar()
      const skuCurGoods = skuCurGoodsRes.data
      skuCurGoods.basicInfo.storesBuy = 1
      this.setData({
        skuCurGoods,
        skuGoodsPic: skuCurGoods.basicInfo.pic,
        selectSizePrice: skuCurGoods.basicInfo.minPrice,
        selectSizeOPrice: skuCurGoods.basicInfo.originalPrice,
        skuCurGoodsShow: true
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
      skuCurGoods: null,
      skuCurGoodsShow: false
    })
    wx.showTabBar()
    TOOLS.showTabBarBadge() // 获取购物车数据，显示TabBarBadge
  },
  storesJia(){
    const skuCurGoods = this.data.skuCurGoods
    if (skuCurGoods.basicInfo.storesBuy < skuCurGoods.basicInfo.stores) {
      skuCurGoods.basicInfo.storesBuy++
      this.setData({
        skuCurGoods
      })
    }
  },
  storesJian(){
    const skuCurGoods = this.data.skuCurGoods
    if (skuCurGoods.basicInfo.storesBuy > 1) {
      skuCurGoods.basicInfo.storesBuy--
      this.setData({
        skuCurGoods
      })
    }
  },
  closeSku(){
    this.setData({
      skuCurGoods: null,
      skuCurGoodsShow: false
    })
    wx.showTabBar()
  },
  skuSelect(e){
    const pid = e.currentTarget.dataset.pid
    const id = e.currentTarget.dataset.id
    // 处理选中
    const skuCurGoods = this.data.skuCurGoods
    const property = skuCurGoods.properties.find(ele => {return ele.id == pid})
    let child
    property.childsCurGoods.forEach(ele => {
      if (ele.id == id) {
        ele.active = true
        child = ele
      } else {
        ele.active = false
      }
    })
    // 显示图片
    let skuGoodsPic = this.data.skuGoodsPic
    if (skuCurGoods.subPics && skuCurGoods.subPics.length > 0) {
      const _subPic = skuCurGoods.subPics.find(ele => {
        return ele.optionValueId == child.id
      })
      if (_subPic) {
        skuGoodsPic = _subPic.pic
      }
    }
    this.setData({
      skuCurGoods,
      skuGoodsPic
    })
    // 计算价格
    this.calculateGoodsPrice()
  },
  async calculateGoodsPrice() {
    // 计算最终的商品价格
    let price = this.data.skuCurGoods.basicInfo.minPrice
    let originalPrice = this.data.skuCurGoods.basicInfo.originalPrice
    let totalScoreToPay = this.data.skuCurGoods.basicInfo.minScore
    let buyNumMax = this.data.skuCurGoods.basicInfo.stores
    let buyNumber = this.data.skuCurGoods.basicInfo.minBuyNumber
    // 计算 sku 价格
    const needSelectNum = this.data.skuCurGoods.properties.length
    let curSelectNum = 0;
    let propertyChildIds = "";
    let propertyChildNames = "";
    this.data.skuCurGoods.properties.forEach(p => {
      p.childsCurGoods.forEach(c => {
        if (c.active) {
          curSelectNum++;
          propertyChildIds = propertyChildIds + p.id + ":" + c.id + ",";
          propertyChildNames = propertyChildNames + p.name + ":" + c.name + "  ";
        }
      })
    })
    let canSubmit = false;
    if (needSelectNum == curSelectNum) {
      canSubmit = true;
    }
    if (canSubmit) {
      const res = await WXAPI.goodsPrice(this.data.skuCurGoods.basicInfo.id, propertyChildIds)
      if (res.code == 0) {
        price = res.data.price
        originalPrice = res.data.originalPrice
        totalScoreToPay = res.data.score
        buyNumMax = res.data.stores
      }
    }
    this.setData({
      selectSizePrice: price,
      selectSizeOPrice: originalPrice,
      totalScoreToPay: totalScoreToPay,
      buyNumMax,
      buyNumber: (buyNumMax > buyNumber) ? buyNumber : 0
    });
  },
  addCarSku(){
    const skuCurGoods = this.data.skuCurGoods
    const propertySize = skuCurGoods.properties.length // 有几组SKU
    const sku = []
    skuCurGoods.properties.forEach(p => {
      const o = p.childsCurGoods.find(ele => {return ele.active})
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
  processLogin(e) {
    if (!e.detail.userInfo) {
      wx.showToast({
        title: '已取消',
        icon: 'none',
      })
      return;
    }
    AUTH.register(this);
  },
  onReachBottom: function() {
    
  },
})