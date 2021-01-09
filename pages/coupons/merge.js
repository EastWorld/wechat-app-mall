const WXAPI = require('apifm-wxapi')
const AUTH = require('../../utils/auth')
Page({
  data: {

  },
  onLoad: function (options) {
    this.mergeCouponsRules();
  },
  onShow: function () {

  },
  async mergeCouponsRules() {
    const res = await WXAPI.mergeCouponsRules()
    if (res.code == 0) {
      this.setData({
        mergeCouponsRules: res.data
      })
    }
  },
  onPullDownRefresh() {
    this.mergeCouponsRules()
    wx.stopPullDownRefresh()
  },
  async merge(e) {
    const idx = e.currentTarget.dataset.idx
    const mergeCouponsRule = this.data.mergeCouponsRules[idx]
    this.setData({loading: true})
    let res = await WXAPI.myCoupons({
      token: wx.getStorageSync('token'),
      status: 0
    })
    if (res.code == 700) {
      wx.showToast({
        title: '您暂无可用的优惠券',
        icon: 'none'
      })
      this.setData({loading: false})
      return
    }
    if (res.code != 0) {
      wx.showToast({
        title: res.msg,
        icon: 'none'
      })
      this.setData({loading: false})
      return
    }
    const myCoupons = res.data.reverse()
    const couponIds = [] // 用来合成的优惠券id
    let ok = true
    let msg = ''
    mergeCouponsRule.rules.filter(rule => {
      return rule.type == 0
    }).forEach(rule => {
      for (let i = 0; i < rule.number; i++) {
        const couponIndex = myCoupons.findIndex(ele => { return ele.pid == rule.couponId})
        if (couponIndex == -1) {
          ok = false
          msg = rule.couponName
          return
        }
        const coupon = myCoupons[couponIndex]
        couponIds.push(coupon.id)
        myCoupons.splice(couponIndex, 1)
      }
    })
    if (!ok) {
      wx.showToast({
        title: '缺少优惠券:' + msg,
        icon: 'none'
      })
      this.setData({loading: false})
      return
    }
    res = await WXAPI.mergeCoupons({
      token: wx.getStorageSync('token'),
      mergeId: mergeCouponsRule.id,
      couponIds: couponIds.join()
    })
    if (res.code != 0) {
      wx.showToast({
        title: res.msg,
        icon: 'none'
      })
      this.setData({loading: false})
      return
    }
    wx.showToast({
      title: '兑换成功'
    })
    this.setData({loading: false})
    setTimeout(() => {
      wx.navigateBack({
        delta: 0,
      })
    }, 1000);
  }
})