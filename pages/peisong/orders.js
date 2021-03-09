const WXAPI = require('apifm-wxapi')
const APP = getApp()
// fixed首次打开不显示标题的bug
APP.configLoadOK = () => {
  
}
var timer
Page({
  data: {

  },
  onLoad: function (options) {
    this.data.status = options.status
    if (this.data.status == -1) {
      timer =setInterval(() => {
        this.peisongOrdersGrabbing()
      }, 1000)
    }
  },
  onShow: function () {
    if (this.data.status != -1) {
      this.orders()
    }
  },
  onUnload() {
    if (timer) {
      clearTimeout(timer)
    }
  },
  async orders() {
    wx.showLoading({
      title: '',
    })
    const _data = {
      token: wx.getStorageSync('token'),
    }
    if(this.data.status) {
      _data.statusBatch = this.data.status
      _data.refundStatusBatch = '0,2'
    } else {
      _data.uid = wx.getStorageSync('uid')
    }
    const res = await WXAPI.peisongOrders(_data)
    wx.hideLoading({
      complete: (res) => {},
    })
    if (res.code != 0) {
      wx.showToast({
        title: res.msg,
        icon: 'none'
      })
      this.setData({
        orderList: null
      })
    } else {
      res.data.result.forEach(ele => {
        if (ele.status == 2) {
          ele.statusStr = '已接单'
        }
        if (ele.status == 3) {
          ele.statusStr = '配送中'
        }
      })
      this.setData({
        orderList: res.data.result
      })
    }
  },
  async peisongOrdersGrabbing() {
    // wx.showLoading({
    //   title: '',
    // })    
    const res = await WXAPI.peisongOrdersGrabbing(wx.getStorageSync('token'))
    // wx.hideLoading({
    //   complete: (res) => {},
    // })
    if (res.code != 0) {
      // wx.showToast({
      //   title: res.msg,
      //   icon: 'none'
      // })
      this.setData({
        orderList: null
      })
    } else {
      res.data.forEach(ele => {
        if (ele.status == 2) {
          ele.statusStr = '已接单'
        }
        if (ele.status == 3) {
          ele.statusStr = '服务中'
        }
      })
      this.setData({
        orderList: res.data
      })
    }    
  },
})