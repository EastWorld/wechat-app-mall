const app = getApp()
const WXAPI = require('apifm-wxapi')
const AUTH = require('../../utils/auth')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    score: 0,
    growth: 0,
    uid: undefined
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    AUTH.checkHasLogined().then(isLogined => {
      if (isLogined) {
        this.initData()
      } else {
        getApp().loginOK = () => {
          this.initData()
        }
      }
    })
  },
  onShow: function () {
  },
  async initData(){
    const token = wx.getStorageSync('token')
    const res1 = await WXAPI.userAmount(token)
    if (res1.code == 0) {
      this.data.score = res1.data.score
      this.data.growth = res1.data.growth
    }
    const res2 = await WXAPI.scoreDeductionRules(1);
    if (res2.code == 0) {
      this.data.deductionRules = res2.data
    }
    this.setData({
      score: this.data.score,
      growth: this.data.growth,
      deductionRules: this.data.deductionRules,
    })
  },
  async bindSave() {
    if (!this.data.score2) {
      wx.showToast({
        title: '请输入积分数量',
        icon: 'none'
      })
      return
    }
    const res = await WXAPI.exchangeScoreToGrowth(wx.getStorageSync('token'), this.data.score2)
    if (res.code == 0) {
      wx.showModal({
        content: '恭喜您，成功兑换'+ res.data +'成长值',
        showCancel: false
      })
      this.initData()
    } else {
      wx.showToast({
        title: res.msg,
        icon: 'none'
      })
    }
  },
})