const WXAPI = require('apifm-wxapi')

Page({
  data: {
    autosize: {
      minHeight: 100
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    
  },
  onShow: function() {
    this.checkTodayComments()
  },
  async checkTodayComments() {
    // 判断一天只能留言5次
    const res = await WXAPI.jsonList({
      token: wx.getStorageSync('token'),
      type: 'feedback_times'
    })
    if (res.code === 0) {
      this.setData({
        feedbackTimes: res.data[0]
      })
    }
  },
  async bindSave() {    
    if (!this.data.name) {
      wx.showToast({
        title: '请填写您的姓名',
        icon: 'none',
      })
      return
    }
    if (!this.data.content) {
      wx.showToast({
        title: '请填写反馈信息',
        icon: 'none',
      })
      return
    }
    const extJsonStr = {}
    extJsonStr['姓名'] = this.data.name
    extJsonStr['联系电话'] = this.data.mobile
    extJsonStr['微信'] = this.data.wx

    // 批量上传附件
    if (this.data.picsList) {
      for (let index = 0; index < this.data.picsList.length; index++) {
        const pic = this.data.picsList[index];
        const res = await WXAPI.uploadFile(wx.getStorageSync('token'), pic.url)
        if (res.code == 0) {
          extJsonStr['file' + index] = res.data.url
        }
      }
    }

    const res = await WXAPI.addComment({
      token: wx.getStorageSync('token'),
      type: 1,
      extJsonStr: JSON.stringify(extJsonStr),
      content: this.data.content
    })
    if (res.code == 0) {
      // 提交次数 + 1 
      let feedbackTimes = this.data.feedbackTimes
      if (!feedbackTimes) {
        feedbackTimes = {
          id: '',
          refId: 0,
          content: '{}'
        }
      }
      await WXAPI.jsonSet({
        token: wx.getStorageSync('token'),
        id: feedbackTimes.id,
        type: 'feedback_times',
        refId: feedbackTimes.refId + 1,
        content: feedbackTimes.content
      })
      await this.checkTodayComments()
      wx.showToast({
        title: '提交成功',
      })
      setTimeout(() => {
        wx.navigateBack({
          delta: 0,
        })
      }, 1000);
    } else {
      wx.showToast({
        title: res.msg,
        icon: 'none'
      })
    }
  },
  afterPicRead(e) {
    let picsList = this.data.picsList
    if (!picsList) {
      picsList = []
    }
    picsList = picsList.concat(e.detail.file)
    this.setData({
      picsList
    })
  },
  afterPicDel(e) {
    let picsList = this.data.picsList
    picsList.splice(e.detail.index, 1)
    this.setData({
      picsList
    })
  }
})