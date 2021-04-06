const WXAPI = require('apifm-wxapi')
const wxpay = require('../../utils/pay.js')
const AUTH = require('../../utils/auth')

Page({
  data: {
    payType: 'wxpay'
  },
  onLoad: function (options) {
    this.payBillDiscounts()
    this.setData({
      balance_pay_pwd: wx.getStorageSync('balance_pay_pwd')
    })
  },
  onShow () {
    AUTH.checkHasLogined().then(isLogined => {
      if (!isLogined) {
        AUTH.login(this)
      } else {
        this.userAmount()
      }
    })    
  },
  async payBillDiscounts() {
    const res = await WXAPI.payBillDiscounts()
    if (res.code === 0) {
      this.setData({
        rechargeSendRules: res.data
      })
    }
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
    const amount = this.data.amount;
    if (!amount) {
      wx.showToast({
        title: '请填写正确的消费金额',
        icon: 'none'
      })
      return
    }
    if (this.data.payType == 'balance') {
      if (this.data.balance_pay_pwd == '1' && !this.data.pwd) {
        wx.showToast({
          title: '请输入交易密码',
          icon: 'none'
        })
        return
      }
    }
    const res = await WXAPI.payBillV2({
      token: wx.getStorageSync('token'),
      money: amount,
      calculate: true
    })
    if (res.code != 0) {
      wx.showToast({
        title: res.msg,
        icon: 'none'
      })
      return
    }
    const amountReal = res.data.realMoney
    const _msg = `您本次消费${amount}，优惠后只需支付${amountReal}`
    
    wx.showModal({
      title: '请确认消费金额',
      content: _msg,
      confirmText: "确认支付",
      cancelText: "取消支付",
      success: res => {
        if (res.confirm) {
          this.goPay(amount, amountReal)
        }
      }
    });
  },
  async goPay(amount, wxpayAmount){
    if (this.data.payType == 'balance') {
      const res = await WXAPI.payBillV2({
        token: wx.getStorageSync('token'),
        money: amount,
        pwd: this.data.pwd
      })
      if (res.code != 0) {
        wx.showToast({
          title: res.msg,
          icon: 'none'
        })
        return
      }
      wx.showModal({
        title: '成功',
        content: '买单成功，欢迎下次光临！',
        showCancel: false
      })
    } else {
      wxpay.wxpay('paybill', wxpayAmount, 0, "/pages/asset/index", { money: amount});
    }
  },
  payTypeChange(event) {
    this.setData({
      payType: event.detail,
    });
  },
  payTypeClick(event) {
    const { name } = event.currentTarget.dataset;
    this.setData({
      payType: name,
    });
  },
})