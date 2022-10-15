Page({
  data: {

  },
  onLoad(options) {
    this.startWifi()
  },
  onShow() {

  },
  startWifi() {
    wx.startWifi({
      success: res => {
        console.log(res)
        if (res.errno != 0) {
          wx.showToast({
            title: res.errMsg,
            icon: 'none'         
          })
          return
        }
        this.getWifiList()
      },
      fail: err => {
        console.error(err)
      }
    })
  },
  getWifiList() {
    wx.getWifiList({
      success: res => {
        console.log(res)
        if (res.errno != 0) {
          wx.showToast({
            title: res.errMsg,
            icon: 'none'         
          })
          return
        }
        wx.onGetWifiList(res2 => {
          this.setData({
            wifiList: res2.wifiList
          })
        })
      },
      fail: err => {
        console.error(err)
      }
    })
  },
  connetWifi(e) {
    const item = e.currentTarget.dataset.d
    wx.connectWifi({
      SSID: item.SSID,
      password: '13858187870',
      partialInfo: true,
      success: res => {
        console.log(res)
      },
      fail: err => {
        console.error(err)
      }
    })    
  },
})