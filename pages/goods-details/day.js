const WXAPI = require('apifm-wxapi')
const dayjs = require("dayjs")
const wxpay = require('../../utils/pay.js')

Page({
  data: {
    list: undefined,
    maxDate: dayjs().add(7, 'day').valueOf(),
  },
  onLoad(options) {
    this.setData({
      goodsId: options.goodsId
    })
    this.goodsPriceDaily()
  },
  onShow() {

  },
  async goodsPriceDaily() {
    // https://www.yuque.com/apifm/nu0f75/zg7uw6
    const res = await WXAPI.goodsPriceDaily(this.data.goodsId)
    if (res.code != 0) {
      wx.showModal({
        content: res.msg
      })
      return
    }
    const list = res.data.filter(ele => ele.stores > 0)
    this.setData({
      list
    })
  },
  async onSelect(event) {
    event.detail.forEach(ele => {
      const day = dayjs(ele).format('YYYY-MM-DD')
      const item = this.data.list.find(a => a.day == day)
      if (!item) {
        wx.showModal({
          content: day + '预约已满，请更换日期'
        })
      }
    })
  },
  async onConfirm(event) {
    const days = []
    event.detail.forEach(ele => {
      days.push(dayjs(ele).format('YYYY-MM-DD'))
    })
    const goodsJsonStr = [{
      goodsId: this.data.goodsId,
      number: days.length,
      days
    }]
    const d = {
      token: wx.getStorageSync('token'),
      goodsJsonStr: JSON.stringify(goodsJsonStr),
    }
    // https://www.yuque.com/apifm/nu0f75/qx4w98
    const res = await WXAPI.orderCreate(d)
    if (res.code != 0) {
      wx.showModal({
        content: res.msg
      })
      return
    }
    // 发起微信支付
    wxpay.wxpay('order', res.data.amountReal, res.data.id, "/pages/order-details/index?id=" + res.data.id);
  },
})