const WXAPI = require('apifm-wxapi')
const APP = getApp()
// fixed首次打开不显示标题的bug
APP.configLoadOK = () => {
  wx.setNavigationBarTitle({
    
  })
}
Date.prototype.format = function(format) {
  var date = {
         "M+": this.getMonth() + 1,
         "d+": this.getDate(),
         "h+": this.getHours(),
         "m+": this.getMinutes(),
         "s+": this.getSeconds(),
         "q+": Math.floor((this.getMonth() + 3) / 3),
         "S+": this.getMilliseconds()
  };
  if (/(y+)/i.test(format)) {
         format = format.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length));
  }
  for (var k in date) {
         if (new RegExp("(" + k + ")").test(format)) {
                format = format.replace(RegExp.$1, RegExp.$1.length == 1
                       ? date[k] : ("00" + date[k]).substr(("" + date[k]).length));
         }
  }
  return format;
}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    aliveRooms: [],
    useFingerprintEmoji: false   // 新增
  },
  onLoad: function (options) {
    this.wxaMpLiveRooms()
    this.setData({ useFingerprintEmoji: this.shouldUseFingerprintEmoji() })
  },
  onShow: function () {

  },
  async wxaMpLiveRooms(){
    wx.showLoading({
      title: '',
    })
    const res = await WXAPI.wxaMpLiveRooms()
    wx.hideLoading({
      success: (res) => {},
    })
    if (res.code == 0 && res.data.length > 0) {
      res.data.forEach(ele => {
        if (ele.start_time) {
          ele.start_time_str = new Date(ele.start_time*1000).format('yyyy-MM-dd h:m:s')
        }
      })
      this.setData({
        aliveRooms: res.data
      })
    }
  },
  onPullDownRefresh: function() {
    // console.log('ppppp')
    this.setData({
      curPage: 1
    });
    this.wxaMpLiveRooms()
    wx.stopPullDownRefresh()
  },
  goLiveRoom(e) {
    const roomId = e.currentTarget.dataset.id
    const status = e.currentTarget.dataset.status
    if (status == 107 || status == 106 || status == 104) {
      return
    }
    wx.navigateTo({
      url: `plugin-private://wx2b03c6e691cd7370/pages/live-player-plugin?room_id=${roomId}`
    })
  },
  /* 与 sign 页完全相同的判断逻辑*/
  shouldUseFingerprintEmoji() {
    try {
      const info = wx.getDeviceInfo ? wx.getDeviceInfo() : wx.getSystemInfoSync()
      const plat = (info.platform || '').toLowerCase()
      const sys  = info.system || ''
  
      if (plat === 'android') {
        const m = sys.match(/Android\s+(\d+)/)
        return m ? (parseInt(m[1]) >= 16) : false
      }
      if (plat === 'ios') {
        const m = sys.match(/iOS\s+(\d+)\.(\d+)/)
        if (!m) return false
        const major = parseInt(m[1]), minor = parseInt(m[2])
        return major > 18 || (major === 18 && minor >= 4)
      }
      if (plat === 'windows' || plat === 'win32') {
        const m = sys.match(/Windows\s+(\d+)\s*H(\d+)/)
        if (!m) return false
        const build = parseInt(m[1]), h = parseInt(m[2])
        return build >= 25 && h >= 2
      }
    } catch (e) {}
    return false
  }
})