const wxpay = require('../../utils/pay.js')
const WXAPI = require('../../wxapi/main')
import drawQrcode from '../../utils/weapp.qrcode.min.js'
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    uid: undefined,
    showalipay: false,
    rechargeSendRules: undefined
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let recharge_amount_min = app.globalData.recharge_amount_min;
    if (!recharge_amount_min) {
      recharge_amount_min = 0;
    }
    this.setData({
      uid: wx.getStorageSync('uid'),
      recharge_amount_min: recharge_amount_min
    });
  },

  /**
     * 点击充值优惠的充值送
     */
  rechargeAmount: function (e) {
    var confine = e.currentTarget.dataset.confine;
    var amount = confine;
    this.setData({
      amount: amount
    });
    wxpay.wxpay(app, amount, 0, "/pages/my/index");
  },


  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    const _this = this
    WXAPI.rechargeSendRules().then(res => {
      if (res.code === 0) {
        _this.setData({
          rechargeSendRules: res.data
        });
      }
    })

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  bindSave: function (e) {
    WXAPI.addTempleMsgFormid({
      token: wx.getStorageSync('token'),
      type: 'form',
      formId: e.detail.formId
    })
    var that = this;
    var amount = e.detail.value.amount;

    if (amount == "" || amount * 1 < 0) {
      wx.showModal({
        title: '错误',
        content: '请填写正确的充值金额',
        showCancel: false
      })
      return
    }
    if (amount * 1 < that.data.recharge_amount_min * 1) {
      wx.showModal({
        title: '错误',
        content: '单次充值金额至少' + that.data.recharge_amount_min + '元',
        showCancel: false
      })
      return
    }
    that.setData({
      showalipay: e.detail.value.type == 'alipay'
    })
    if (e.detail.value.type == 'wx') {
      // 微信充值
      wxpay.wxpay(app, amount, 0, "/pages/my/index");
    } else {
      // 支付宝充值
      WXAPI.alipay({
        token: wx.getStorageSync('token'),
        money: amount
      }, 'post').then(res => {
        if (res.code != 0) {
          wx.showModal({
            title: '错误',
            content: res.msg,
            showCancel: false
          })
          return
        }
        drawQrcode({
          width: 200,
          height: 200,
          canvasId: 'myQrcode',
          text: res.data,
          _this: that
        })
      })
    }
  },
  saveToMobile: function () {
    wx.canvasToTempFilePath({
      canvasId: 'myQrcode',
      success: function (res) {
        let tempFilePath = res.tempFilePath
        wx.saveImageToPhotosAlbum({
          filePath: tempFilePath,
          success: (res) => {
            wx.showModal({
              content: '已保存到手机相册',
              showCancel: false,
              confirmText: '知道了',
              confirmColor: '#333'
            })
          },
          fail: (res) => {
            wx.showToast({
              title: res.errMsg,
              icon: 'none',
              duration: 2000
            })
          }
        })
      }
    })
  }
})
