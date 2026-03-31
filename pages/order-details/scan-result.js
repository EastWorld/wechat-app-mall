const WXAPI = require('apifm-wxapi')
const AUTH = require('../../utils/auth')

Page({
  data: {
    apiOK: false,
  },
  onLoad: function (e) {
    // e.hxNumber = '2307150981053363'
    // 读取小程序码中的核销码
    console.log('e', e);
    if (e && e.scene) {
      const scene = decodeURIComponent(e.scene)
      if (scene) {
        e.hxNumber = scene
      }
    }
    this.setData({
      hxNumber: e.hxNumber
    })
    AUTH.checkHasLogined().then(isLogined => {
      if (isLogined) {
        this.orderDetail()
      } else {
        getApp().loginOK = () => {
          this.orderDetail()
        }
      }
    })
  },
  onShow() {
  },
  async orderDetail() {
    wx.showLoading({
      title: '',
    })
    // https://www.yuque.com/apifm/nu0f75/qlzy3q
    const resConfig = await WXAPI.queryConfigValue('order_hx_uids')
    const res = await WXAPI.orderDetail(wx.getStorageSync('token'), '', this.data.hxNumber)
    wx.hideLoading()
    if (resConfig.code != 0) {
      wx.showModal({
        content: resConfig.msg,
        showCancel: false
      })
      return;
    }
    if (res.code != 0) {
      wx.showModal({
        content: res.msg,
        showCancel: false
      })
      return;
    }
    const order_hx_uids = resConfig.data
    const uid = wx.getStorageSync('uid')
    if (order_hx_uids.indexOf(uid) != -1) {
      this.setData({
        apiOK: true,
        canHX: true,
        orderDetail: res.data
      })
    } else {
      this.setData({
        apiOK: true,
        orderDetail: res.data
      })
    }
  },
  wuliuDetailsTap: function (e) {
    var orderId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: "/pages/wuliu/index?id=" + orderId
    })
  },
  async doneHx(){
    wx.showLoading({
      title: '处理中...',
    })
    const res = await WXAPI.orderHXV2({
      token: wx.getStorageSync('token'),
      hxNumber: this.data.hxNumber
    })
    wx.hideLoading()
    if (res.code != 0) {
      wx.showToast({
        title: res.msg,
        icon: 'none'
      })
    } else {
      wx.showToast({
        title: '核销完成',
        icon: 'none'
      })
      this.orderDetail()
    }
  },
})