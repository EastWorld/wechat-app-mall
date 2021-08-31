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
    // options.id = 1871848
    this.userDetailSpreadUser(options.id)
  },
  onShow: function () {

  },
  async userDetailSpreadUser(uid) {
    const res = await WXAPI.userDetailSpreadUser(wx.getStorageSync('token'), uid)
    if (res.code != 0) {
      wx.showModal({
        title: '错误',
        content: res.msg,
        showCancel: false
      })
      return
    }
    this.setData({
      userInfoMap: res.data
    })
  },
})