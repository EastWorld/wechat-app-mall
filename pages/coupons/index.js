const WXAPI = require('apifm-wxapi')
const AUTH = require('../../utils/auth')
Page({
  data: {
    tabs: ['可领', '已领', '失效', '口令'],
    activeIndex: 0,

    showPwdPop: false
  },
  onLoad(e) {

  },
  onShow() {
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
  tabClick: function (e) {
    this.setData({
      activeIndex: e.detail.index
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
  sysCoupons() { // 读取可领取券列表
    var _this = this;
    wx.showLoading({
      title: '',
    })
    WXAPI.coupons().then(function (res) {
      wx.hideLoading({
        success: (res) => {},
      })
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
  getCounpon(e) {
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
    }).then(res => {
      if (res.code == 2000) {
        wx.navigateTo({
            url: '/pages/login/index',
        })
        return
      }
      if (res.code == 20001 || res.code == 20002) {
        wx.showModal({
          content: '来晚了',
          showCancel: false
        })
        return;
      }
      if (res.code == 20003) {
        wx.showModal({
          content: '你领过了，别贪心哦~',
          showCancel: false
        })
        return;
      }
      if (res.code == 30001) {
        wx.showModal({
          content: '您的积分不足',
          showCancel: false
        })
        return;
      }
      if (res.code == 20004) {
        wx.showModal({
          content: '已过期~',
          showCancel: false
        })
        return;
      }
      if (res.code == 30002) {
        // 发起微信支付
        this.setData({
          money: res.data,
          paymentShow: true,
          nextAction: {
            // https://www.yuque.com/apifm/doc/aetmlb
            type: 7,
            couponRuleId: e.currentTarget.dataset.id
          }
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
          content: res.msg,
          showCancel: false
        })
      }
    })
  },
  getMyCoupons: function () {
    var _this = this;
    wx.showLoading({
      title: '',
    })
    WXAPI.myCoupons({
      token: wx.getStorageSync('token'),
      status: 0
    }).then(function (res) {
      wx.hideLoading({
        success: (res) => {},
      })
      if (res.code == 2000) {
        wx.navigateTo({
            url: '/pages/login/index',
        })
        return
      }
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
    wx.showLoading({
      title: '',
    })
    WXAPI.myCoupons({
      token: wx.getStorageSync('token'),
      status: '1,2,3'
    }).then(function (res) {
      wx.hideLoading({
        success: (res) => {},
      })
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
  async touse(e) {
    const item = e.currentTarget.dataset.item
    const res = await WXAPI.couponDetail(item.pid)
    if (res.code != 0) {
      wx.showToast({
        title: res.msg,
        icon: 'none'
      })
      return
    }
    if (!res.data.couponRefs || res.data.couponRefs.length == 0) {
      wx.switchTab({
        url: "/pages/index/index"
      })
      return
    }
    let categoryId, goodsId
    res.data.couponRefs.forEach(ele => {
      if (ele.type == 0) {
        if (categoryId) {
          categoryId = categoryId + ',' + ele.refId
        } else {
          categoryId = ele.refId
        }
      }
      if (ele.type == 1) {
        goodsId = ele.refId
      }
    })
    if (categoryId) {
      wx.navigateTo({
        url: '/pages/goods/list?categoryId=' + categoryId,
      })
      return
    }
    if (goodsId) {
      wx.navigateTo({
        url: '/pages/goods-details/index?id=' + goodsId,
      })
      return
    }
  },
  pwdCouponChange(e){
    this.setData({
      couponPwd: e.detail.value
    })
  },
  onPullDownRefresh() {
    if (this.data.activeIndex == 0) {
      this.sysCoupons()
    }
    if (this.data.activeIndex == 1) {
      this.getMyCoupons()
    }
    if (this.data.activeIndex == 2) {
      this.invalidCoupons()
    }
    wx.stopPullDownRefresh()
  },
  closePwd() {
    this.setData({
      showPwdPop: false
    })
  },
  async exchangeCoupons() {
    if (!this.data.number) {
      wx.showToast({
        title: '请输入券号',
        icon: 'none'
      })
      return
    }
    if (!this.data.pwd) {
      wx.showToast({
        title: '请输入密码',
        icon: 'none'
      })
      return
    }
    this.setData({
      exchangeCouponsLoading: true
    })
    wx.showLoading({
      title: '',
    })
    const res = await WXAPI.exchangeCoupons(wx.getStorageSync('token'), this.data.number, this.data.pwd)
    wx.hideLoading({
      success: (res) => {},
    })
    this.setData({
      exchangeCouponsLoading: false
    })
    if (res.code != 0) {
      wx.showToast({
        title: res.msg,
        icon: 'none'
      })
    } else {
      wx.showToast({
        title: '兑换成功'
      })
    }
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