const WXAPI = require('apifm-wxapi')
Page({
  data: {

  },
  onLoad: function (options) {
    this.myLiveRooms()
  },
  onShow: function () {

  },
  async myLiveRooms() {
    const res = await WXAPI.myLiveRooms({
      token: wx.getStorageSync('token')
    })
    if (res.code == 0) {
      this.setData({
        liveRooms: res.data.result
      })
    }
  },
  stop(e) {
    wx.showModal({
      title: '提示',
      content: '确定结束本场直播吗？',
      success: res => {
        if (res.confirm) {
          this._stop(e)
        }
      }
    })
  },
  async _stop(e) {
    const id = e.currentTarget.dataset.id
    const res = await WXAPI.stopLiveRoom(wx.getStorageSync('token'), id)
    if (res.code != 0) {
      wx.showToast({
        title: res.msg,
        icon: 'none'
      })
      return
    }
    this.myLiveRooms()
  },
})