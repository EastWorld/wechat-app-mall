const WXAPI = require('apifm-wxapi')
const dayjs = require("dayjs")

Page({
  data: {
    list: undefined,
  },
  onLoad(options) {
    this.setData({
      goodsId: options.goodsId
    })
    this.goodsTimesDays()
  },
  onShow() {

  },
  async goodsTimesDays() {
    // https://www.yuque.com/apifm/nu0f75/wy8nlq
    const res = await WXAPI.goodsTimesDays(this.data.goodsId)
    if (res.code != 0) {
      wx.showModal({
        content: res.msg
      })
      return
    }
    const list = res.data
    this.setData({
      list,
      maxDate: dayjs(list[list.length - 1]).valueOf(),
    })
  },
  async onConfirm(event) {
    const day = dayjs(event.detail).format('YYYY-MM-DD')
    if (!this.data.list.includes(day)) {
      wx.showModal({
        content: day + '预约已满，请更换日期'
      })
      return
    }
    wx.navigateTo({
      url: '/pages/goods-details/times02?goodsId='+ this.data.goodsId +'&day=' + day,
    })
  },
})