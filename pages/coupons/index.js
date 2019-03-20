const WXAPI = require('../../wxapi/main')

var sliderWidth = 96; // 需要设置slider的宽度，用于计算中间位置
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs: ["可领券", "已领券", "已失效"],
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0,

    couponInput: '', // 输入的优惠券码
    sysCoupons: [], //可领取的优惠券列表
    myCoupons: [], //已领取的可用优惠券列表
    invalidCoupons: [] //已失效的优惠券
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          sliderLeft: (res.windowWidth / that.data.tabs.length - sliderWidth) / 2,
          sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex
        });
      }
    });
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
    this.sysCoupons()
    this.getMyCoupons()
    this.invalidCoupons()
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
  tabClick: function (e) {
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    });
  },
  getCounponByPwd(e){ // 通过优惠码领取优惠券
    WXAPI.addTempleMsgFormid({
      token: wx.getStorageSync('token'),
      type: 'form',
      formId: e.detail.formId
    })
    const _this = this;
    const pwd = e.detail.value.pwd;
    if(!pwd){
      wx.showToast({
        title: '请输入优惠码',
        icon: 'none'
      })
      return
    }
    WXAPI.fetchCoupons({
      pwd: pwd,
      token: wx.getStorageSync('token')
    }).then(function (res) {
      if (res.code == 20001 || res.code == 20002) {
        wx.showToast({
          title: '您来晚了',
          icon: 'none'
        })
        return;
      }
      if (res.code == 20003) {
        wx.showToast({
          title: '你领过了，别贪心哦~',
          icon: 'none'
        })
        return;
      }
      if (res.code == 30001) {
        wx.showToast({
          title: '您的积分不足',
          icon: 'none'
        })
        return;
      }
      if (res.code == 20004) {
        wx.showToast({
          title: '已过期~',
          icon: 'none'
        })
        return;
      }
      if (res.code == 700) {
        wx.showToast({
          title: '优惠码不存在',
          icon: 'none'
        })
        return;
      }
      if (res.code == 0) {
        wx.showModal({
          title: '成功',
          content: '您已成功领取优惠券，赶快去下单使用吧！',
          showCancel: false
        })
        _this.setData({
          couponInput: ''
        })
      } else {
        wx.showToast({
          title: res.msg,
          icon: 'none'
        })
      }
    })
  },
  sysCoupons: function () { // 读取可领取券列表
    var _this = this;
    WXAPI.coupons().then(function (res) {
      if (res.code == 0) {
        _this.setData({
          sysCoupons: res.data
        });
      }
    })
  },
  getCounpon: function (e) {
    const that = this
    if (e.currentTarget.dataset.pwd) {
      wx.showToast({
        title: '请通过优惠券码兑换',
        icon: 'none'
      })
      return
    }
    WXAPI.fetchCoupons({
      id: e.currentTarget.dataset.id,
      token: wx.getStorageSync('token')
    }).then(function (res) {
      if (res.code == 20001 || res.code == 20002) {
        wx.showModal({
          title: '错误',
          content: '来晚了',
          showCancel: false
        })
        return;
      }
      if (res.code == 20003) {
        wx.showModal({
          title: '错误',
          content: '你领过了，别贪心哦~',
          showCancel: false
        })
        return;
      }
      if (res.code == 30001) {
        wx.showModal({
          title: '错误',
          content: '您的积分不足',
          showCancel: false
        })
        return;
      }
      if (res.code == 20004) {
        wx.showModal({
          title: '错误',
          content: '已过期~',
          showCancel: false
        })
        return;
      }
      if (res.code == 0) {
        wx.showToast({
          title: '领取成功，赶紧去下单吧~',
          icon: 'success',
          duration: 2000
        })
      } else {
        wx.showModal({
          title: '错误',
          content: res.msg,
          showCancel: false
        })
      }
    })
  },
  getMyCoupons: function () {
    var _this = this;
    WXAPI.myCoupons({
      token: wx.getStorageSync('token'),
      status: 0
    }).then(function (res) {
      if (res.code == 0) {
        _this.setData({
          myCoupons: res.data
        })
      }
    })
  },
  invalidCoupons: function () {
    var _this = this;
    WXAPI.myCoupons({
      token: wx.getStorageSync('token'),
      status: '1,2,3'
    }).then(function (res) {
      if (res.code == 0) {
        _this.setData({
          invalidCoupons: res.data
        })
      }
    })
  },
})