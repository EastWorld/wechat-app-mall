const app = getApp()
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
    const _this = this
    WXAPI.userDetail(wx.getStorageSync('token')).then(res => {
      if (res.code === 0) {
        _this.setData({
          userDetail: res.data
        })
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
    const name = e.detail.value.name
    const mobile = e.detail.value.mobile
    if (!name) {
      wx.showToast({
        title: '请输入真实姓名',
        icon: 'none'
      })
      return
    }
    if (!mobile) {
      wx.showToast({
        title: '请输入手机号码',
        icon: 'none'
      })
      return
    }
    WXAPI.fxApply(wx.getStorageSync('token'), name, mobile).then(res => {
      if (res.code != 0) {
        wx.showToast({
          title: res.msg,
          icon: 'none'
        })
        return
      }
      this.subcriptionTmplMsg(res.data)
      wx.navigateTo({
        url: "/pages/fx/apply-status"
      })
    })
  },
  subcriptionTmplMsg(applyObj){
    const postJsonString = {};
    postJsonString.keyword1 = {
      value: '申请成为分销商',
      color: '#173177'
    }
    postJsonString.keyword2 = {
      value: '未审核通过',
      color: '#173177'
    }
    postJsonString.keyword3 = {
      value: '感谢您的支持，再接再厉，继续努力',
      color: '#173177'
    }
    WXAPI.sendTempleMsg({
      module: 'saleDistributionApply',
      business_id: applyObj.id,
      trigger: 1, // 不通过
      postJsonString: JSON.stringify(postJsonString),
      template_id: 'VK39qeUvnQ7KkS7__8bSLHAmOoFD1gYJzCrZnLgGOVQ',
      type: 0,
      token: wx.getStorageSync('token'),
      url: 'pages/fx/apply-status'
    })
    postJsonString.keyword2 = {
      value: '通过',
      color: '#173177'
    }
    postJsonString.keyword3 = {
      value: '感谢您的支持，期待为您的事业增光添彩！',
      color: '#173177'
    }
    WXAPI.sendTempleMsg({
      module: 'saleDistributionApply',
      business_id: applyObj.id,
      trigger: 2, // 通过
      postJsonString: JSON.stringify(postJsonString),
      template_id: 'VK39qeUvnQ7KkS7__8bSLHAmOoFD1gYJzCrZnLgGOVQ',
      type: 0,
      token: wx.getStorageSync('token'),
      url: 'pages/fx/apply-status'
    })
  }
})