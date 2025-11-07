const WXAPI = require('apifm-wxapi')
import wxbarcode from 'wxbarcode'

Page({
  data: {
    balance: 0,
    freeze: 0,
    score: 0,
    growth: 0,
    userCode: undefined
  },
  onLoad(e) {
    this.getUserAmount()
    this.dynamicUserCode()
  },
  onShow: function () {
  },
  async getUserAmount() {
    const res = await WXAPI.userAmount(wx.getStorageSync('token'))
    if (res.code == 0) {
      this.setData({
        balance: res.data.balance,
        freeze: res.data.freeze,
        score: res.data.score,
        growth: res.data.growth
      })
    }
  },
  async dynamicUserCode() {
    const res = await WXAPI.dynamicUserCode(wx.getStorageSync('token'))
    if (res.code == 0) {
      this.setData({
        userCode: res.data
      })
      wxbarcode.barcode('barcode', res.data, 560, 200);
      wxbarcode.qrcode('qrcode', res.data, 480, 480);
    }
  },
})