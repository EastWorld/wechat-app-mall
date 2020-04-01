const app = getApp()
const WXAPI = require('apifm-wxapi')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    const _this = this
    WXAPI.userDetail(wx.getStorageSync('token')).then(res => {
      if (res.code === 0) {
        _this.setData({
          userDetail: res.data
        })
      }
    })
  },
  nameChange(e){
    this.data.name = e.detail.value
  },
  mobileChange(e){
    this.data.mobile = e.detail.value
  },
  bindSave(){
    wx.requestSubscribeMessage({
      tmplIds: ['7sO58VXh0T5a6SwB5c9hR43bnBPxW8E6v3d70QQXuIk'],
      success(res) {

      },
      fail(e) {
        console.error(e)
      },
      complete: (e) => {
        this.bindSaveDone()
      },
    })
  },
  bindSaveDone: function () {
    const name = this.data.name
    const mobile = this.data.mobile
    if (!name) {
      wx.showToast({
        title: '请输入真实姓名',
        icon: 'none'
      })
      return
    }
    if (!mobile) {
      wx.showToast({
        title: '请输入手机号码',
        icon: 'none'
      })
      return
    }
    WXAPI.fxApply(wx.getStorageSync('token'), name, mobile).then(res => {
      if (res.code != 0) {
        wx.showToast({
          title: res.msg,
          icon: 'none'
        })
        return
      }
      wx.navigateTo({
        url: "/pages/fx/apply-status"
      })
    })
  },
})