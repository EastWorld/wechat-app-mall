const WXAPI = require('apifm-wxapi')
const AUTH = require('../../utils/auth')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    balance: 0.00
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      balance_pay_pwd: wx.getStorageSync('balance_pay_pwd')
    })
  },
  onShow: function() {
    AUTH.checkHasLogined().then(isLogined => {
      if (!isLogined) {
        AUTH.login(this)
      } else {
        this.userAmount()
      }
    })   
  },
  async userAmount() {
    const res = await WXAPI.userAmount(wx.getStorageSync('token'))
    if (res.code === 0) {
      this.setData({
        balance: res.data.balance
      })
    }
  },
  async bindSave() {
    let minWidthAmount = wx.getStorageSync('WITHDRAW_MIN');
    if (!minWidthAmount) {
      minWidthAmount = 0
    }
    const amount = this.data.amount;
    if (!amount) {
      wx.showToast({
        title: '请填写正确的提现金额',
        icon: 'none',
      })
      return
    }
    if (this.data.balance_pay_pwd && !this.data.pwd) {
      wx.showToast({
        title: '请输入交易密码',
        icon: 'none'
      })
      return
    }
    if (amount * 1 < minWidthAmount) {
      wx.showToast({
        title: '提现金额不能低于' + minWidthAmount,
        icon: 'none',
      })
      return
    }
    const res = await WXAPI.withDrawApplyV2({
      token: wx.getStorageSync('token'),
      money: amount,
      pwd: this.data.pwd
    })
    if (res.code == 0) {
      wx.showModal({
        title: '成功',
        content: '您的提现申请已提交，等待财务打款',
        showCancel: false,
        success: function(res) {
          if (res.confirm) {
            wx.navigateBack({
              delta: 0,
            })
          }
        }
      })
    } else {
      wx.showToast({
        title: res.msg,
        icon: 'none'
      })
    }
  }
})