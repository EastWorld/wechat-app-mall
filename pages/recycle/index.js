const WXAPI = require('apifm-wxapi')
const AUTH = require('../../utils/auth')

Page({
  data: {
    logisticsType: '0', // 0 自己送货 1 快递
    shopIndex: -1
  },
  onLoad(e) {
    // e.type = 1
    // e.orderId = 3
    // e.platform = 'jd'
    
    this.setData({
      type: e.type,
      orderId: e.orderId,
      platform: e.platform
    })

    wx.getLocation({
      type: 'wgs84', //wgs84 返回 gps 坐标，gcj02 返回可用于 wx.openLocation 的坐标
      success: res => {
        this.data.latitude = res.latitude
        this.data.longitude = res.longitude
        this.initData()
      },
      fail: err => {
        console.error(err)
        this.initData()
        AUTH.checkAndAuthorize('scope.userLocation')
      }
    })
  },
  onShow() {

  },
  async initData() {
    this.fetchShops()
    if (this.data.type == 1 && this.data.platform == 'jd') {
      this.cpsJdOrderDetail()
    }
    if (this.data.type == 1 && this.data.platform == 'pdd') {
      this.cpsPddOrderDetail()
    }  
  },
  async fetchShops(){
    const p = {}
    if (this.data.latitude) {
      p.curlatitude = this.data.latitude
    }
    if (this.data.longitude) {
      p.curlongitude = this.data.longitude
    }
    const res = await WXAPI.fetchShops(p)
    if (res.code == 0) {
      res.data.forEach(ele => {
        if (ele.distance) {
          ele.distance = ele.distance.toFixed(3) // 距离保留3位小数
        }
      })
      this.setData({
        shops: res.data
      })
    }
  },
  async cpsJdOrderDetail() {
    wx.showLoading({
      title: '',
    })
    const res = await WXAPI.cpsJdOrderDetail(wx.getStorageSync('token'), this.data.orderId)
    wx.hideLoading()
    if (res.code == 0) {
      const orderInfo = res.data.orderInfo
      if (orderInfo.validCode != 17) {
        wx.showModal({
          title: '错误',
          content: '已完成订单才可以申请回收',
          showCancel: false,
          success: res => {
            wx.navigateBack()
          }
        })
      }
      if (orderInfo.recycleOrderId) {
        wx.showModal({
          title: '错误',
          content: '请勿重复申请回收',
          showCancel: false,
          success: res => {
            wx.navigateBack()
          }
        })
      }
      this.setData({
        orderInfo,
        amountRecycle: orderInfo.estimateCosPrice,
        name: orderInfo.skuName,
        pic: orderInfo.imageUrl,
        amount: orderInfo.actualCosPrice,
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
  async cpsPddOrderDetail() {
    wx.showLoading({
      title: '',
    })
    const res = await WXAPI.cpsPddOrderDetail(wx.getStorageSync('token'), this.data.orderId)
    wx.hideLoading()
    if (res.code == 0) {
      const orderInfo = res.data.orderInfo
      if (orderInfo.status != 2 && orderInfo.status != 3 && orderInfo.status != 5) {
        wx.showModal({
          title: '错误',
          content: '已完成订单才可以申请回收',
          showCancel: false,
          success: res => {
            wx.navigateBack()
          }
        })
      }
      if (orderInfo.recycleOrderId) {
        wx.showModal({
          title: '错误',
          content: '请勿重复申请回收',
          showCancel: false,
          success: res => {
            wx.navigateBack()
          }
        })
      }
      this.setData({
        orderInfo,
        amountRecycle: orderInfo.orderAmount,
        name: orderInfo.goodsName,
        pic: orderInfo.imageUrl,
        amount: orderInfo.orderAmount,
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
  logisticsTypeChange(e) {
    this.setData({
      logisticsType: e.detail
    })
  },
  logisticsTypeClick(e) {
    this.setData({
      logisticsType: e.currentTarget.dataset.name
    })
  },
  shopSelect(e) {
    this.setData({
      shopIndex: e.detail.value
    })
  },
  callMobile() {
    const shop = this.data.shops[this.data.shopIndex]
    wx.makePhoneCall({
      phoneNumber: shop.linkPhone,
    })
  },
  goMap() {
    const shop = this.data.shops[this.data.shopIndex]
    const latitude = shop.latitude
    const longitude = shop.longitude
    wx.openLocation({
      latitude,
      longitude,
      scale: 18
    })
  },
  async submit() {
    if (!this.data.amountRecycle) {
      wx.showToast({
        title: '填写回收价格',
        icon: 'none'
      })
      return
    }
    if (this.data.shopIndex == -1) {
      wx.showToast({
        title: '请选择回收点',
        icon: 'none'
      })
      return
    }
    const res = await WXAPI.recycleOrderApply({
      token: wx.getStorageSync('token'),
      type: this.data.type,
      platform: this.data.platform,
      buyOrderId: this.data.orderId,
      name: this.data.name,
      pic: this.data.pic,
      amount: this.data.amount,
      amountRecycle: this.data.amountRecycle,
      logisticsType: this.data.logisticsType,
      shopId: this.data.shops[this.data.shopIndex].id,
      remark: this.data.remark ? this.data.remark : '',
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
      content: '提交成功，耐心等待审核',
      showCancel: false,
      success: res => {
        wx.redirectTo({
          url: '/pages/recycle/orders',
        })
      }
    })
  }
})