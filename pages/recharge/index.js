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
  async rechargeAmount(e) {
    // 判断是否需要绑定手机号码
    // https://www.yuque.com/apifm/nu0f75/zgf8pu
    const resUserDetail = await WXAPI.userDetail(wx.getStorageSync('token'))
    if (resUserDetail.code == 0 && !resUserDetail.data.base.mobile) {
      this.setData({
        bindMobileShow: true
      })
      return
    }
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
    // 判断是否需要绑定手机号码
    // https://www.yuque.com/apifm/nu0f75/zgf8pu
    const resUserDetail = await WXAPI.userDetail(wx.getStorageSync('token'))
    if (resUserDetail.code == 0 && !resUserDetail.data.base.mobile) {
      this.setData({
        bindMobileShow: true
      })
      return
    }
    wxpay.wxpay('recharge', amount, 0, "/pages/my/index");
  },
  bindMobileOk(e) {
    console.log(e.detail); // 这里是组件里data的数据
    this.setData({
      bindMobileShow: false
    })
  },
  bindMobileCancel() {
    this.setData({
      bindMobileShow: false
    })
  },
})
