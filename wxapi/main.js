// 小程序开发api接口工具包，https://github.com/gooking/wxapi
const CONFIG = require('config.js')
const API_BASE_URL = 'https://api.it120.cc'

const request = (url, needSubDomain, method, data) => {
  let _url = API_BASE_URL + (needSubDomain ? '/' + CONFIG.subDomain : '') + url
  return new Promise((resolve, reject) => {
    wx.request({
      url: _url,
      method: method,
      data: data,
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success(request) {
        resolve(request.data)
      },
      fail(error) {
        reject(error.data)
      },
      complete(aaa) {
        // 加载完成
      }
    })
  })
}

module.exports = {
  request,
  queryMobileLocation: (data) => {
    return request('/common/mobile-segment/location', false, 'get', data)
  },
  queryConfig: (data) => {
    return request('/config/get-value', true, 'get', data)
  },
  scoreRules: (data) => {
    return request('/score/send/rule', true, 'post', data)
  },
  kanjiaList: (data) => {
    return request('/shop/goods/kanjia/list', true, 'post', data)
  },
  checkToken: (token) => {
    return request('/user/check-token', true, 'get', { token })
  },
  addTempleMsgFormid: (data) => {
    return request('/template-msg/wxa/formId', true, 'post', data)
  },
  sendTempleMsg: (data) => {
    return request('/template-msg/put', true, 'post', data)
  },
  wxpay: (data) => {
    return request('/pay/wx/wxapp', true, 'post', data)
  },
  login: (code) => {
    return request('/user/wxapp/login', true, 'post', { code, type:2 })
  },
  register: (data) => {
    return request('/user/wxapp/register/complex', true, 'post', data)
  }
}