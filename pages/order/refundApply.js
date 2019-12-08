const WXAPI = require('apifm-wxapi')
Page({
  data: {
    orderId: 1,
    amount: 999.00,

    refundApplyDetail: undefined,

    type: 0,
    typeItems: [
      { name: '我要退款(无需退货)', value: '0', checked: true },
      { name: '我要退货退款', value: '1' },
      { name: '我要换货', value: '2' },
    ],

    logisticsStatus:0,
    logisticsStatusItems: [
      { name: '未收到货', value: '0', checked: true },
      { name: '已收到货', value: '1' }
    ],

    reasons: [
      "不喜欢/不想要", 
      "空包裹", 
      "未按约定时间发货",
      "快递/物流一直未送达",
      "货物破损已拒签",
      "退运费",
      "规格尺寸与商品页面描述不符",
      "功能/效果不符",
      "质量问题",
      "少件/漏发",
      "包装/商品破损",
      "发票问题",
      ],
    reasonIndex: 0,

    files: [],
    pics: []
  },
  onLoad: function (e) {
    this.setData({
      orderId: e.id,
      amount: e.amount
    });
  },
  onShow(){
    const _this = this
    WXAPI.refundApplyDetail(wx.getStorageSync('token'), _this.data.orderId).then(res => {
      if (res.code == 0) {
        _this.setData({
          refundApplyDetail: res.data[0]  // baseInfo, pics
        })
      }
    })
  },
  refundApplyCancel(){
    const _this = this
    WXAPI.refundApplyCancel(wx.getStorageSync('token'), _this.data.orderId).then(res => {
      if (res.code == 0) {
        wx.navigateTo({
          url: "/pages/order-list/index"
        })
      }
    })
  },
  typeItemsChange: function (e) {
    const typeItems = this.data.typeItems;
    for (var i = 0, len = typeItems.length; i < len; ++i) {
      typeItems[i].checked = typeItems[i].value == e.detail.value;
    }
    this.setData({
      typeItems: typeItems,
      type: e.detail.value
    });
  },
  logisticsStatusItemsChange: function (e) {
    const logisticsStatusItems = this.data.logisticsStatusItems;
    for (var i = 0, len = logisticsStatusItems.length; i < len; ++i) {
      logisticsStatusItems[i].checked = logisticsStatusItems[i].value == e.detail.value;
    }
    this.setData({
      logisticsStatusItems: logisticsStatusItems,
      logisticsStatus: e.detail.value
    });
  },
  reasonChange: function (e) {
    this.setData({
      reasonIndex: e.detail.value
    })
  },
  chooseImage: function (e) {
    const that = this;
    wx.chooseImage({
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        that.setData({
          files: that.data.files.concat(res.tempFilePaths)
        });
      }
    })
  },
  previewImage: function (e) {
    const that = this;
    wx.previewImage({
      current: e.currentTarget.id, // 当前显示图片的http链接
      urls: that.data.files // 需要预览的图片http链接列表
    })
  },
  async uploadPics(){
    const _this = this;
    for (let i = 0; i< _this.data.files.length; i++) {
      const res = await WXAPI.uploadFile(wx.getStorageSync('token'), _this.data.files[i])
      if (res.code == 0) {
        _this.data.pics.push(res.data.url)
      }
    }
  },
  async bindSave (e) {
    // 提交保存
    const _this = this;
    // _this.data.orderId
    // _this.data.type
    // _this.data.logisticsStatus
    // _this.data.reasons[_this.data.reasonIndex]
    let amount = e.detail.value.amount;
    if (_this.data.type == 2) {
      amount = 0.00
    }
    let remark = e.detail.value.remark;
    if (!remark) {
      remark = ''
    }
    // 上传图片
    await _this.uploadPics()
    // _this.data.pics
    WXAPI.refundApply({
      token: wx.getStorageSync('token'),
      orderId: _this.data.orderId,
      type: _this.data.type,
      logisticsStatus: _this.data.logisticsStatus,
      reason: _this.data.reasons[_this.data.reasonIndex],
      amount,
      remark,
      pic: _this.data.pics.join()
    }).then(res => {
      if (res.code == 0) {
        wx.showModal({
          title: '成功',
          content: '提交成功，请耐心等待我们处理！',
          showCancel: false,
          confirmText: '我知道了',
          success(res) {
            wx.navigateTo({
              url: "/pages/order-list/index"
            })
          }
        })
      } else {
        wx.showModal({
          title: '失败',
          content: res.msg,
          showCancel: false,
          confirmText: '我知道了',
          success(res) {
            wx.navigateTo({
              url: "/pages/order-list/index"
            })
          }
        })
      }
    })
  }
});