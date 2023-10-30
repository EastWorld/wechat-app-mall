const WXAPI = require('apifm-wxapi')
Page({
  data: {

  },
  onLoad: function (options) {
    if (!options.key) {
      options.key = 'aboutus'
    }
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
  onShareAppMessage: function() {
    const uid = wx.getStorageSync('uid')
    return {
      title: wx.getStorageSync('mallName') + ' - ' + this.data.cmsPageDetail.info.title,
      path: `/pages/about/index?key=${this.data.key}&inviter_id=${ uid ? uid : ''}`,
      imageUrl: wx.getStorageSync('share_pic')
    }
  },
  onShareTimeline() {
    const uid = wx.getStorageSync('uid')   
    return {
      title: wx.getStorageSync('mallName') + ' - ' + this.data.cmsPageDetail.info.title,
      query: `key=${this.data.key}&inviter_id=${ uid ? uid : ''}`,
      imageUrl: wx.getStorageSync('share_pic')
    }
  },
})