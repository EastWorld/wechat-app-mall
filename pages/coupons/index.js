const WXAPI = require('apifm-wxapi')
const AUTH = require('../../utils/auth')

var sliderWidth = 96; // 需要设置slider的宽度，用于计算中间位置
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs: ["可领券", "已领券", "已失效"],
    activeIndex: 0,

    showPwdPop: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (e) {

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
    if (this.data.activeIndex == 0) {
      this.sysCoupons()
    }
    AUTH.checkHasLogined().then(isLogined => {
      if (isLogined) {
        if (this.data.activeIndex == 1) {
          this.getMyCoupons()
        }
        if (this.data.activeIndex == 2) {
          this.invalidCoupons()
        }
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
  tabClick: function (e) {
    this.setData({
      activeIndex: e.currentTarget.dataset.id
    });
    if (this.data.activeIndex == 0) {
      this.sysCoupons()
    }
    if (this.data.activeIndex == 1) {
      this.getMyCoupons()
    }
    if (this.data.activeIndex == 2) {
      this.invalidCoupons()
    }
  },
  sysCoupons: function () { // 读取可领取券列表
    var _this = this;
    WXAPI.coupons().then(function (res) {
      if (res.code == 0) {
        _this.setData({
          coupons: res.data
        });
      } else {
        _this.setData({
          coupons: null
        });
      }
    })
  },
  getCounpon2(){
    if (!this.data.couponPwd) {
      wx.showToast({
        title: '请输入口令',
        icon: 'none'
      })
      return
    }
    const e = {
      kl: true,
      currentTarget: {
        dataset: {
          id: this.data.pwdCounponId
        }
      }
    }
    this.getCounpon(e)
  },
  getCounpon: function (e) {
    const that = this
    if (e.currentTarget.dataset.pwd) {
      this.setData({
        pwdCounponId: e.currentTarget.dataset.id,
        showPwdPop: true
      })
      return
    } else {
      if (!e.kl) {
        this.data.couponPwd = ''
      }
    }
    this.setData({
      showPwdPop: false
    })
    WXAPI.fetchCoupons({
      id: e.currentTarget.dataset.id,
      token: wx.getStorageSync('token'),
      pwd: this.data.couponPwd
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
          title: '领取成功',
          icon: 'success'
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
        res.data.forEach(ele => {
          if (ele.dateEnd) {
            ele.dateEnd = ele.dateEnd.split(" ")[0]
          }
        })
        _this.setData({
          coupons: res.data
        })
      } else {
        _this.setData({
          coupons: null
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
          coupons: res.data
        })
      } else {
        _this.setData({
          coupons: null
        })
      }
    })
  },
  toIndexPage: function () {
    wx.switchTab({
      url: "/pages/index/index"
    });
  },
  pwdCouponChange(e){
    this.setData({
      couponPwd: e.detail.value
    })
  },
})