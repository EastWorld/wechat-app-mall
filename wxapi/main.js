// 小程序开发api接口工具包，https://github.com/gooking/wxapi
const CONFIG = require('./config.js')
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
        reject(error)
      },
      complete(aaa) {
        // 加载完成
      }
    })
  })
}

/**
 * 小程序的promise没有finally方法，自己扩展下
 */
Promise.prototype.finally = function (callback) {
  var Promise = this.constructor;
  return this.then(
    function (value) {
      Promise.resolve(callback()).then(
        function () {
          return value;
        }
      );
    },
    function (reason) {
      Promise.resolve(callback()).then(
        function () {
          throw reason;
        }
      );
    }
  );
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
  scoreSign: (token) => {
    return request('/score/sign', true, 'post', {
      token
    })
  },
  scoreSignLogs: (data) => {
    return request('/score/sign/logs', true, 'post', data)
  },
  scoreTodaySignedInfo: (token) => {
    return request('/score/today-signed', true, 'get', {
      token
    })
  },
  scoreExchange: (number, token) => {
    return request('/score/exchange', true, 'post', {
      number,
      token
    })
  },
  scoreLogs: (data) => {
    return request('/score/logs', true, 'post', data)
  },
  kanjiaList: (data) => {
    return request('/shop/goods/kanjia/list', true, 'post', data)
  },
  kanjiaJoin: (kjid, token) => {
    return request('/shop/goods/kanjia/join', true, 'post', {
      kjid,
      token
    })
  },
  kanjiaDetail: (kjid, joiner) => {
    return request('/shop/goods/kanjia/info', true, 'get', {
      kjid,
      joiner
    })
  },
  kanjiaHelp: (kjid, joiner, token, remark) => {
    return request('/shop/goods/kanjia/help', true, 'post', {
      kjid,
      joinerUser: joiner,
      token,
      remark
    })
  },
  kanjiaHelpDetail: (kjid, joiner, token) => {
    return request('/shop/goods/kanjia/myHelp', true, 'get', {
      kjid,
      joinerUser: joiner,
      token
    })
  },
  checkToken: (token) => {
    return request('/user/check-token', true, 'get', {
      token
    })
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
  alipay: (data) => {
    return request('/pay/alipay/semiAutomatic/payurl', true, 'post', data)
  },
  login: (code) => {
    return request('/user/wxapp/login', true, 'post', {
      code,
      type: 2
    })
  },
  register: (data) => {
    return request('/user/wxapp/register/complex', true, 'post', data)
  },
  banners: (data) => {
    return request('/banner/list', true, 'get', data)
  },
  goodsCategory: () => {
    return request('/shop/goods/category/all', true, 'get')
  },
  goods: (data) => {
    return request('/shop/goods/list', true, 'post', data)
  },
  goodsDetail: (id) => {
    return request('/shop/goods/detail', true, 'get', {
      id
    })
  },
  goodsPrice: (data) => {
    return request('/shop/goods/price', true, 'post', data)
  },
  goodsReputation: (data) => {
    return request('/shop/goods/reputation', true, 'post', data)
  },
  coupons: (data) => {
    return request('/discounts/coupons', true, 'get', data)
  },
  couponDetail: (id) => {
    return request('/discounts/detail', true, 'get', {
      id
    })
  },
  myCoupons: (data) => {
    return request('/discounts/my', true, 'get', data)
  },
  fetchCoupons: (data) => {
    return request('/discounts/fetch', true, 'post', data)
  },
  noticeList: (data) => {
    return request('/notice/list', true, 'post', data)
  },
  noticeDetail: (id) => {
    return request('/notice/detail', true, 'get', {
      id
    })
  },
  addAddress: (data) => {
    return request('/user/shipping-address/add', true, 'post', data)
  },
  updateAddress: (data) => {
    return request('/user/shipping-address/update', true, 'post', data)
  },
  deleteAddress: (id, token) => {
    return request('/user/shipping-address/delete', true, 'post', {
      id,
      token
    })
  },
  queryAddress: (token) => {
    return request('/user/shipping-address/list', true, 'get', {
      token
    })
  },
  defaultAddress: (token) => {
    return request('/user/shipping-address/default', true, 'get', {
      token
    })
  },
  addressDetail: (id, token) => {
    return request('/user/shipping-address/detail', true, 'get', {
      id,
      token
    })
  },
  pingtuanOpen: (goodsId, token) => {
    return request('/shop/goods/pingtuan/open', true, 'post', {
      goodsId,
      token
    })
  },
  pingtuanList: (goodsId) => {
    return request('/shop/goods/pingtuan/list', true, 'get', {
      goodsId
    })
  },
  videoDetail: (videoId) => {
    return request('/media/video/detail', true, 'get', {
      videoId
    })
  },
  bindMobile: (data) => {
    return request('/user/wxapp/bindMobile', true, 'post', data)
  },
  userDetail: (token) => {
    return request('/user/detail', true, 'get', {
      token
    })
  },
  userAmount: (token) => {
    return request('/user/amount', true, 'get', {
      token
    })
  },
  orderCreate: (data) => {
    return request('/order/create', true, 'post', data)
  },
  orderList: (data) => {
    return request('/order/list', true, 'post', data)
  },
  orderDetail: (id, token) => {
    return request('/order/detail', true, 'get', {
      id,
      token
    })
  },
  orderDelivery: (orderId, token) => {
    return request('/order/delivery', true, 'post', {
      orderId,
      token
    })
  },
  orderReputation: (data) => {
    return request('/order/reputation', true, 'post', data)
  },
  orderClose: (orderId, token) => {
    return request('/order/close', true, 'post', {
      orderId,
      token
    })
  },
  orderPay: (orderId, token) => {
    return request('/order/pay', true, 'post', {
      orderId,
      token
    })
  },
  orderStatistics: (token) => {
    return request('/order/statistics', true, 'get', {
      token
    })
  },
  withDrawApply: (money, token) => {
    return request('/user/withDraw/apply', true, 'post', {
      money,
      token
    })
  },
  province: () => {
    return request('/common/region/v2/province', false, 'get')
  },
  nextRegion: (pid) => {
    return request('/common/region/v2/child', false, 'get', {
      pid
    })
  },
  cashLogs: (data) => {
    return request('/user/cashLog', true, 'post', data)
  },
  rechargeSendRules: () => {
    return request('/user/recharge/send/rule', true, 'get')
  }
}
