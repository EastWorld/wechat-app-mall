const WXAPI = require('apifm-wxapi')
const AUTH = require('../../../utils/auth')
const ImageUtil = require('../../../utils/image')
const APP = getApp()

var sliderWidth = 96; // 需要设置slider的宽度，用于计算中间位置

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
    balance: 0,
    freeze: 0,
    fxCommisionPaying: 0,
    score: 0,
    commisionData: {
      today: 0,
      yesday: 0,
      thisMonth: 0,
      lastMonth: 0,
      todayXiaoshou: 0,
      yesdayXiaoshou: 0,
      thisMonthXiaoshou: 0,
      lastMonthXiaoshou: 0,
    },
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // wx.setStorageSync('token', '4f02de6e-914f-4439-a128-a62a6bbdc3e4')
    this.adPosition()
  },
  onShow: function () {
    AUTH.checkHasLogined().then(isLogined => {
      if (isLogined) {
        this.doneShow();
        this.doneShow2();
        this.getUserApiInfo();
      }
    })
  },

  async commision() {
    const uid = this.data.apiUserInfoMap.base.id
    var commisionData = this.data.commisionData
    const nowDate = new Date()
    console.log('今天', nowDate.format('yyyyMMdd'))
    console.log('本月', nowDate.format('yyyyMM'))
    const yestoday = new Date(nowDate.getTime() - 24 * 60 * 60 * 1000)
    console.log('昨天', yestoday.format('yyyyMMdd'))
    // 上个月
    let year = nowDate.getFullYear()
    let month = nowDate.getMonth() + 1
    if (month == 1) {
      month = 12
      year--
    } else {
      month--
    }
    const lastMonth = year + "" + (month < 10 ? ('0' + month) : month)
    console.log('上个月', lastMonth)
    let res = await WXAPI.siteStatisticsSaleroom({
      dateBegin: nowDate.format('yyyyMMdd'),
      dateEnd: nowDate.format('yyyyMMdd'),
      uid: uid
    })
    if (res.code === 0) {
      commisionData.today = res.data[0].estimateCommission
      commisionData.todayXiaoshou = res.data[0].saleroom
    }
    res = await WXAPI.siteStatisticsSaleroom({
      dateBegin: yestoday.format('yyyyMMdd'),
      dateEnd: yestoday.format('yyyyMMdd'),
      uid: uid
    })
    if (res.code === 0) {
      commisionData.yesday = res.data[0].estimateCommission
      commisionData.yesdayXiaoshou = res.data[0].saleroom
    }
    res = await WXAPI.siteStatisticsSaleroom({
      dateBegin: nowDate.format('yyyyMM'),
      dateEnd: nowDate.format('yyyyMM'),
      uid: uid
    })
    if (res.code === 0) {
      commisionData.thisMonth = res.data[0].estimateCommission
      commisionData.thisMonthXiaoshou = res.data[0].saleroom
    }
    res = await WXAPI.siteStatisticsSaleroom({
      dateBegin: lastMonth,
      dateEnd: lastMonth,
      uid: uid
    })
    if (res.code === 0) {
      commisionData.lastMonth = res.data[0].estimateCommission
      commisionData.lastMonthXiaoshou = res.data[0].saleroom
    }
    this.setData({
      commisionData:commisionData
    })
  },
  getUserApiInfo: function () {
    var that = this;
    WXAPI.userDetail(wx.getStorageSync('token')).then(function (res) {
      if (res.code == 0) {
        let _data = {}
        _data.apiUserInfoMap = res.data
        that.setData(_data);
        that.commision();
        if (res.data.base.isSeller) {
          // 判断是否是市区合伙人
          that.fxCities()
        }
      }
    })
  },
  doneShow: function () {
    const _this = this
    const token = wx.getStorageSync('token')
    if (!token) {
      return
    }
    WXAPI.userAmount(token).then(function (res) {
      if (res.code == 700) {
        wx.showToast({
          title: '当前账户存在异常',
          icon: 'none'
        })
        return
      }
      if (res.code == 2000) {
        return
      }
      if (res.code == 0) {
        _this.setData({
          balance: res.data.balance.toFixed(2),
          freeze: res.data.freeze.toFixed(2),
          fxCommisionPaying: res.data.fxCommisionPaying.toFixed(2),
          totleConsumed: res.data.totleConsumed.toFixed(2),
          score: res.data.score
        });
      }
    })
  },
  copyContent(e) {
    var data = e.currentTarget.dataset.id + ""
    wx.setClipboardData({
      data: data
    })
  },
  async doneShow2() {
    const _this = this
    const userDetail = await WXAPI.userDetail(wx.getStorageSync('token'))
    WXAPI.fxApplyProgress(wx.getStorageSync('token')).then(res => {
      let applyStatus = userDetail.data.base.isSeller ? 2 : -1
      if (res.code == 2000) {
        return
      }
      if (res.code === 700) {
        _this.setData({
          applyStatus: applyStatus
        })
      }
      if (res.code === 0) {
        if (userDetail.data.base.isSeller) {
          applyStatus = 2
        } else {
          applyStatus = res.data.status
        }
        _this.setData({
          applyStatus: applyStatus,
          applyInfo: res.data
        })
      }
      if (applyStatus == 2) {
        _this.fetchQrcode()
      }
    })
  },
  fetchQrcode(){
    const _this = this
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    WXAPI.wxaQrcode({
      scene: 'inviter_id=' + wx.getStorageSync('uid'),
      page: 'pages/index/index',
      is_hyaline: true,
      autoColor: true,
      expireHours: 1
    }).then(res => {
      wx.hideLoading()
      if (res.code ==  41030) {
        wx.showToast({
          title: '上线以后才可以获取二维码',
          icon: 'none'
        })
        return
      }
      if (res.code == 0) {
        _this.showCanvas(res.data)
      }
    })
  },
  showCanvas(qrcode){
    const _this = this
    let ctx
    wx.getImageInfo({
      src: qrcode,
      success: (res) => {
        const imageSize = ImageUtil.imageUtil(res.width, res.height)
        const qrcodeWidth = imageSize.windowWidth / 2
        _this.setData({
          canvasHeight: qrcodeWidth
        })
        ctx = wx.createCanvasContext('firstCanvas')
        ctx.setFillStyle('#FDF3E7')
        ctx.fillRect(0, 0, imageSize.windowWidth, imageSize.imageHeight + qrcodeWidth)
        ctx.drawImage(res.path, 0, 0, qrcodeWidth, qrcodeWidth)
        setTimeout(function () {
          wx.hideLoading()
          ctx.draw()
        }, 1000)
      }
    })
  },
  saveToMobile() {
    wx.canvasToTempFilePath({
      canvasId: 'firstCanvas',
      success: function (res) {
        let tempFilePath = res.tempFilePath
        wx.saveImageToPhotosAlbum({
          filePath: tempFilePath,
          success: (res) => {
            wx.showModal({
              content: '二维码已保存到手机相册',
              showCancel: false,
              confirmText: '知道了',
              confirmColor: '#333'
            })
          },
          fail: (res) => {
            wx.showToast({
              title: res.errMsg,
              icon: 'none'
            })
          }
        })
      }
    })
  },
   // 读取市区合伙人
   async fxCities() {
    const res = await WXAPI.fxCities(wx.getStorageSync('token'))
    if (res.code == 0) {
      this.setData({
        fxCities: res.data
      })
    }
  },
   // 读取广告位
   async adPosition() {
    const res = await WXAPI.adPosition('fx_index')
    if (res.code == 0) {
      this.setData({
        fxIndexAdPos: res.data
      })
    }
  },
  goUrl(e) {
    const url = e.currentTarget.dataset.url
    if (url) {
      wx.navigateTo({
        url: url,
      })
    }
  },
  onShareAppMessage() {    
    return {
      title: '"' + wx.getStorageSync('mallName') + '" ' + wx.getStorageSync('share_profile'),
      path: '/pages/index/index?inviter_id=' + wx.getStorageSync('uid'),
      imageUrl: wx.getStorageSync('share_pic'),
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },
  goApply() {
    wx.redirectTo({
      url: '/packageFx/pages/apply/index',
    })
  }
})