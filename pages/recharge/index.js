const wxpay = require('../../utils/pay.js')
const WXAPI = require('apifm-wxapi')
Page({
  data: {

  },
  onLoad: function (options) {
    let recharge_amount_min = wx.getStorageSync('recharge_amount_min')
    if (!recharge_amount_min) {
      recharge_amount_min = 0;
    }
    this.setData({
      recharge_amount_min: recharge_amount_min
    });
    this.rechargeSendRules()
  },
  onShow: function () {

  },
  async rechargeSendRules() {
    const res = await WXAPI.rechargeSendRules()
    if (res.code == 0) {
      this.setData({
        rechargeSendRules: res.data
      })
    }
  },
  /**
     * 点击充值优惠的充值送
     */
  rechargeAmount: function (e) {
    var confine = e.currentTarget.dataset.confine;
    var amount = confine;
    this.setData({
      amount: amount
    });
    wxpay.wxpay('recharge', amount, 0, "/pages/my/index");
  },
  async bindSave() {
    const amount = this.data.amount;
    if (!amount || amount * 1 < 0) {
      wx.showModal({
        title: '错误',
        content: '请填写正确的充值金额',
        showCancel: false
      })
      return
    }
    if (amount * 1 < this.data.recharge_amount_min * 1) {
      wx.showModal({
        title: '错误',
        content: '单次充值金额至少' + this.data.recharge_amount_min + '元',
        showCancel: false
      })
      return
    }
    wxpay.wxpay('recharge', amount, 0, "/pages/my/index");
  }
})
