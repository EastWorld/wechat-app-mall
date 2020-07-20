const WXAPI = require('apifm-wxapi')
const AUTH = require('../../utils/auth')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    invoiceList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  onShow: function () {
    const _this = this
    AUTH.checkHasLogined().then(isLogined => {
      if (isLogined) {
        WXAPI.invoiceList({
          token: wx.getStorageSync('token')
        }).then(res => {
          if (res.code == 0) {
            _this.setData({
              invoiceList: res.data.result
            })
          } else {
            _this.setData({
              invoiceList: []
            })
          }
        })
      } else {
        wx.showModal({
          title: '提示',
          content: '本次操作需要您的登录授权',
          cancelText: '暂不登录',
          confirmText: '前往登录',
          success(res) {
            if (res.confirm) {
              wx.switchTab({
                url: "/pages/my/index"
              })
            } else {
              wx.navigateBack()
            }
          }
        })
      }
    })
  },
  download(e) {
    const _this = this
    const file = e.currentTarget.dataset.file
    wx.downloadFile({
      url: file,
      success (res) {
        const tempFilePath = res.tempFilePath
        console.log(tempFilePath);
        wx.openDocument({
          filePath: tempFilePath,
          showMenu: true,
          success: function (res) {
            console.log('打开文档成功')
          }
        })
      }
    })
  },
})