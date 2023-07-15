const WXAPI = require('apifm-wxapi')
const AUTH = require('../../utils/auth')
const CONFIG = require('../../config.js')

Page({
  data: {
    
  },
  onLoad: function (e) {
    // e.hxNumber = '2307150981053363'
    // 读取小程序码中的核销码
    console.log('e', e);
    if (e && e.scene) {
      const scene = decodeURIComponent(e.scene)
      if (scene) {
        e.hxNumber = scene
      }
    }
    this.readConfigVal()
    // 补偿写法
    getApp().configLoadOK = () => {
      this.readConfigVal()
    }
    this.setData({
      hxNumber: e.hxNumber
    });
  },
  onShow: function () {
    this.orderDetail()
  },
  readConfigVal() {
    const order_hx_uids = wx.getStorageSync('order_hx_uids')
    const uid = wx.getStorageSync('uid')
    if (!order_hx_uids || !uid) {
      return
    }
    if (order_hx_uids.indexOf(uid) != -1) {
      this.setData({
        canHX: true
      })
    }
  },
  async orderDetail() {
    wx.showLoading({
      title: '',
    })
    const isLogined = await AUTH.checkHasLogined()
    if (!isLogined) {
      await AUTH.authorize()
      if (CONFIG.bindSeller) {
        AUTH.bindSeller()
      }
    }
    const res = await WXAPI.orderDetail(wx.getStorageSync('token'), '', this.data.hxNumber)
    wx.hideLoading()
    if (res.code != 0) {
      wx.showModal({
        content: res.msg,
        showCancel: false
      })
      return;
    }
    this.setData({
      orderDetail: res.data
    })
    this.readConfigVal()
  },
  wuliuDetailsTap: function (e) {
    var orderId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: "/pages/wuliu/index?id=" + orderId
    })
  },
  confirmBtnTap: function (e) {
    let that = this;
    let orderId = this.data.orderId;
    wx.showModal({
      title: '确认您已收到商品？',
      content: '',
      success: function (res) {
        if (res.confirm) {
          WXAPI.orderDelivery(wx.getStorageSync('token'), orderId).then(function (res) {
            if (res.code == 0) {
              that.onShow();
            }
          })
        }
      }
    })
  },
  submitReputation: function (e) {
    let that = this;
    let postJsonString = {};
    postJsonString.token = wx.getStorageSync('token');
    postJsonString.orderId = this.data.orderId;
    let reputations = [];
    let i = 0;
    while (e.detail.value["orderGoodsId" + i]) {
      let orderGoodsId = e.detail.value["orderGoodsId" + i];
      let goodReputation = e.detail.value["goodReputation" + i];
      let goodReputationRemark = e.detail.value["goodReputationRemark" + i];

      let reputations_json = {};
      reputations_json.id = orderGoodsId;
      reputations_json.reputation = goodReputation;
      reputations_json.remark = goodReputationRemark;

      reputations.push(reputations_json);
      i++;
    }
    postJsonString.reputations = reputations;
    WXAPI.orderReputation({
      postJsonString: JSON.stringify(postJsonString)
    }).then(function (res) {
      if (res.code == 0) {
        that.onShow();
      }
    })
  },
  async doneHx(){
    wx.showLoading({
      title: '处理中...',
    })
    const res = await WXAPI.orderHXV2({
      token: wx.getStorageSync('token'),
      hxNumber: this.data.hxNumber
    })
    wx.hideLoading()
    if (res.code != 0) {
      wx.showToast({
        title: res.msg,
        icon: 'none'
      })
    } else {
      wx.showToast({
        title: '核销完成',
        icon: 'none'
      })
      this.onShow()
    }
  },
})