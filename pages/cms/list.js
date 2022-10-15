const WXAPI = require('apifm-wxapi')
Page({
  data: {
    categoryId: undefined, // 分类id
  },
  onLoad (options) {
    this.data.categoryId = options.categoryId
    this.cmsCategoryDetail()
    this.articles()
  },
  onShow: function () {

  },
  async cmsCategoryDetail() {
    const res = await WXAPI.cmsCategoryDetail(this.data.categoryId)
    if (res.code == 0) {
      this.setData({
        category: res.data
      })
      wx.setNavigationBarTitle({
        title: res.data.info.name,
      })
    }
  },
  async articles() {
    wx.showLoading({
      title: '',
    })
    const res = await WXAPI.cmsArticles({
      categoryId: this.data.categoryId
    })
    wx.hideLoading()
    if (res.code == 0) {
      this.setData({
        cmsArticles: res.data
      })
    } else {
      this.setData({
        cmsArticles: null
      })
    }
  },
  onShareAppMessage: function() {    
    return {
      title: this.data.category.info.name,
      path: '/pages/cms/list?categoryId='+ this.data.categoryId +'&inviter_id=' + wx.getStorageSync('uid')
    }
  },
})