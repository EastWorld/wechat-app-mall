const WXAPI = require('apifm-wxapi')
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
  onShow: function () {

  },
  bindSave: function (e) {
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
