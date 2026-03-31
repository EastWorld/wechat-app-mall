const WXAPI = require('apifm-wxapi')
const dayjs = require("dayjs")

Page({
  data: {
    list: undefined,
    maxDate: dayjs().add(7, 'day').valueOf(),
  },
  onLoad(options) {
    this.setData({
      goodsId: options.goodsId,
      day: options.day
    })
    this.goodsTimesDayItems()
  },
  onShow() {

  },
  async goodsTimesDayItems() {
    // https://www.yuque.com/apifm/nu0f75/dlpp5v
    const res = await WXAPI.goodsTimesDayItems(this.data.day, this.data.goodsId)
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
  async submit(event) {
    console.log(event);
    const idx = event.target.dataset.idx
    const item = this.data.list[idx]
    const goodsJsonStr = [{
      goodsId: this.data.goodsId,
      number: 1,
      goodsTimesDay: this.data.day,
      goodsTimesItem: item.name,
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
    this.setData({
      orderId: res.data.id,
      money: res.data.amountReal,
      paymentShow: true,
      nextAction: {
        type: 0,
        id: res.data.id
      }
    })
  },
  paymentOk(e) {
    console.log(e.detail); // 这里是组件里data的数据
    this.setData({
      paymentShow: false
    })
    wx.redirectTo({
      url: '/pages/order-details/index?id=' + this.data.orderId,
    })
  },
  paymentCancel() {
    this.setData({
      paymentShow: false
    })
  },
})