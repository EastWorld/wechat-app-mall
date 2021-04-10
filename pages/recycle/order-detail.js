const WXAPI = require('apifm-wxapi')
const AUTH = require('../../utils/auth')
import wxbarcode from 'wxbarcode'

Page({
  data: {
    logisticsType: '0', // 0 自己送货 1 快递
    shopIndex: -1
  },
  onLoad(e) {
    // e.id = 3
    this.data.id = e.id
    this.recycleOrderDetail()
  },
  onShow() {

  },
  async recycleOrderDetail() {
    wx.showLoading({
      title: '',
    })
    const res = await WXAPI.recycleOrderDetail(wx.getStorageSync('token'), this.data.id)
    wx.hideLoading()
    if (res.code == 0) {
      const orderInfo = res.data.orderInfo
      if (orderInfo.shopId) {
        this.shopSubdetail(orderInfo.shopId)
      }
      if (orderInfo.logisticsType == 0) {
        wxbarcode.qrcode('qrcode', orderInfo.hxNumber, 650, 650);
      }
      this.setData({
        orderInfo,
        shipperName: orderInfo.shipperName,
        trackingNumber: orderInfo.trackingNumber
      })
    } else {
      wx.showModal({
        title: '错误',
        content: res.msg,
        showCancel: false,
        success: res => {
          wx.navigateBack()
        }
      })
    }
  },
  async shopSubdetail(shopId) {
    const res = await WXAPI.shopSubdetail(shopId)
    if (res.code == 0) {
      this.setData({
        shopInfodetail: res.data
      })
    }
  },
  callMobile() {
    wx.makePhoneCall({
      phoneNumber: this.data.shopInfodetail.info.linkPhone,
    })
  },
  goMap() {
    const shop = this.data.shopInfodetail.info
    const latitude = shop.latitude
    const longitude = shop.longitude
    wx.openLocation({
      latitude,
      longitude,
      scale: 18
    })
  },
  fahuo() {
    this.setData({
      popupShow: true
    })
  },
  popupClose() {
    this.setData({
      popupShow: false
    })
  },
  trackingNumberScan() {
    wx.scanCode({
      success: res => {
        this.setData({
          trackingNumber: res.result
        })
      }
    })
  },
  async submit() {
    if (!this.data.shipperName) {
      wx.showToast({
        title: '填写回快递公司',
        icon: 'none'
      })
      return
    }
    if (!this.data.trackingNumber) {
      wx.showToast({
        title: '填写回快递单号',
        icon: 'none'
      })
      return
    }
    this.setData({
      submitButtonLoading: true
    })
    const res = await WXAPI.recycleOrderFahuo({
      token: wx.getStorageSync('token'),
      id: this.data.id,
      shipperName: this.data.shipperName,
      trackingNumber: this.data.trackingNumber,
    })
    this.setData({
      submitButtonLoading: false
    })
    if (res.code != 0) {
      wx.showToast({
        title: res.msg,
        icon: 'none'
      })
      return
    }
    wx.showToast({
      title: '提交成功',
    })
    this.popupClose()
    this.recycleOrderDetail()
  }
})