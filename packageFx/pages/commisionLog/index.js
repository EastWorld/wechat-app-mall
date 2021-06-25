const wxpay = require('../../../utils/pay.js')
const WXAPI = require('apifm-wxapi')

Page({
  data: {
    dateBegin: undefined,
    dateEnd: undefined,
    sellerMobile: undefined,
    aggregate: {
      sum_sale_amount: 0
    }
  },
  onLoad(options) {},
  onShow: function () {
    //获取佣金列表
    this.getCommisionLog()
  },
  async getCommisionLog() {
    const postData = {
      token: wx.getStorageSync('token'),
      dateAddBegin: this.data.dateBegin ? this.data.dateBegin : '',
      dateAddEnd: this.data.dateEnd ? this.data.dateEnd : '',
      sellerMobile: this.data.sellerMobile ? this.data.sellerMobile : ''
    }
    await WXAPI.fxCommisionLog(postData).then(res => {
      if (res.code == 0) {
        const goodsMap = res.data.goodsMap
        const commisionLog = res.data.result
        if (goodsMap) {
          res.data.orderList.forEach(ele => {
            const _goods = goodsMap[ele.id] // 该订单下的商品列表
            if (_goods) {
              let totalCommision = 0
              _goods.forEach(c => {
                const commisionRecord = commisionLog.find(d => {
                  return d.orderId == ele.id && d.goodsName == c.goodsName //  FIXME 要么根据销售额，还是别的来匹配返佣记录
                })
                if (commisionRecord) {
                  totalCommision += commisionRecord.money
                  c.commisionRecord = commisionRecord
                  ele.buyerUserNick = commisionRecord.nicks ? commisionRecord.nicks : '用户' + commisionRecord.uids
                }
              })
              ele.goodsList = _goods
              ele.totalCommision = totalCommision
            }
          })
        }
        this.setData({
          commisionLog,
          orderList: res.data.orderList,
          logisticsMap: res.data.logisticsMap,
          goodsMap,
          aggregate: res.data.aggregate,
          userInviter: res.data.userInviter,
        })
      } else {
        this.setData({
          commisionLog: [],
          orderList: [],
          logisticsMap: [],
          goodsMap: [],
        })
      }
    })
  },
  dateBeginCancel() {
    this.setData({
      dateBegin: null
    })
  },
  dateBeginChange(e) {
    this.setData({
      dateBegin: e.detail.value
    })
  },
  dateEndCancel() {
    this.setData({
      dateEnd: null
    })
  },
  dateEndChange(e) {
    this.setData({
      dateEnd: e.detail.value
    })
  }
})