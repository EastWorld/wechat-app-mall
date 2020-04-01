const WXAPI = require('apifm-wxapi')
const AUTH = require('../../utils/auth')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    wxlogin: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    AUTH.checkHasLogined().then(isLogined => {
      this.setData({
        wxlogin: isLogined
      })
      if (isLogined) {
        this.doneShow();
      }
    })
  },
  doneShow: function() {
    setTimeout(() => {
      this.calendar.jump()
    }, 1000)
    WXAPI.scoreSignLogs({
      token: wx.getStorageSync('token')
    }).then(res => {
      if (res.code == 0) {
        res.data.result.forEach(ele => {
          const _data = ele.dateAdd.split(" ")[0]
          this.calendar.setTodoLabels({
            pos: 'bottom',
            dotColor: '#40',
            days: [{
              year: parseInt(_data.split("-")[0]),
              month: parseInt(_data.split("-")[1]),
              day: parseInt(_data.split("-")[2]),
              todoText: '已签到'
            }],
          });
        })
      }
    })
  },
  afterTapDay(e) {
    // 不是今天，直接 return 
    const myDate = new Date();
    // console.log('y:', myDate.getFullYear())
    // console.log('m:', myDate.getMonth() + 1)
    // console.log('d:', myDate.getDate())
    if (myDate.getFullYear() != e.detail.year ||
      (myDate.getMonth() + 1) != e.detail.month ||
      myDate.getDate() != e.detail.day) {
      return
    }
    if (e.detail.showTodoLabel) {
      wx.showToast({
        title: '今天已签到',
        icon: 'none'
      })
      return
    }
    WXAPI.scoreSign(wx.getStorageSync('token')).then(r => {
      wx.showToast({
        title: '签到成功',
        icon: 'none'
      })
      this.calendar.setTodoLabels({
        pos: 'bottom',
        dotColor: '#40',
        days: [{
          year: e.detail.year,
          month: e.detail.month,
          day: e.detail.day,
          todoText: '已签到'
        }],
      });
    })
  }
})