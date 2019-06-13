const regeneratorRuntime = require('../../utils/runtime')
const WXAPI = require('../../wxapi/main')
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

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

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
    return {
      title: '点击进入小程序申请开票',
      imageUrl: 'https://cdn.it120.cc/apifactory/2019/06/13/13f5f43c-4819-414d-88f5-968e32facd79.png',
      path: '/pages/invoice/apply?inviter_id=' + wx.getStorageSync('uid')
    }
  },
  async bindSave(e) {
    // 提交保存
    WXAPI.addTempleMsgFormid({
      token: wx.getStorageSync('token'),
      type: 'form',
      formId: e.detail.formId
    })
    const _this = this;
    let comName = e.detail.value.comName;
    let tfn = e.detail.value.tfn;
    let mobile = e.detail.value.mobile;
    let amount = e.detail.value.amount;
    let consumption = e.detail.value.consumption;
    let remark = e.detail.value.remark;
    if (!comName) {
      wx.showToast({
        title: '公司名称不能为空',
        icon: 'none'
      })
      return
    }
    if (!tfn) {
      wx.showToast({
        title: '税号不能为空',
        icon: 'none'
      })
      return
    }
    if (!consumption) {
      wx.showToast({
        title: '发票内容不能为空',
        icon: 'none'
      })
      return
    }
    if (!mobile) {
      wx.showToast({
        title: '请填写您在工厂注册的手机号码',
        icon: 'none'
      })
      return
    }
    if (!remark) {
      wx.showToast({
        title: '快递地址不能为空',
        icon: 'none'
      })
      return
    }
    if (!amount || amount*1 < 100) {
      wx.showToast({
        title: '开票金额不能低于100',
        icon: 'none'
      })
      return
    }
    const extJsonStr = {}
    extJsonStr['手机号码'] = mobile
    WXAPI.invoiceApply({
      token: wx.getStorageSync('token'),
      comName,
      tfn,
      amount,
      consumption,
      remark,
      extJsonStr: JSON.stringify(extJsonStr)
    }).then(res => {
      if (res.code == 0) {
        wx.showModal({
          title: '成功',
          content: '提交成功，请耐心等待我们处理！',
          showCancel: false,
          confirmText: '我知道了',
          success(res) {
            wx.navigateTo({
              url: "/pages/invoice/list"
            })
          }
        })
      } else {
        wx.showModal({
          title: '失败',
          content: res.msg,
          showCancel: false,
          confirmText: '我知道了'
        })
      }
    })
  }
})