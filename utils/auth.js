const WXAPI = require('apifm-wxapi')
const CONFIG = require('../config.js')
async function checkSession(){
  return new Promise((resolve, reject) => {
    wx.checkSession({
      success() {
        return resolve(true)
      },
      fail() {
        return resolve(false)
      }
    })
  })
}

async function bindSeller() {
  const token = wx.getStorageSync('token')
  const referrer = wx.getStorageSync('referrer')
  if (!token) {
    return
  }
  if (!referrer) {
    return
  }
  const res = await WXAPI.bindSeller({
    token,
    uid: referrer
  })
}

// 检测登录状态，返回 true / false
async function checkHasLogined() {
  const token = wx.getStorageSync('token')
  if (!token) {
    return false
  }
  const loggined = await checkSession()
  if (!loggined) {
    wx.removeStorageSync('token')
    return false
  }
  const checkTokenRes = await WXAPI.checkToken(token)
  if (checkTokenRes.code != 0) {
    wx.removeStorageSync('token')
    return false
  }
  return true
}

async function wxaCode(){
  return new Promise((resolve, reject) => {
    wx.login({
      success(res) {
        return resolve(res.code)
      },
      fail() {
        wx.showToast({
          title: '获取code失败',
          icon: 'none'
        })
        return resolve('获取code失败')
      }
    })
  })
}

async function login(page){
  const _this = this
  wx.login({
    success: function (res) {
      const extConfigSync = wx.getExtConfigSync()
      if (extConfigSync.subDomain) {
        WXAPI.wxappServiceLogin({
          code: res.code
        }).then(function (res) {        
          if (res.code == 10000) {
            // 去注册
            return;
          }
          if (res.code != 0) {
            // 登录错误
            wx.showModal({
              title: '无法登录',
              content: res.msg,
              showCancel: false
            })
            return;
          }
          wx.setStorageSync('token', res.data.token)
          wx.setStorageSync('uid', res.data.uid)
          if (CONFIG.bindSeller) {
            _this.bindSeller()
          }
          if ( page ) {
            page.onShow()
          }
        })
      } else {
        WXAPI.login_wx(res.code).then(function (res) {        
          if (res.code == 10000) {
            // 去注册
            return;
          }
          if (res.code != 0) {
            // 登录错误
            wx.showModal({
              title: '无法登录',
              content: res.msg,
              showCancel: false
            })
            return;
          }
          wx.setStorageSync('token', res.data.token)
          wx.setStorageSync('uid', res.data.uid)
          if (CONFIG.bindSeller) {
            _this.bindSeller()
          }
          if ( page ) {
            page.onShow()
          }
        })
      }
    }
  })
}

async function authorize() {
  // const code = await wxaCode()
  // const resLogin = await WXAPI.login_wx(code)
  // if (resLogin.code == 0) {
  //   wx.setStorageSync('token', resLogin.data.token)
  //   wx.setStorageSync('uid', resLogin.data.uid)
  //   return resLogin
  // }
  return new Promise((resolve, reject) => {
    wx.login({
      success: function (res) {
        const code = res.code
        let referrer = '' // 推荐人
        let referrer_storge = wx.getStorageSync('referrer');
        if (referrer_storge) {
          referrer = referrer_storge;
        }
        // 下面开始调用注册接口
        const extConfigSync = wx.getExtConfigSync()
        if (extConfigSync.subDomain) {
          WXAPI.wxappServiceAuthorize({
            code: code,
            referrer: referrer
          }).then(function (res) {
            if (res.code == 0) {
              wx.setStorageSync('token', res.data.token)
              wx.setStorageSync('uid', res.data.uid)
              resolve(res)
            } else {
              wx.showToast({
                title: res.msg,
                icon: 'none'
              })
              reject(res.msg)
            }
          })
        } else {
          WXAPI.authorize({
            code: code,
            referrer: referrer
          }).then(function (res) {
            if (res.code == 0) {
              wx.setStorageSync('token', res.data.token)
              wx.setStorageSync('uid', res.data.uid)
              resolve(res)
            } else {
              wx.showToast({
                title: res.msg,
                icon: 'none'
              })
              reject(res.msg)
            }
          })
        }
      },
      fail: err => {
        reject(err)
      }
    })
  })
}

// 最新的登陆接口，建议用这个
async function login20241025() {
  const code = await wxaCode()
  const extConfigSync = wx.getExtConfigSync()
  if (extConfigSync.subDomain) {
    // 服务商模式
    const res = await WXAPI.wxappServiceLogin({ code })
    if (res.code == 10000) {
      // 去注册
      return res
    }
    if (res.code != 0) {
      // 登录错误
      wx.showModal({
        content: res.msg,
        showCancel: false
      })
      return res
    }
    wx.setStorageSync('token', res.data.token)
    wx.setStorageSync('uid', res.data.uid)
    wx.setStorageSync('openid', res.data.openid)
    wx.setStorageSync('mobile', res.data.mobile)
    if (CONFIG.bindSeller) {
      this.bindSeller()
    }
    return res
  } else {
    // 非服务商模式
    const res = await WXAPI.login_wx(code)
    if (res.code == 10000) {
      // 去注册
      return res;
    }
    if (res.code != 0) {
      // 登录错误
      wx.showModal({
        content: res.msg,
        showCancel: false
      })
      return res;
    }
    wx.setStorageSync('token', res.data.token)
    wx.setStorageSync('uid', res.data.uid)
    wx.setStorageSync('openid', res.data.openid)
    wx.setStorageSync('mobile', res.data.mobile)
    if (CONFIG.bindSeller) {
      this.bindSeller()
    }
    return res
  }
}

function loginOut(){
  wx.removeStorageSync('token')
  wx.removeStorageSync('uid')
  wx.removeStorageSync('openid')
  wx.removeStorageSync('mobile')
}

async function checkAndAuthorize (scope) {
  return new Promise((resolve, reject) => {
    wx.getSetting({
      success(res) {
        if (!res.authSetting[scope]) {
          wx.authorize({
            scope: scope,
            success() {
              resolve() // 无返回参数
            },
            fail(e){
              console.error(e)
              // if (e.errMsg.indexof('auth deny') != -1) {
              //   wx.showToast({
              //     title: e.errMsg,
              //     icon: 'none'
              //   })
              // }
              wx.showModal({
                title: '无权操作',
                content: '需要获得您的授权',
                showCancel: false,
                confirmText: '立即授权',
                confirmColor: '#e64340',
                success(res) {
                  wx.openSetting();
                },
                fail(e){
                  console.error(e)
                  reject(e)
                },
              })
            }
          })
        } else {
          resolve() // 无返回参数
        }
      },
      fail(e){
        console.error(e)
        reject(e)
      }
    })
  })  
}

module.exports = {
  checkHasLogined: checkHasLogined,
  wxaCode: wxaCode,
  login: login,
  login20241025: login20241025,
  loginOut: loginOut,
  checkAndAuthorize: checkAndAuthorize,
  authorize: authorize,
  bindSeller: bindSeller
}