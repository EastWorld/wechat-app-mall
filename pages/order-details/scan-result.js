const WXAPI = require('apifm-wxapi')

Page({
  data: {
    
  },
  onLoad: function (e) {
    // e.hxNumber = '2003201758574236'
    this.setData({
      hxNumber: e.hxNumber
    });
  },
  onShow: function () {
    var that = this;
    WXAPI.orderDetail(wx.getStorageSync('token'), '', this.data.hxNumber).then(function (res) {
      if (res.code != 0) {
        wx.showModal({
          title: '错误',
          content: res.msg,
          showCancel: false
        })
        return;
      }
      that.setData({
        orderDetail: res.data
      });
    })
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
    const res = await WXAPI.orderHX(this.data.hxNumber)
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