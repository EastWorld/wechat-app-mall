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
    this.adPosition()
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
  async adPosition() {
    const res = await WXAPI.adPosition('fx-top-pic')
    if (res.code == 0) {
      this.setData({
        adPositionFxTopPic: res.data
      })
    }
  },
  bindSave(){
    const fx_subscribe_ids = wx.getStorageSync('fx_subscribe_ids')
    if (fx_subscribe_ids) {
      wx.requestSubscribeMessage({
        tmplIds: fx_subscribe_ids.split(','),
        success(res) {
  
        },
        fail(e) {
          console.error(e)
        },
        complete: (e) => {
          this.bindSaveDone()
        },
      })
    } else{
      this.bindSaveDone()
    }
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
      wx.redirectTo({
        url: "/packageFx/pages/apply/index"
      })
    })
  },
})