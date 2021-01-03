const app = getApp()
const WXAPI = require('apifm-wxapi')

var sliderWidth = 96;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    number1: 0,
    number2: 0,
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0,
    grids: [0, 1, 2, 3, 4, 5, 6, 7, 8]
  },

  onLoad: function () {
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          sliderLeft: (res.windowWidth / 2 - sliderWidth) / 2,
          sliderOffset: res.windowWidth / 2 * that.data.activeIndex
        });
      }
    });
  },
  tabClick: function (e) {
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    });
  },
  onShow: function () {
    const _this = this
    WXAPI.fxMembers({
      token: wx.getStorageSync('token'),
      pageSize: 100000
    }).then(res => {
      if (res.code == 700) {
        _this.setData({
          members: [],
          number1: 0,
          number2: 0
        })
      }
      if (res.code == 0) {
        let number1 = 0
        let number2 = 0
        res.data.result.forEach(ele => {
          if (ele.level == 1) {
            number1++
          }
          if (ele.level == 2) {
            number2++
          }
        })
        _this.setData({
          members: res.data.result,
          number1: number1,
          number2: number2
        })
      }
    })
  },
})