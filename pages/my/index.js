const CONFIG = require('../../config.js')
const WXAPI = require('apifm-wxapi')
const AUTH = require('../../utils/auth')
const TOOLS = require('../../utils/tools.js')

const APP = getApp()
// fixed首次打开不显示标题的bug
APP.configLoadOK = () => {
  
}

Page({
	data: {
    balance:0.00,
    freeze:0,
    score:0,
    growth:0,
    score_sign_continuous:0,
    rechargeOpen: false, // 是否开启充值[预存]功能

    // 用户订单统计数据
    count_id_no_confirm: 0,
    count_id_no_pay: 0,
    count_id_no_reputation: 0,
    count_id_no_transfer: 0,
  },
	onLoad() {
	},
  onShow() {
    const _this = this
    const order_hx_uids = wx.getStorageSync('order_hx_uids')
    this.setData({
      version: CONFIG.version,
      order_hx_uids
    })
    AUTH.checkHasLogined().then(isLogined => {
      if (isLogined) {
        _this.getUserApiInfo();
        _this.getUserAmount();
        _this.orderStatistics();
      } else {
        AUTH.openLoginDialog()
      }
    })
    AUTH.wxaCode().then(code => {
      this.data.code = code
    })
    // 获取购物车数据，显示TabBarBadge
    TOOLS.showTabBarBadge();
  },
  async getUserApiInfo() {
    const res = await WXAPI.userDetail(wx.getStorageSync('token'))
    if (res.code == 0) {
      let _data = {}
      _data.apiUserInfoMap = res.data
      if (res.data.base.mobile) {
        _data.userMobile = res.data.base.mobile
      }
      if (this.data.order_hx_uids && this.data.order_hx_uids.indexOf(res.data.base.id) != -1) {
        _data.canHX = true // 具有扫码核销的权限
      }
      const adminUserIds = wx.getStorageSync('adminUserIds')
      if (adminUserIds && adminUserIds.indexOf(res.data.base.id) != -1) {
        _data.isAdmin = true
      }
      if (res.data.peisongMember && res.data.peisongMember.status == 1) {
        _data.memberChecked = false
      } else {
        _data.memberChecked = true
      }
      this.setData(_data);
    }
  },
  async memberCheckedChange() {
    const res = await WXAPI.peisongMemberChangeWorkStatus(wx.getStorageSync('token'))
    if (res.code != 0) {
      wx.showToast({
        title: res.msg,
        icon: 'none'
      })
    } else {
      this.getUserApiInfo()
    }
  },
  getUserAmount: function () {
    var that = this;
    WXAPI.userAmount(wx.getStorageSync('token')).then(function (res) {
      if (res.code == 0) {
        that.setData({
          balance: res.data.balance.toFixed(2),
          freeze: res.data.freeze.toFixed(2),
          score: res.data.score,
          growth: res.data.growth
        });
      }
    })
  },
  handleOrderCount: function (count) {
    return count > 99 ? '99+' : count;
  },
  orderStatistics: function () {
    WXAPI.orderStatistics(wx.getStorageSync('token')).then((res) => {
      if (res.code == 0) {
        const {
          count_id_no_confirm,
          count_id_no_pay,
          count_id_no_reputation,
          count_id_no_transfer,
        } = res.data || {}
        this.setData({
          count_id_no_confirm: this.handleOrderCount(count_id_no_confirm),
          count_id_no_pay: this.handleOrderCount(count_id_no_pay),
          count_id_no_reputation: this.handleOrderCount(count_id_no_reputation),
          count_id_no_transfer: this.handleOrderCount(count_id_no_transfer),
        })
      }
    })
  },
  goAsset: function () {
    wx.navigateTo({
      url: "/pages/asset/index"
    })
  },
  goScore: function () {
    wx.navigateTo({
      url: "/pages/score/index"
    })
  },
  goOrder: function (e) {
    wx.navigateTo({
      url: "/pages/order-list/index?type=" + e.currentTarget.dataset.type
    })
  },
  goLogin() {
    AUTH.openLoginDialog()
  },
  processLogin(e) {
    if (!e.detail.userInfo) {
      wx.showToast({
        title: '已取消',
        icon: 'none',
      })
      return;
    }
    AUTH.register(this);
  },
  scanOrderCode(){
    wx.scanCode({
      onlyFromCamera: true,
      success(res) {
        wx.navigateTo({
          url: '/pages/order-details/scan-result?hxNumber=' + res.result,
        })
      },
      fail(err) {
        console.error(err)
        wx.showToast({
          title: err.errMsg,
          icon: 'none'
        })
      }
    })
  },
  
  goadmin() {
    wx.navigateToMiniProgram({
      appId: 'wx5e5b0066c8d3f33d',
      path: 'pages/login/auto?token=' + wx.getStorageSync('token'),
      envVersion: 'trial' // develop trial release
    })
  }
})