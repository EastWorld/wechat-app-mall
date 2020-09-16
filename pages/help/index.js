const WXAPI = require('apifm-wxapi')
Page({
  data: {

  },
  onLoad: function (options) {
    this.category()
  },
  onShow: function () {

  },
  async category() {
    const res = await WXAPI.cmsCategories()
    if (res.code == 0) {
      const category = res.data.filter(ele => {
        return ele.type == 'qa'
      })
      this.setData({
        category: category
      })
      if (category && category.length > 0) {
        this.articles(category[0].id)
      }
    }
  },
  async articles(categoryId) {
    wx.showLoading({
      title: '',
    })
    const res = await WXAPI.cmsArticles({
      categoryId
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
  categoryChange(e) {
    const index = e.detail
    const category = this.data.category[index]
    this.articles(category.id)
  },
})