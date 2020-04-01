const app = getApp();
const WXAPI = require('apifm-wxapi')
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
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

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },
  onShareAppMessage() {    
    return {
      title: this.data.notice.title,
      path: '/pages/start/loading?inviter_id=' + wx.getStorageSync('uid') + '&route=/pages/notice/show%3fid%3d'+this.data.notice.id
    }
  },
})