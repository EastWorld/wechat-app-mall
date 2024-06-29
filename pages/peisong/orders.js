const WXAPI = require('apifm-wxapi')
const APP = getApp()
// fixed首次打开不显示标题的bug
APP.configLoadOK = () => {
  
}
var timer
Page({
  data: {
    active: 0,
    tabs: ['已接单', '服务中', '全部'],
  },
  onLoad: function (options) {
    this.data.status = options.status // -1 待接单订单 ； 1 待分配订单 ； 其他状态： 我的维修单
    this.setData({
      status: options.status
    })
    if (options.status == -1) {
      wx.setNavigationBarTitle({
        title: '抢单任务大厅',
      })
    } else if (options.status == 1) {
      wx.setNavigationBarTitle({
        title: '管理员派单管理',
      })
    } else {
      wx.setNavigationBarTitle({
        title: '我的配送单',
      })
    }
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
      // 管理员派单
      _data.statusBatch = this.data.status
      _data.refundStatusBatch = '0,2'
    } else {
      // 我的配送单
      _data.uid = wx.getStorageSync('uid')
      if (this.data.active == 0) {
        _data.status = 2
      } else if (this.data.active == 1) {
        _data.status = 3
      }
    }
    const res = await WXAPI.peisongOrders(_data)
    wx.hideLoading()
    if (res.code != 0) {
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
  tabClick(e) {
    this.setData({
      active: e.detail.index
    })
    this.orders()
  },
})