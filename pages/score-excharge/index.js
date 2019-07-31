const app = getApp()
const WXAPI = require('../../wxapi/main')
const AUTH = require('../../utils/auth')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    uid: undefined
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    AUTH.checkHasLogined().then(isLogined => {
      if (!isLogined) {
        wx.showModal({
          title: '提示',
          content: '本次操作需要您的登录授权',
          cancelText: '暂不登录',
          confirmText: '前往登录',
          success(res) {
            if (res.confirm) {
              wx.switchTab({
                url: "/pages/my/index"
              })
            } else {
              wx.navigateBack()
            }
          }
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  bindSave: function(e) {
    var that = this;
    var amount = e.detail.value.amount;

    if (amount == "") {
      wx.showModal({
        title: '错误',
        content: '请填写正确的券号',
        showCancel: false
      })
      return
    }
    WXAPI.scoreExchange(amount, wx.getStorageSync('token')).then(function(res) {
      if (res.code == 700) {
        wx.showModal({
          title: '错误',
          content: '券号不正确',
          showCancel: false
        })
        return
      }
      if (res.code == 0) {
        wx.showModal({
          title: '成功',
          content: '恭喜您，成功兑换 ' + res.data.score + ' 积分',
          showCancel: false,
          success: function(res) {
            if (res.confirm) {
              that.bindCancel();
            }
          }
        })
      } else {
        wx.showModal({
          title: '错误',
          content: res.data.msg,
          showCancel: false
        })
      }
    })
  }
})