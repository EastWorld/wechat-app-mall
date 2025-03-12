const WXAPI = require('apifm-wxapi')
const AUTH = require('../../utils/auth')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    balance: 0.00,
    freeze: 0,
    score: 0,
    score_sign_continuous: 0,
    cashlogs: undefined,

    tabs: ["资金明细", "提现记录", "押金记录"],
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0,

    withDrawlogs: undefined,
    depositlogs: undefined,

    rechargeOpen: false, // 是否开启充值[预存]功能
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const withdrawal = wx.getStorageSync('withdrawal')
    if (withdrawal == '1') {
      this.setData({
        withdrawal,
        tabs: ["资金明细", "提现记录", "押金记录"]
      })
    } else {
      this.setData({
        tabs: ["资金明细", "押金记录"]
      })
    }
    AUTH.checkHasLogined().then(isLogined => {
      if (isLogined) {
        this.initData()
      } else {
        getApp().loginOK = () => {
          this.initData()
        }
      }
    })
  },
  onShow() {
  },
  initData() {
    const _this = this
    const token = wx.getStorageSync('token')
    WXAPI.userAmount(token).then(function (res) {
      if (res.code == 700) {
        wx.showToast({
          title: '当前账户存在异常',
          icon: 'none'
        })
        return
      }
      if (res.code == 0) {
        _this.setData({
          balance: res.data.balance.toFixed(2),
          freeze: res.data.freeze.toFixed(2),
          totleConsumed: res.data.totleConsumed.toFixed(2),
          score: res.data.score
        });
      }
    })
    this.fetchTabData(this.data.activeIndex)
  },
  fetchTabData(activeIndex){
    if (activeIndex == 0) {
      this.cashLogs()
    }
    if (activeIndex == 1) {
      this.withDrawlogs()
    }
    if (activeIndex == 2) {
      this.depositlogs()
    }
  },
  cashLogs() {
    const _this = this
    WXAPI.cashLogsV2({
      token: wx.getStorageSync('token'),
      page:1,
      dateAddBegin: this.data.dateAddBegin || '',
      dateAddEnd: this.data.dateAddEnd || '',
    }).then(res => {
      if (res.code == 0) {
        _this.setData({
          cashlogs: res.data.result
        })
      }
    })
  },
  withDrawlogs() {
    const _this = this
    WXAPI.withDrawLogs({
      token: wx.getStorageSync('token'),
      page:1,
      pageSize:50
    }).then(res => {
      if (res.code == 0) {
        _this.setData({
          withDrawlogs: res.data
        })
      }
    })
  },
  depositlogs() {
    const _this = this
    WXAPI.depositList({
      token: wx.getStorageSync('token'),
      page:1,
      pageSize:50
    }).then(res => {
      if (res.code == 0) {
        _this.setData({
          depositlogs: res.data.result
        })
      }
    })
  },

  recharge: function (e) {
    wx.navigateTo({
      url: "/pages/recharge/index"
    })
  },
  withdraw: function (e) {
    wx.navigateTo({
      url: "/pages/withdraw/index"
    })
  },
  payDeposit: function (e) {
    wx.navigateTo({
      url: "/pages/deposit/pay"
    })
  },
  tabClick: function (e) {
    this.setData({
      activeIndex: e.detail.index
    });
    this.fetchTabData(e.detail.index)
  },
  cancelLogin(){
    wx.switchTab({
      url: '/pages/my/index'
    })
  },
  async confirmTX(e) {
    const item = e.currentTarget.dataset.item
    wx.showLoading({
      title: '',
    })
    const res = await WXAPI.wxpayRequestMerchantTransfer({
      token: wx.getStorageSync('token'),
      number: item.number
    })
    wx.hideLoading()
    if (res.code != 0) {
      wx.showToast({
        title: res.msg,
        icon: 'none'
      })
      return
    }
    wx.requestMerchantTransfer({
      mchId: res.data.mchId,
      appId: res.data.appId,
      package: res.data.package,
      openId: res.data.openId,
      success: res => {
        console.log(res);
        this.setData({
          activeIndex: 1
        });
        this.fetchTabData(1)
      },
      fail: res => {
        console.error(res);
      },
    })
  },
  dateAddBeginChange(e) {
    this.setData({
      dateAddBegin: e.detail.value
    })
    this.fetchTabData(0)
  },
  dateAddEndChange(e) {
    this.setData({
      dateAddEnd: e.detail.value
    })
    this.fetchTabData(0)
  },
})