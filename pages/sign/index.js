const WXAPI = require('apifm-wxapi')
const AUTH = require('../../utils/auth')

Page({
  data: {
    minDate: new Date().getTime(),
    maxDate: new Date().getTime(),
    formatter(day) {
      return day;
    },
  },
  onLoad: function(options) {
    this.scoreSignLogs()
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
})