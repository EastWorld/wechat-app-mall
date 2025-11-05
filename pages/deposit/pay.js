const WXAPI = require('apifm-wxapi')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },
  onShow: function () {

  },
  async bindSave(e) {
    const amount = this.data.amount
    if (!amount) {
      wx.showToast({
        title: '请填写正确的押金金额',
        icon: 'none'
      })
      return
    }
    wx.showLoading({
      title: '',
    })
    // https://www.yuque.com/apifm/nu0f75/mpsdwi
    const res= await WXAPI.payDepositV2({
      token: wx.getStorageSync('token'),
      amount
    })
    wx.hideLoading()
    if (res.code == 40000) {
      // 余额不够
      this.setData({
        money: res.data,
        paymentShow: true,
        nextAction: {
          type: 5,
          amount
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
        wx.redirectTo({
          url: "/pages/asset/index"
        })
      }
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
