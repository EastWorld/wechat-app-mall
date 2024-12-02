const WXAPI = require('apifm-wxapi')
const AUTH = require('../../utils/auth')
const CONFIG = require('../../config.js')
Page({
  data: {
    payType: 'wxpay'
  },
  onLoad: function (options) {
    this.payBillDiscounts()
    this.setData({
      balance_pay_pwd: wx.getStorageSync('balance_pay_pwd')
    })
  },
  onShow () {
    AUTH.checkHasLogined().then(isLogined => {
      if (!isLogined) {
        AUTH.login(this)
      } else {
        this.userAmount()
      }
    })    
  },
  async payBillDiscounts() {
    const res = await WXAPI.payBillDiscounts()
    if (res.code === 0) {
      this.setData({
        rechargeSendRules: res.data
      })
    }
  },
  async userAmount() {
    const res = await WXAPI.userAmount(wx.getStorageSync('token'))
    if (res.code === 0) {
      this.setData({
        balance: res.data.balance
      })
    }
  },
  async bindSave() {
    const amount = this.data.amount;
    if (!amount) {
      wx.showToast({
        title: '请填写正确的消费金额',
        icon: 'none'
      })
      return
    }
    if (this.data.payType == 'balance') {
      if (this.data.balance_pay_pwd == '1' && !this.data.pwd) {
        wx.showToast({
          title: '请输入交易密码',
          icon: 'none'
        })
        return
      }
    }
    // 判断是否需要绑定手机号码
    // https://www.yuque.com/apifm/nu0f75/zgf8pu
    if (CONFIG.needBindMobile) {
      const resUserDetail = await WXAPI.userDetail(wx.getStorageSync('token'))
      if (resUserDetail.code == 0 && !resUserDetail.data.base.mobile) {
        this.setData({
          bindMobileShow: true
        })
        return
      }
    }
    const res = await WXAPI.payBillV2({
      token: wx.getStorageSync('token'),
      money: amount,
      calculate: true
    })
    if (res.code != 0) {
      wx.showToast({
        title: res.msg,
        icon: 'none'
      })
      return
    }
    const amountReal = res.data.realMoney
    const _msg = `您本次消费${amount}，优惠后只需支付${amountReal}`
    
    wx.showModal({
      title: '请确认消费金额',
      content: _msg,
      confirmText: "确认支付",
      cancelText: "取消支付",
      success: res => {
        if (res.confirm) {
          this.goPay(amount, amountReal)
        }
      }
    });
  },
  async goPay(amount, wxpayAmount){
    if (this.data.payType == 'balance') {
      const res = await WXAPI.payBillV2({
        token: wx.getStorageSync('token'),
        money: amount,
        pwd: this.data.pwd
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
        content: '买单成功，欢迎下次光临！',
        showCancel: false
      })
    } else {
      this.setData({
        money: wxpayAmount,
        paymentShow: true,
        nextAction: {
          type: 4,
          uid: wx.getStorageSync('uid'),
          money: amount
        }
      })
    }
  },
  payTypeChange(event) {
    this.setData({
      payType: event.detail,
    });
  },
  payTypeClick(event) {
    const { name } = event.currentTarget.dataset;
    this.setData({
      payType: name,
    });
  },
  bindMobileOk(e) {
    console.log(e.detail); // 这里是组件里data的数据
    this.setData({
      bindMobileShow: false
    })
  },
  bindMobileCancel() {
    this.setData({
      bindMobileShow: false
    })
  },
  paymentOk(e) {
    console.log(e.detail); // 这里是组件里data的数据
    this.setData({
      paymentShow: false
    })
    wx.redirectTo({
      url: '/pages/asset/index',
    })
  },
  paymentCancel() {
    this.setData({
      paymentShow: false
    })
  },
})