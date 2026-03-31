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
  onLoad(e) {
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    this.userDetail()
  },
  async userDetail() {
    // https://www.yuque.com/apifm/nu0f75/zgf8pu
    wx.showLoading({
      title: '',
    })
    const res = await WXAPI.userDetail(wx.getStorageSync('token'))
    wx.hideLoading()
    if (res.code == 0) {
      this.setData({
        userDetail: res.data
      })
    }
  },
  async bindSave(){
    if (this.data.userDetail && !this.data.userDetail.base.mobile) {
      this.setData({
        bindMobileShow: true
      })
      return
    }
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
  bindMobileOk(e) {
    console.log(e.detail); // 这里是组件里data的数据
    this.setData({
      bindMobileShow: false
    })
    this.userDetail()
  },
  bindMobileCancel() {
    this.setData({
      bindMobileShow: false
    })
  },
})