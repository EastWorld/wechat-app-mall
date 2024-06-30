const WXAPI = require('apifm-wxapi')
const CONFIG = require('../../config.js')
Page({
  data: {
    autosize: {
      minHeight: 100
    },
    orderId: 1,
    number: 0,
    amount: 999.00,

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
      amount: e.amount,
      customerServiceType: CONFIG.customerServiceType,
    })
    this.orderDetail()
  },
  onShow(){
  },
  async orderDetail() {
    const token = wx.getStorageSync('token')
    const res = await WXAPI.orderDetail(token, this.data.orderId)
    if (res.code != 0) {
      wx.showModal({
        content: res.msg,
        success: (res) => {
          wx.navigateBack()
        }
      })
      return
    }
    res.data.goods.forEach(ele => {
      if (ele.afterSale) {
        ele.afterSale.split(',').forEach(a => {
          ele['afterSale' + a] = true
        })
      }
    })
    // 读取已申请售后记录
    const res2 = await WXAPI.refundApplyDetail(token, this.data.orderId)
    let refundApplyList = []
    if (res2.code == 0) {
      res2.data.forEach(ele => {
        ele.goodInfo = res.data.goods.find(g => g.id == ele.baseInfo.orderGoodsId)
        console.log(ele.goodInfo);
      })
      refundApplyList = res2.data
    }
    this.setData({
      goods: res.data.goods,
      refundApplyList
    })
  },
  async refundApplyCancel(){
    wx.showLoading({
      title: '',
    })
    const res = await WXAPI.refundApplyCancel(wx.getStorageSync('token'), this.data.curRufund.baseInfo.orderId, this.data.curRufund.baseInfo.orderGoodsId)
    wx.hideLoading()
    if (res.code == 0) {
      wx.showToast({
        title: '已取消',
      })
      this.popClose()
      this.orderDetail()
    } else {
      wx.showToast({
        title: res.msg,
        icon: 'none'
      })
    }
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
  async bindSave () {
    let amount = this.data.curGoods.amountSingle * this.data.number
    if (this.data.type == 2) {
      // 换货金额为0
      amount = 0.00
    }
    wx.showLoading({
      title: '',
    })
    // 批量上传附件
    if (this.data.picsList) {
      for (let index = 0; index < this.data.picsList.length; index++) {
        const pic = this.data.picsList[index];
        const res = await WXAPI.uploadFileV2(wx.getStorageSync('token'), pic.url)
        if (res.code == 0) {
          this.data.pics.push(res.data.url)
        }
      }
    }
    const res = await WXAPI.refundApply({
      token: wx.getStorageSync('token'),
      orderId: this.data.orderId,
      orderGoodsId: this.data.curGoods.id,
      type: this.data.type,
      logisticsStatus: this.data.logisticsStatus,
      reason: this.data.reason,
      number: this.data.number,
      amount,
      remark: this.data.remark || '',
      pic: this.data.pics.join()
    })
    wx.hideLoading()
    if (res.code == 20000) {
      wx.showModal({
        content: '当前商品正在售后中，如需重新申请，请先撤销之前的售后申请',
        showCancel: false
      })
      return
    }
    if (res.code == 0) {
      wx.showModal({
        content: '提交成功，请耐心等待我们处理！',
        showCancel: false,
        success: res => {
          wx.navigateBack()
        }
      })
    } else {
      wx.showModal({
        content: res.msg,
        showCancel: false,
        success: res => {
          wx.navigateBack()
        }
      })
    }
  },
  goodsClick(e) {
    const goodsIndex = e.currentTarget.dataset.name
    const curGoods = this.data.goods[goodsIndex]
    if (!curGoods || !curGoods.afterSale) {
      return
    }
    this.setData({
      goodsIndex,
      curGoods,
      number: curGoods.number
    })
  },
  numberChange(e) {
    let number = e.detail
    if (!number) {
      return
    }
    if (number > this.data.curGoods.number) {
      number = this.data.curGoods.number
    }
    this.setData({
      number
    })
  },
  refundDetail(e) {
    const index = e.currentTarget.dataset.idx
    const curRufund = this.data.refundApplyList[index]
    const imageList = []
    if (curRufund.pics) {
      curRufund.pics.forEach(ele => {
        imageList.push(ele.pic + '_m')
      })
    }
    this.setData({
      popShow: true,
      curRufund,
      imageList
    })
  },
  popClose() {
    this.setData({
      popShow: false
    })
  },
  previewImageimageList(e) {
    console.log(e);
    wx.previewImage({
      current: e.currentTarget.dataset.current,
      urls: this.data.imageList,
    })
  },
  customerService() {
    wx.openCustomerServiceChat({
      extInfo: {url: wx.getStorageSync('customerServiceChatUrl')},
      corpId: wx.getStorageSync('customerServiceChatCorpId'),
      success: res => {},
      fail: err => {
        console.error(err)
      }
    })
  },
});