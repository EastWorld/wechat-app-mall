const WXAPI = require('apifm-wxapi')
const AUTH = require('../../utils/auth')

Page({
  data: {
    minDate: new Date().getTime(),
    maxDate: new Date().getTime(),
    formatter(day) {
      return day;
    },
    useFingerprintEmoji: false   // 默认用图片，支持Unicode 16及以上的操作系统才用指纹emoji（🫆）
  },
  onLoad: function(options) {
    this.scoreSignLogs()
    this.setData({ useFingerprintEmoji: this.shouldUseFingerprintEmoji() });
  },
  onShow: function() {
    AUTH.checkHasLogined().then(isLogined => {
      if (!isLogined) {
        AUTH.login(this)
      }
    })
  },
  async scoreSignLogs() {
    const res = await WXAPI.scoreSignLogs({
      token: wx.getStorageSync('token')
    })
    if (res.code == 0) {
      this.setData({
        scoreSignLogs: res.data.result,
        formatter(day) {
          const _log = res.data.result.find(ele => {
            const year = day.date.getYear() + 1900
            let month = day.date.getMonth() + 1
            month = month + ''
            if (month.length == 1) {
              month = '0' + month
            }
            let date = day.date.getDate() + ''
            if (date.length == 1) {
              date = '0' + date
            }
            return ele.dateAdd.indexOf(`${year}-${month}-${date}`) == 0
          })
          if (_log) {
            day.bottomInfo = '已签到'
          }
          return day;
        }
      })
    }
  },
  async sign() {
    const res = await WXAPI.scoreSign(wx.getStorageSync('token'))
    if (res.code == 10000) {
      wx.showToast({
        title: '签到成功',
        icon: 'success'
      })
      this.scoreSignLogs()
      return
    }
    if (res.code != 0) {
      wx.showToast({
        title: res.msg,
        icon: 'none'
      })
    } else {
      wx.showToast({
        title: '签到成功',
        icon: 'success'
      })
      this.scoreSignLogs()
    }
  },
  /* 简单版判断：满足 Win11-25H2 及以上 / Android16+ / iOS18.4+ 返回 true */
  shouldUseFingerprintEmoji() {
    try {
      const info = wx.getDeviceInfo ? wx.getDeviceInfo() : wx.getSystemInfoSync();
      const plat = (info.platform || '').toLowerCase();
      const sys  = info.system || '';

      if (plat === 'android') {
        const m = sys.match(/Android\s+(\d+)/);
        return m ? (parseInt(m[1]) >= 16) : false;
      }
      if (plat === 'ios') {
        const m = sys.match(/iOS\s+(\d+)\.(\d+)/);
        if (!m) return false;
        const major = parseInt(m[1]);
        const minor = parseInt(m[2]);
        return major > 18 || (major === 18 && minor >= 4);
      }
      if (plat === 'windows' || plat === 'win32') {   // 开发者工具里 platform 可能是 windows
        const m = sys.match(/Windows\s+(\d+)\s*H(\d+)/);
        if (!m) return false;
        const build = parseInt(m[1]);
        const h     = parseInt(m[2]);
        return build >= 25 && h >= 2;   // 25H2 及以上
      }
    } catch (e) { /* 忽略错误，统一走图片 */ }
    return false;   // 其余系统或解析失败都用 png
  }
})