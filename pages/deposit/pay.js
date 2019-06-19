const WXAPI = require('../../wxapi/main')
const app = getApp()
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

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  bindSave: function (e) {
    WXAPI.addTempleMsgFormid({
      token: wx.getStorageSync('token'),
      type: 'form',
      formId: e.detail.formId
    })
    const that = this;
    const amount = e.detail.value.amount;

    if (amount == "" || amount * 1 < 0) {
      wx.showModal({
        title: '错误',
        content: '请填写正确的押金金额',
        showCancel: false
      })
      return
    }
    WXAPI.payDeposit({
      token: wx.getStorageSync('token'),
      amount: amount
    }, 'post').then(res => {
      if (res.code == 40000) {
        wx.showModal({
          title: '请先充值',
          content: res.msg,
          showCancel: false,
          success(res) {
            wx.navigateTo({
              url: "/pages/recharge/index"
            })
          }
        })
        return
      }
      if (res.code != 0) {
        wx.showModal({
          title: '错误',
          content: res.msg,
          showCancel: false
        })
        return
      }
      wx.showModal({
        title: '成功',
        content: '押金支付成功',
        showCancel: false,
        success(res) {
          wx.navigateTo({
            url: "/pages/asset/index"
          })
        }
      })
    })
  }
})
