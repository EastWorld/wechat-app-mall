const WXAPI = require('apifm-wxapi')
const dayjs = require("dayjs")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name: '', // 搜索关键词
    page: 1, // 读取第几页
    categoryIndex: -1,
    dayArray: ['全部', '一周内', '一月内', '半年内', '一年内'],
    dayIndex: -1,
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
    this.categories()
  },
  onShow: function () {

  },
  readConfigVal() {
  },
  search2(e) {
    this.data.page = 1
    this.data.name = e.detail
    this.search()
  },
  search3() {
    this.data.page = 1
    this.data.name = ''
    this.search()
  },
  async search(){
    wx.showLoading({
      title: '',
    })
    // https://www.yuque.com/apifm/nu0f75/stigxd
    const res = await WXAPI.myBuyGoodsHis({
      page: this.data.page,
      nameLike: this.data.name || '',
      dateBuyBegin: this.data.dateBuyBegin || '',
      dateBuyEnd: this.data.dateBuyEnd || '',
      categoryId: this.data.categoryId || '',
      token: wx.getStorageSync('token'),
      pageSize: 20,
    })
    wx.hideLoading()
    if (res.code == 0) {
      if (this.data.page == 1) {
        this.setData({
          goods: res.data,
        })
      } else {
        this.setData({
          goods: this.data.goods.concat(res.data),
        })
      }
    } else {
      if (this.data.page == 1) {
        this.setData({
          goods: null,
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
  async categories() {
    // https://www.yuque.com/apifm/nu0f75/racmle
    const res = await WXAPI.goodsCategory()
    if (res.code == 0) {
      const categories = res.data
      categories.forEach(p => {
        p.childs = categories.filter(ele => {
          return p.id == ele.pid
        })
      })
      this.setData({
        categories: [{id: 0, name: '全部'}].concat(res.data.filter(ele => ele.level == 1))
      })
    }
  },
  categoryChange(e) {
    this.setData({
      categoryIndex: e.detail.value,
      categoryId: this.data.categories[e.detail.value].id
    })
    this.data.page = 1
    this.search()
  },
  dayChange(e) {
    const dayIndex = e.detail.value
    this.data.page = 1
    let dateBuyBegin = ''
    if (dayIndex == 0) {
      // 全部
      dateBuyBegin = ''
    }
    if (dayIndex == 1) {
      // 一周内
      dateBuyBegin = dayjs().subtract(7, 'day').format('YYYY-MM-DD')
    }
    if (dayIndex == 2) {
      // 一月内
      dateBuyBegin = dayjs().subtract(1, 'month').format('YYYY-MM-DD')
    }
    if (dayIndex == 3) {
      // 半年内
      dateBuyBegin = dayjs().subtract(6, 'month').format('YYYY-MM-DD')
    }
    if (dayIndex == 4) {
      // 1年内
      dateBuyBegin = dayjs().subtract(1, 'year').format('YYYY-MM-DD')
    }
    this.setData({
      dayIndex,
      dateBuyBegin,
    })
    this.search()
  },
})