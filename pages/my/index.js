const WXAPI = require('apifm-wxapi')
const AUTH = require('../../utils/auth')
const TOOLS = require('../../utils/tools.js')

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

    // 判断有没有用户详细资料
    userInfoStatus: 0 // 0 未读取 1 没有详细信息 2 有详细信息
  },
	onLoad() {
    this.readConfigVal()
    // 补偿写法
    getApp().configLoadOK = () => {
      this.readConfigVal()
    }
	},
  onShow() {
    const _this = this
    AUTH.checkHasLogined().then(isLogined => {
      if (isLogined) {
        _this.getUserApiInfo();
        _this.getUserAmount();
        _this.orderStatistics();
        _this.cardMyList();
        TOOLS.showTabBarBadge();
      } else {
        AUTH.authorize().then(res => {
          AUTH.bindSeller()
          _this.getUserApiInfo();
          _this.getUserAmount();
          _this.orderStatistics();
          _this.cardMyList();
          TOOLS.showTabBarBadge();
        })
      }
    })
    AUTH.wxaCode().then(code => {
      this.data.code = code
    })
  },
  readConfigVal() {
    this.setData({
      order_hx_uids: wx.getStorageSync('order_hx_uids'),
      cps_open: wx.getStorageSync('cps_open'),
      recycle_open: wx.getStorageSync('recycle_open'),
      show_3_seller: wx.getStorageSync('show_3_seller'),
      show_quan_exchange_score: wx.getStorageSync('show_quan_exchange_score'),
      show_score_exchange_growth: wx.getStorageSync('show_score_exchange_growth'),
      show_score_sign: wx.getStorageSync('show_score_sign'),
    })
  },
  async getUserApiInfo() {
    const res = await WXAPI.userDetail(wx.getStorageSync('token'))
    if (res.code == 0) {
      let _data = {}
      _data.apiUserInfoMap = res.data
      if (res.data.base.mobile) {
        _data.userMobile = res.data.base.mobile
      }
      if (res.data.base.nick && res.data.base.avatarUrl) {
        _data.userInfoStatus = 2
      } else {
        _data.userInfoStatus = 1
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
  updateUserInfo(e) {
    wx.getUserProfile({
      lang: 'zh_CN',
      desc: '用于完善会员资料',
      success: res => {
        console.log(res);
        this._updateUserInfo(res.userInfo)
      },
      fail: err => {
        console.log(err);
        wx.showToast({
          title: err.errMsg,
          icon: 'none'
        })
      }
    })
  },
  async _updateUserInfo(userInfo) {
    const postData = {
      token: wx.getStorageSync('token'),
      nick: userInfo.nickName,
      avatarUrl: userInfo.avatarUrl,
      city: userInfo.city,
      province: userInfo.province,
      gender: userInfo.gender,
    }
    const res = await WXAPI.modifyUserInfo(postData)
    if (res.code != 0) {
      wx.showToast({
        title: res.msg,
        icon: 'none'
      })
      return
    }
    wx.showToast({
      title: '登陆成功',
    })
    this.getUserApiInfo()
  },
  gogrowth() {
    wx.navigateTo({
      url: '/pages/score/growth',
    })
  },
  async cardMyList() {
    const res = await WXAPI.cardMyList(wx.getStorageSync('token'))
    if (res.code == 0) {
      const myCards = res.data.filter(ele => { return ele.status == 0 })
      if (myCards.length > 0) {
        this.setData({
          myCards: res.data
        })
      }
    }
  },
})