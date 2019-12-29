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
    WXAPI.noticeList().then(res => {
      this.setData({
        noticeList: res.data.dataList
      })
    })
  },
  onShow: function () {

  },
})