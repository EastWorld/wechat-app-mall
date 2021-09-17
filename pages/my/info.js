const WXAPI = require('apifm-wxapi')
const AUTH = require('../../utils/auth')
Page({
  data: {
    avatarUrl: undefined,
    avatarUrlTmpFile: undefined,
    gender: undefined,
    genderArray: [ '男性', '女性'],
    genderIndex: -1
  },
  onLoad: function (options) {
    this.getUserApiInfo()
  },
  onShow: function () {
    AUTH.wxaCode().then(code => {
      this.data.code = code
    })
  },
  getPhoneNumber: function(e) {
    if (!e.detail.errMsg || e.detail.errMsg != "getPhoneNumber:ok") {
      wx.showModal({
        title: '提示',
        content: e.detail.errMsg,
        showCancel: false
      })
      return;
    }
    this._getPhoneNumber(e)
  },
  async _getPhoneNumber(e) {
    let res
    const extConfigSync = wx.getExtConfigSync()
    if (extConfigSync.subDomain) {
      // 服务商模式
      res = await WXAPI.wxappServiceBindMobile({
        token: wx.getStorageSync('token'),
        code: this.data.code,
        encryptedData: e.detail.encryptedData,
        iv: e.detail.iv,
      })
    } else {
      res = await WXAPI.bindMobileWxapp(wx.getStorageSync('token'), this.data.code, e.detail.encryptedData, e.detail.iv)
    }
    AUTH.wxaCode().then(code => {
      this.data.code = code
    })
    if (res.code === 10002) {
      AUTH.login(this)
      return
    }
    if (res.code == 0) {
      wx.showToast({
        title: '绑定成功',
        icon: 'success',
        duration: 2000
      })
      this.getUserApiInfo();
    } else {
      wx.showModal({
        title: '提示',
        content: res.msg,
        showCancel: false
      })
    }
  },
  async getUserApiInfo() {
    const res = await WXAPI.userDetail(wx.getStorageSync('token'))
    if (res.code == 0) {
      let _data = {}
      _data.apiUserInfoMap = res.data
      _data.nick = res.data.base.nick
      _data.avatarUrl = res.data.base.avatarUrl
      if (!res.data.base.gender) {
        _data.gender = '未知'
      }
      if (res.data.base.gender == 1) {
        _data.gender = '男性'
      }
      if (res.data.base.gender == 2) {
        _data.gender = '女性'
      }
      
      this.setData(_data)
    }
  },
  async formSubmit(e) {
    console.log(e);
    const postData = {
      token: wx.getStorageSync('token'),
      nick: this.data.nick
    }
    if (this.data.avatarUrlTmpFile) {
      const res = await WXAPI.uploadFile(wx.getStorageSync('token'), this.data.avatarUrlTmpFile)
      if (res.code == 0) {
        postData.avatarUrl = res.data.url
      }
    }
    if (this.data.genderIndex != -1) {
      postData.gender = this.data.genderIndex*1 + 1
    }
    postData.extJsonStr = JSON.stringify(e.detail.value)
    console.log(postData);
    const res = await WXAPI.modifyUserInfo(postData)
    if (res.code != 0) {
      wx.showToast({
        title: res.msg,
        icon: 'none'
      })
    }
    wx.showToast({
      title: '编辑成功',
    })
    setTimeout(() => {
      wx.navigateBack({
        delta: 0,
      })
    }, 1000);
  },
  chooseImage() {
    const _this = this
    wx.chooseImage({
      count: 1,
      success (res) {
        _this.setData({
          avatarUrl: res.tempFilePaths[0],
          avatarUrlTmpFile: res.tempFilePaths[0]
        })
      }
    })
  },
  bindPickerChange: function(e) {
    this.setData({
      genderIndex: e.detail.value,
      gender: this.data.genderArray[e.detail.value]
    })
  },
})