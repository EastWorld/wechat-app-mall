const WXAPI = require('apifm-wxapi')
Page({
  data: {
    autosize: {
      minHeight: 100
    },
    orderId: 1,
    amount: 999.00,

    refundApplyDetail: undefined,

    type: '0',
    typeItems: [
      { name: '我要退款(无需退货)', value: '0', checked: true },
      { name: '我要退货退款', value: '1' },
      { name: '我要换货', value: '2' },
    ],

    logisticsStatus:'0',
    logisticsStatusItems: [
      { name: '未收到货', value: '0', checked: true },
      { name: '已收到货', value: '1' }
    ],

    reason: '不喜欢/不想要',
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
  typeChange(event) {
    this.setData({
      type: event.detail,
    });
  },
  typeClick(event) {
    const { name } = event.currentTarget.dataset;
    this.setData({
      type: name,
    });
  },
  logisticsStatusChange(event) {
    this.setData({
      logisticsStatus: event.detail,
    });
  },
  logisticsStatusClick(event) {
    const { name } = event.currentTarget.dataset;
    this.setData({
      logisticsStatus: name,
    });
  },
  reasonChange(event) {
    this.setData({
      reason: event.detail,
    });
  },
  reasonClick(event) {
    const { name } = event.currentTarget.dataset;
    this.setData({
      reason: name,
    });
  },
  reasonChange: function (e) {
    this.setData({
      reasonIndex: e.detail.value
    })
  },
  afterPicRead(e) {
    let picsList = this.data.picsList
    if (!picsList) {
      picsList = []
    }
    picsList = picsList.concat(e.detail.file)
    this.setData({
      picsList
    })
  },
  afterPicDel(e) {
    let picsList = this.data.picsList
    picsList.splice(e.detail.index, 1)
    this.setData({
      picsList
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
    // 批量上传附件
    if (this.data.picsList) {
      for (let index = 0; index < this.data.picsList.length; index++) {
        const pic = this.data.picsList[index];
        const res = await WXAPI.uploadFile(wx.getStorageSync('token'), pic.url)
        if (res.code == 0) {
          this.data.pics.push(res.data.url)
        }
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
    let amount = this.data.amount;
    if (_this.data.type == 2) {
      amount = 0.00
    }
    let remark = this.data.remark;
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
      reason: _this.data.reason,
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