const WXAPI = require('apifm-wxapi')
Page({
  data: {

  },
  onLoad: function (options) {

  },
  onShow: function () {

  },
  async submit() {
    if (!this.data.name) {
      wx.showToast({
        title: '请输入姓名',
        icon: 'none'
      })
      return
    }
    if (!this.data.idcard) {
      wx.showToast({
        title: '请输入身份证号码',
        icon: 'none'
      })
      return
    }
    wx.showLoading({
      title: '',
    })
    this.setData({
      loading: true
    })
    const res = await WXAPI.idcardCheck(wx.getStorageSync('token'), this.data.name, this.data.idcard)
    wx.hideLoading({
      success: (res) => {},
    })
    this.setData({
      loading: false
    })
    if (res.code != 0) {
      wx.showToast({
        title: res.msg,
        icon: 'none'
      })
      return
    }
    wx.showToast({
      title: '认证通过',
    })
    setTimeout(() => {
      wx.navigateBack()
    }, 1000);
  },
})