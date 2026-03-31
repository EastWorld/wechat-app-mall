const WXAPI = require('apifm-wxapi')
const AUTH = require('../../utils/auth')

Page({
  data: {
    levelId: 0,
    levelDetail: null,
    extJsonKeys: [],
    priceList: [],
    selectedPrice: null,
    userBalance: 0,
    paymentShow: false,
    money: 0,
    nextAction: null,
    successShow: false,
    successBenefits: []
  },

  onLoad(options) {
    if (options.id) {
      this.setData({ levelId: options.id })
      this.loadData()
    }
  },

  async loadData() {
    wx.showLoading({ title: '加载中...' })
    await Promise.all([
      this.getLevelDetail(),
      this.getPriceList(),
      this.getUserBalance()
    ])
    wx.hideLoading()
  },

  async getLevelDetail() {
    const res = await WXAPI.userLevelDetail(this.data.levelId)
    if (res.code === 0) {
      const extJsonKeys = []
      if (res.data.extJson && typeof res.data.extJson === 'object') {
        Object.keys(res.data.extJson).forEach(key => {
          extJsonKeys.push({
            key: key,
            value: res.data.extJson[key]
          })
        })
      }
      this.setData({
        levelDetail: res.data,
        extJsonKeys
      })
    } else {
      wx.showToast({
        title: res.msg || '加载失败',
        icon: 'none'
      })
      setTimeout(() => {
        wx.navigateBack()
      }, 1500)
    }
  },

  async getPriceList() {
    const res = await WXAPI.userLevelPrices(this.data.levelId)
    if (res.code === 0) {
      const list = res.data || []
      if (list.length === 0) {
        wx.showToast({
          title: '该等级暂无可购买项目',
          icon: 'none'
        })
      }
      this.setData({
        priceList: list,
        selectedPrice: list.length > 0 ? list[0] : null
      })
    }
  },

  async getUserBalance() {
    const res = await WXAPI.userAmountV2(wx.getStorageSync('token'))
    if (res.code === 0) {
      this.setData({
        userBalance: res.data.balance || 0
      })
    }
  },

  selectPrice(e) {
    const { item } = e.currentTarget.dataset
    this.setData({
      selectedPrice: item
    })
  },

  async handleBuy() {
    if (!this.data.selectedPrice) {
      wx.showToast({
        title: '请选择购买时长',
        icon: 'none'
      })
      return
    }

    const price = this.data.selectedPrice.price
    const balance = this.data.userBalance

    if (balance >= price) {
      // 余额充足，使用余额购买
      this.buyWithBalance()
    } else {
      // 余额不足，使用在线支付
      this.buyWithOnlinePay(price, balance)
    }
  },

  buyWithBalance() {
    const price = this.data.selectedPrice.price
    const balance = this.data.userBalance

    wx.showModal({
      title: '确认购买',
      content: `当前余额：¥${balance}\n需支付：¥${price}\n确认使用余额购买？`,
      confirmText: '确认购买',
      success: async (res) => {
        if (res.confirm) {
          wx.showLoading({ title: '购买中...' })
          const result = await WXAPI.userLevelBuy(
            wx.getStorageSync('token'),
            this.data.selectedPrice.id,
            false
          )
          wx.hideLoading()

          if (result.code === 0) {
            this.showSuccessModal()
          } else {
            wx.showToast({
              title: result.msg || '购买失败',
              icon: 'none'
            })
          }
        }
      }
    })
  },

  buyWithOnlinePay(price, balance) {
    const needPay = (price - balance).toFixed(2)
    
    wx.showModal({
      title: '余额不足',
      content: `当前余额：¥${balance}\n需支付：¥${price}\n还需支付：¥${needPay}\n是否继续支付？`,
      confirmText: '去支付',
      success: (res) => {
        if (res.confirm) {
          // 拉起支付组件
          this.setData({
            money: needPay,
            paymentShow: true,
            nextAction: {
              type: 6,
              userLevelPriceId: this.data.selectedPrice.id,
              isAutoRenew: false
            }
          })
        }
      }
    })
  },

  showSuccessModal() {
    const benefits = []
    const info = this.data.levelDetail.info
    
    if (info.rebate < 10) {
      benefits.push(`${info.rebate}折优惠`)
    }
    if (info.upgradeSendScore > 0) {
      benefits.push(`赠送${info.upgradeSendScore}积分`)
    }
    if (info.sendPerMonthScore > 0) {
      benefits.push(`每月${info.sendPerMonthScore}积分`)
    }
    if (info.sendPerMonthCoupons) {
      benefits.push('专享优惠券')
    }

    this.setData({
      successShow: true,
      successBenefits: benefits
    })
  },

  handleSuccessConfirm() {
    this.setData({
      successShow: false
    })
    wx.navigateBack()
  },

  paymentOk(e) {
    console.log('支付成功', e.detail)
    this.setData({
      paymentShow: false
    })
    this.showSuccessModal()
  },

  paymentCancel() {
    this.setData({
      paymentShow: false
    })
  }
})
