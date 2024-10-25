const app = getApp()
const WXAPI = require('apifm-wxapi')
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
  onShow: function() {
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
    WXAPI.scoreExchange(wx.getStorageSync('token'), amount).then(function(res) {
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