const WXAPI = require('apifm-wxapi')
Page({
  data: {

  },
  onLoad: function (options) {
    options.key = 'aboutus'
    this.data.key = options.key
    this.cmsPage()
  },
  onShow: function () {

  },
  async cmsPage() {
    const res = await WXAPI.cmsPage(this.data.key)
    if (res.code == 0) {
      this.setData({
        cmsPageDetail: res.data
      })
      wx.setNavigationBarTitle({
        title: res.data.info.title,
      })
    }
  },
})