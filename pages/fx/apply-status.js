const WXAPI = require('apifm-wxapi')
const AUTH = require('../../utils/auth')
const ImageUtil = require('../../utils/image')
const wxpay = require('../../utils/pay.js')

Page({
  data: {
    wxlogin: true,

    applyStatus: -2, // -1 表示未申请，0 审核中 1 不通过 2 通过
    applyInfo: {},
    canvasHeight: 0,

    currentPages: undefined,
  },
  onLoad: function (options) {
    this.setting()
  },
  onShow() {
    const _this = this
    AUTH.checkHasLogined().then(isLogined => {
      this.setData({
        wxlogin: isLogined
      })
      if (isLogined) {
        this.doneShow();
      }
    })
  },
  async doneShow() {
    const _this = this
    const userDetail = await WXAPI.userDetail(wx.getStorageSync('token'))
    WXAPI.fxApplyProgress(wx.getStorageSync('token')).then(res => {
      let applyStatus = userDetail.data.base.isSeller ? 2 : -1
      if (res.code == 2000) {
        this.setData({
          wxlogin: false
        })
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
    this.setData({
      currentPages: getCurrentPages()
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
        ctx.setFillStyle('#fff')
        ctx.fillRect(0, 0, imageSize.windowWidth, imageSize.imageHeight + qrcodeWidth)
        ctx.drawImage(res.path, (imageSize.windowWidth - qrcodeWidth) / 2, 0, qrcodeWidth, qrcodeWidth)
        setTimeout(function () {
          wx.hideLoading()
          ctx.draw()
        }, 1000)
      }
    })
  },
  onShareAppMessage() {    
    return {
      title: '"' + wx.getStorageSync('mallName') + '" ' + wx.getStorageSync('share_profile'),
      path: '/pages/index/index?inviter_id=' + wx.getStorageSync('uid'),
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },
  bindSave: function (e) {
    wx.navigateTo({
      url: "/pages/fx/apply"
    })
  },
  goShop: function (e) {
    wx.switchTab({
      url: '/pages/index/index',
    })
  },
  saveToMobile() { //下载二维码到手机
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
              icon: 'none',
              duration: 2000
            })
          }
        })
      }
    })
  },
  goIndex() {
    wx.switchTab({
      url: '/pages/index/index',
    });
  },
  cancelLogin() {
    wx.switchTab({
      url: '/pages/my/index'
    })
  },
  processLogin(e) {
    if (!e.detail.userInfo) {
      wx.showToast({
        title: '已取消',
        icon: 'none',
      })
      return;
    }
    AUTH.register(this);
  },
  async setting() {
    const res = await WXAPI.fxSetting()
    if (res.code == 0) {
      this.setData({
        setting: res.data
      })
    }
  },
  async buy() {
    const token = wx.getStorageSync('token')
    let res = await WXAPI.userAmount(token)
    if (res.code != 0) {
      wx.showToast({
        title: res.msg,
        icon: 'none'
      })
      return
    }
    if (res.data.balance >= this.data.setting.price) {
      // 余额足够
      res = await WXAPI.fxBuy(token)
      if (res.code != 0) {
        wx.showToast({
          title: res.msg,
          icon: 'none'
        })
        return
      }
      wx.showToast({
        title: '升级成功',
      })
      setTimeout(() => {
        this.doneShow();
      }, 1000);
    } else {
      let price = this.data.setting.price - res.data.balance
      price = price.toFixed(2)
      wxpay.wxpay('fxsBuy', price, 0, "/pages/fx/apply-status");
    }
  }
})