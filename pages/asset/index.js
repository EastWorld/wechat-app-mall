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
    page: 1,
  },
  onLoad(e) {
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
  onPullDownRefresh() {
    this.data.page = 1
    this.fetchTabData(this.data.activeIndex)
    wx.stopPullDownRefresh()
  },
  onReachBottom() {
    this.data.page++
    this.fetchTabData(this.data.activeIndex)
  },
  async initData() {
    const token = wx.getStorageSync('token')
    const res = await WXAPI.userAmount(token)
    if (res.code == 700) {
      wx.showToast({
        title: '当前账户存在异常',
        icon: 'none'
      })
      return
    }
    if (res.code == 0) {
      this.setData({
        balance: res.data.balance.toFixed(2),
        freeze: res.data.freeze.toFixed(2),
        totleConsumed: res.data.totleConsumed.toFixed(2),
        score: res.data.score
      })
    }
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
  async cashLogs() {
    // https://www.yuque.com/apifm/nu0f75/khq7xu
    wx.showLoading({
      title: '',
    })
    const res = await WXAPI.cashLogsV3({
      token: wx.getStorageSync('token'),
      page: this.data.page,
      dateAddBegin: this.data.dateAddBegin || '',
      dateAddEnd: this.data.dateAddEnd || '',
    })
    wx.hideLoading()
    if (res.code == 0) {
      if (this.data.page == 1) {
        this.setData({
          cashlogs: res.data.result
        })
      } else {
        this.setData({
          cashlogs: this.data.cashlogs.concat(res.data.result)
        })
      }
    } else {
      if (this.data.page == 1) {
        this.setData({
          cashlogs: null
        })
      }
    }
  },
  async withDrawlogs() {
    // https://www.yuque.com/apifm/nu0f75/aw6qt6
    wx.showLoading({
      title: '',
    })
    const res = await WXAPI.withDrawLogsV2({
      token: wx.getStorageSync('token'),
      page: this.data.page
    })
    wx.hideLoading()
    if (res.code == 0) {
      if (this.data.page == 1) {
        this.setData({
          withDrawlogs: res.data.result
        })
      } else {
        this.setData({
          withDrawlogs: this.data.withDrawlogs.concat(res.data.result)
        })
      }
    } else {
      if (this.data.page == 1) {
        this.setData({
          withDrawlogs: null
        })
      }
    }
  },
  async depositlogs() {
    wx.showLoading({
      title: '',
    })
    // https://www.yuque.com/apifm/nu0f75/xd6g5h
    const res = await WXAPI.depositListV2({
      token: wx.getStorageSync('token'),
      page: this.data.page
    })
    wx.hideLoading()
    if (res.code == 0) {
      if (this.data.page == 1) {
        this.setData({
          depositlogs: res.data.result
        })
      } else {
        this.setData({
          depositlogs: this.data.depositlogs.concat(res.data.result)
        })
      }
    } else {
      if (this.data.page == 1) {
        this.setData({
          depositlogs: null
        })
      }
    }
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
    })
    this.data.page = 1
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
    const res = await WXAPI.wxpayRequestMerchantTransferV2({
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
  async payStatusDepositV2(e) {
    const item = e.currentTarget.dataset.item
    wx.showLoading({
      title: '',
    })
    // https://www.yuque.com/apifm/nu0f75/mpsdwi
    const res= await WXAPI.payStatusDepositV2({
      token: wx.getStorageSync('token'),
      id: item.id
    })
    wx.hideLoading()
    if (res.code == 40000) {
      // 余额不够
      this.setData({
        money: res.data,
        paymentShow: true,
        nextAction: {
          type: 5,
          amount: item.amount
        }
      })
      return
    } else if (res.code != 0) {
      wx.showToast({
        title: res.msg,
        icon: 'none'
      })
      return
    }
    wx.showModal({
      content: '支付成功',
      showCancel: false,
      success: (res) => {
        this.page = 1
        this.depositlogs()
      }
    })
  },
  async depositBackApplyV2(e) {
    const item = e.currentTarget.dataset.item
    wx.showModal({
      content: '确定要申请退回吗？',
      complete: async (res) => {
        if (res.confirm) {
          wx.showLoading({
            title: '',
          })
          // https://www.yuque.com/apifm/nu0f75/qx1f9u
          const res= await WXAPI.depositBackApplyV2(wx.getStorageSync('token'), item.id)
          wx.hideLoading()
          if (res.code != 0) {
            wx.showToast({
              title: res.msg,
            })
            return
          }
          wx.showModal({
            content: '已申请，等待管理员处理',
            showCancel: false,
            success: (res) => {
              this.page = 1
              this.depositlogs()
            }
          })
        }
      }
    })
  },
})