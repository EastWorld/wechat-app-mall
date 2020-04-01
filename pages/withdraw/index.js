const app = getApp()
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

  },
  bindCancel: function() {
    wx.navigateBack({})
  },
  bindSave: function(e) {
    const that = this;
    let minWidthAmount = wx.getStorageSync('WITHDRAW_MIN');
    if (!minWidthAmount) {
      minWidthAmount = 0
    }
    var amount = e.detail.value.amount;

    if (!amount) {
      wx.showModal({
        title: '错误',
        content: '请填写正确的提现金额',
        showCancel: false
      })
      return
    }
    if (amount * 1 < minWidthAmount) {
      wx.showModal({
        title: '错误',
        content: '提现金额不能低于' + minWidthAmount + '元',
        showCancel: false
      })
      return
    }
    WXAPI.withDrawApply(wx.getStorageSync('token'), amount).then(function(res) {
      if (res.code == 0) {
        wx.showModal({
          title: '成功',
          content: '您的提现申请已提交，等待财务打款',
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
          content: res.msg,
          showCancel: false
        })
      }
    })
  }
})