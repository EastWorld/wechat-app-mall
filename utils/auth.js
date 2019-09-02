const WXAPI = require('../wxapi/main')

// 检测登录状态，返回 true / false
async function checkHasLogined() {
  const token = wx.getStorageSync('token')
  if (!token) {
    return false
  }
  wx.checkSession({
    fail() {
      return false
    }
  })
  const checkTokenRes = await WXAPI.checkToken(token)
  if (checkTokenRes.code != 0) {
    wx.removeStorageSync('token')
    return false
  }
  return true
}

async function login(page){
  const _this = this
  wx.login({
    success: function (res) {
      WXAPI.login(res.code).then(function (res) {
        if (res.code == 10000) {
          // 去注册
          _this.register(page)
          return;
        }
        if (res.code != 0) {
          // 登录错误
          wx.showModal({
            title: '错误',
            content: '无法登录，请重试:' + res.msg,
            showCancel: false
          })
          return;
        }
        wx.setStorageSync('token', res.data.token)
        wx.setStorageSync('uid', res.data.uid)
        if ( page ) {
          page.onShow()
        }
      })
    }
  })
}

async function register(page) {
  let _this = this;
  wx.login({
    success: function (res) {
      let code = res.code; // 微信登录接口返回的 code 参数，下面注册接口需要用到
      wx.getUserInfo({
        success: function (res) {
          let iv = res.iv;
          let encryptedData = res.encryptedData;
          let referrer = '' // 推荐人
          let referrer_storge = wx.getStorageSync('referrer');
          if (referrer_storge) {
            referrer = referrer_storge;
          }
          // 下面开始调用注册接口
          WXAPI.register({
            code: code,
            encryptedData: encryptedData,
            iv: iv,
            referrer: referrer
          }).then(function (res) {
            _this.login(page);
          })
        }
      })
    }
  })
}

function loginOut(){
  wx.removeStorageSync('token')
  wx.removeStorageSync('uid')
  wx.removeStorageSync('userInfo')
}

module.exports = {
  checkHasLogined: checkHasLogined,
  login: login,
  register: register,
  loginOut: loginOut
}