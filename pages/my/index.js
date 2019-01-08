const app = getApp()
const api = require('../../utils/request.js')
const CONFIG = require('../../config.js')
Page({
	data: {
    balance:0,
    freeze:0,
    score:0,
    score_sign_continuous:0
  },
	onLoad() {
    
	},	
  onShow() {
    let that = this;
    let userInfo = wx.getStorageSync('userInfo')
    if (!userInfo) {
      app.goLoginPageTimeOut()
    } else {
      that.setData({
        userInfo: userInfo,
        version: CONFIG.version
      })
    }
    this.getUserApiInfo();
    this.getUserAmount();
    this.checkScoreSign();
  },
  aboutUs : function () {
    wx.showModal({
      title: '关于我们',
      content: '本系统基于开源小程序商城系统 https://github.com/EastWorld/wechat-app-mall 搭建，祝大家使用愉快！',
      showCancel:false
    })
  },
  getPhoneNumber: function(e) {
    if (!e.detail.errMsg || e.detail.errMsg != "getPhoneNumber:ok") {
      wx.showModal({
        title: '提示',
        content: '无法获取手机号码',
        showCancel: false
      })
      return;
    }
    var that = this;
    api.fetchRequest('/user/wxapp/bindMobile', {
      token: wx.getStorageSync('token'),
      encryptedData: e.detail.encryptedData,
      iv: e.detail.iv
    }).then(function (res) {
      if (res.data.code == 0) {
        wx.showToast({
          title: '绑定成功',
          icon: 'success',
          duration: 2000
        })
        that.getUserApiInfo();
      } else {
        wx.showModal({
          title: '提示',
          content: '绑定失败',
          showCancel: false
        })
      }
    })
  },
  getUserApiInfo: function () {
    var that = this;
    api.fetchRequest('/user/detail', {
      token: wx.getStorageSync('token'),
    }).then(function (res) {
      if (res.data.code == 0) {
        let _data = {}
        _data.apiUserInfoMap = res.data.data
        if (res.data.data.base.mobile) {
          _data.userMobile = res.data.data.base.mobile
        }
        that.setData(_data);
      }
    })
  },
  getUserAmount: function () {
    var that = this;
    api.fetchRequest('/user/amount', {
      token: wx.getStorageSync('token'),
    }).then(function (res) {
      if (res.data.code == 0) {
        that.setData({
          balance: res.data.data.balance,
          freeze: res.data.data.freeze,
          score: res.data.data.score
        });
      }
    })
  },
  checkScoreSign: function () {
    var that = this;
    api.fetchRequest('/score/today-signed', {
      token: wx.getStorageSync('token'),
    }).then(function (res) {
      if (res.data.code == 0) {
        that.setData({
          score_sign_continuous: res.data.data.continuous
        });
      }
    })
  },
  scoresign: function () {
    var that = this;
    api.fetchRequest('/score/sign', {
      token: wx.getStorageSync('token'),
    }).then(function (res) {
      if (res.data.code == 0) {
        that.getUserAmount();
        that.checkScoreSign();
      } else {
        wx.showModal({
          title: '错误',
          content: res.data.msg,
          showCancel: false
        })
      }
    })
  },
  relogin:function(){
    app.goLoginPageTimeOut()
  },
  recharge: function () {
    wx.navigateTo({
      url: "/pages/recharge/index"
    })
  },
  withdraw: function () {
    wx.navigateTo({
      url: "/pages/withdraw/index"
    })
  }
})