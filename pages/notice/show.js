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
})