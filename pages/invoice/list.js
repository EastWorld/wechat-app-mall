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
    AUTH.checkHasLogined().then(isLogined => {
      if (isLogined) {
        this.invoiceList()
      } else {
        getApp().loginOK = () => {
          this.invoiceList()
        }
      }
    })
  },
  onShow: function () {
  },
  async invoiceList() {
    wx.showLoading({
      title: '',
    })
    // https://www.yuque.com/apifm/nu0f75/ygzggg
    const res = await WXAPI.invoiceList({
      token: wx.getStorageSync('token')
    })
    wx.hideLoading()
    if (res.code == 0) {
      this.setData({
        invoiceList: res.data.result
      })
    } else {
      this.setData({
        invoiceList: []
      })
    }
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