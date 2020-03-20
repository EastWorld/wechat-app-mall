const app = getApp();
const CONFIG = require('../../config.js')
const WXAPI = require('apifm-wxapi')
import wxbarcode from 'wxbarcode'

Page({
    data:{
      orderId:0,
      goodsList:[]
    },
    onLoad:function(e){
      // e.id = 478785
      var orderId = e.id;
      this.data.orderId = orderId;
      this.setData({
        orderId: orderId,
        appid: wx.getStorageSync('wxAppid')
      });
    },
    onShow : function () {
      var that = this;
      WXAPI.orderDetail(wx.getStorageSync('token'), that.data.orderId).then(function (res) {
        if (res.code != 0) {
          wx.showModal({
            title: '错误',
            content: res.msg,
            showCancel: false
          })
          return;
        }
        // 绘制核销码
        if (res.data.orderInfo.hxNumber && res.data.orderInfo.status > 0) {
          wxbarcode.qrcode('qrcode', res.data.orderInfo.hxNumber, 650, 650);
        }        
        that.setData({
          orderDetail: res.data
        });
      })
    },
    wuliuDetailsTap:function(e){
      var orderId = e.currentTarget.dataset.id;
      wx.navigateTo({
        url: "/pages/wuliu/index?id=" + orderId
      })
    },
    confirmBtnTap:function(e){
      let that = this;
      let orderId = this.data.orderId;
      wx.showModal({
          title: '确认您已收到商品？',
          content: '',
          success: function(res) {
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
    }
})