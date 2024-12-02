const app = getApp();
const WXAPI = require('apifm-wxapi')
Page({
  data: {
  
  },
  onLoad: function (options) {
    var that = this;
    WXAPI.noticeDetail(options.id).then(function (res) {
      if (res.code == 0) {
        that.setData({
          notice: res.data
        });
      }
    })
  },
  onShareAppMessage() {
  },
  onShareTimeline() {    
    return {
      title: this.data.notice.title,
      query: 'id=' + this.data.notice.id,
      imageUrl: wx.getStorageSync('share_pic')
    }
  },
  subscribe() {
    const notice_subscribe_ids = wx.getStorageSync('notice_subscribe_ids')
    if (notice_subscribe_ids) {
      wx.requestSubscribeMessage({
        tmplIds: notice_subscribe_ids.split(','),
        success(res) {
          wx.showToast({
            title: '订阅成功',
          })
        },
        fail(err) {
          console.error(err)
        },
      })
    }
  },
})