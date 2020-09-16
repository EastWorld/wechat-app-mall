const WXAPI = require('apifm-wxapi')
Page({
  data: {

  },
  onLoad: function (options) {
    // options.id = 34094
    this.data.id = options.id
    this.fetchDetail()
  },
  onShow: function () {

  },
  async fetchDetail() {
    const res = await WXAPI.cmsArticleDetail(this.data.id)
    if (res.code == 0) {
      this.setData({
        cmsArticleDetail: res.data
      })
      wx.setNavigationBarTitle({
        title: res.data.title,
      })
    }
  },
})