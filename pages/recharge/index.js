const wxpay = require('../../utils/pay.js')
const WXAPI = require('apifm-wxapi')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    uid: undefined,
    rechargeSendRules: undefined
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let recharge_amount_min = wx.getStorageSync('recharge_amount_min')
    if (!recharge_amount_min) {
      recharge_amount_min = 0;
    }
    this.setData({
      uid: wx.getStorageSync('uid'),
      recharge_amount_min: recharge_amount_min
    });
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


  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    const _this = this
    WXAPI.rechargeSendRules().then(res => {
      if (res.code === 0) {
        _this.setData({
          rechargeSendRules: res.data
        });
      }
    })

  },
  bindSave: function (e) {
    const that = this;
    const amount = e.detail.value.amount;

    if (amount == "" || amount * 1 < 0) {
      wx.showModal({
        title: '错误',
        content: '请填写正确的充值金额',
        showCancel: false
      })
      return
    }
    if (amount * 1 < that.data.recharge_amount_min * 1) {
      wx.showModal({
        title: '错误',
        content: '单次充值金额至少' + that.data.recharge_amount_min + '元',
        showCancel: false
      })
      return
    }
    wxpay.wxpay('recharge', amount, 0, "/pages/my/index");
  }
})
