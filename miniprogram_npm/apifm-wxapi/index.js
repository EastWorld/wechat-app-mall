module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/* eslint-disable */
// 小程序开发api接口工具包，https://github.com/gooking/wxapi
var API_BASE_URL = 'https://api.it120.cc';
// var API_BASE_URL = 'http://127.0.0.1:8081';
var subDomain = '-';
var merchantId = '0';

var request = function request(url, needSubDomain, method, data) {
  var _url = API_BASE_URL + (needSubDomain ? '/' + subDomain : '') + url;
  var header = {
    'Content-Type': 'application/x-www-form-urlencoded'
  };
  return new Promise(function (resolve, reject) {
    wx.request({
      url: _url,
      method: method,
      data: data,
      header: header,
      success: function success(request) {
        resolve(request.data);
      },
      fail: function fail(error) {
        reject(error);
      },
      complete: function complete(aaa) {
        // 加载完成
      }
    });
  });
};

/**
 * 小程序的promise没有finally方法，自己扩展下
 */
// Promise.prototype.finally = function (callback) {
//   var Promise = this.constructor;
//   return this.then(
//     function (value) {
//       Promise.resolve(callback()).then(
//         function () {
//           return value;
//         }
//       );
//     },
//     function (reason) {
//       Promise.resolve(callback()).then(
//         function () {
//           throw reason;
//         }
//       );
//     }
//   );
// }

module.exports = {
  init2: function init2(a, b) {
    API_BASE_URL = a;
    subDomain = b;
  },
  init: function init(b) {
    subDomain = b;
  },
  setMerchantId: function setMerchantId(mchid) {
    merchantId = mchid;
  },
  init3: function init3(_ref) {
    var _ref$apiBaseUrl = _ref.apiBaseUrl,
        apiBaseUrl = _ref$apiBaseUrl === undefined ? API_BASE_URL : _ref$apiBaseUrl,
        subD = _ref.subDomain,
        req = _ref.request;

    // 某些需求需要定制化 request，需要保证传入自定义 reuqest 与默认 request 参数一致
    if (req) {
      request = req;
    }
    API_BASE_URL = apiBaseUrl;
    subDomain = subD;
  },
  request: request,
  queryMobileLocation: function queryMobileLocation() {
    var mobile = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

    return request('/common/mobile-segment/location', false, 'get', { mobile: mobile });
  },
  nextMobileSegment: function nextMobileSegment(data) {
    return request('/common/mobile-segment/next', false, 'post', data);
  },
  gpsDistance: function gpsDistance(data) {
    return request('/common/map/qq/distance', false, 'post', data);
  },
  commonIP: function commonIP(ip) {
    return request('/common/ip', false, 'get', { ip: ip });
  },
  forexRate: function forexRate(fromCode, toCode) {
    return request('/forex/rate', true, 'get', { fromCode: fromCode, toCode: toCode });
  },
  queryConfigValue: function queryConfigValue(key) {
    return request('/config/value', true, 'get', { key: key });
  },
  queryConfigBatch: function queryConfigBatch(keys) {
    return request('/config/values', true, 'get', { keys: keys });
  },
  scoreRules: function scoreRules(data) {
    return request('/score/send/rule', true, 'post', data);
  },
  scoreSignRules: function scoreSignRules() {
    return request('/score/sign/rules', true, 'get', {});
  },
  scoreSign: function scoreSign(token) {
    return request('/score/sign', true, 'post', {
      token: token
    });
  },
  scoreSignLogs: function scoreSignLogs(data) {
    return request('/score/sign/logs', true, 'post', data);
  },
  scoreTodaySignedInfo: function scoreTodaySignedInfo(token) {
    return request('/score/today-signed', true, 'get', {
      token: token
    });
  },
  scoreExchange: function scoreExchange(token, number) {
    return request('/score/exchange', true, 'post', {
      number: number,
      token: token
    });
  },
  scoreExchangeCash: function scoreExchangeCash(token, deductionScore) {
    return request('/score/exchange/cash', true, 'post', {
      deductionScore: deductionScore,
      token: token
    });
  },
  scoreLogs: function scoreLogs(data) {
    return request('/score/logs', true, 'post', data);
  },
  shareGroupGetScore: function shareGroupGetScore(code, referrer, encryptedData, iv) {
    return request('/score/share/wxa/group', true, 'post', {
      code: code,
      referrer: referrer,
      encryptedData: encryptedData,
      iv: iv
    });
  },
  scoreDeductionRules: function scoreDeductionRules() {
    var type = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

    return request('/score/deduction/rules', true, 'get', { type: type });
  },
  scoreTaskList: function scoreTaskList(token) {
    return request('/score/taskList', true, 'get', { token: token });
  },
  scoreTaskSuccess: function scoreTaskSuccess(token, type) {
    return request('/score/taskSuccess', true, 'post', { token: token, type: type });
  },
  kanjiaSet: function kanjiaSet(goodsId) {
    return request('/shop/goods/kanjia/set/v2', true, 'get', { goodsId: goodsId });
  },
  kanjiaJoin: function kanjiaJoin(token, kjid) {
    return request('/shop/goods/kanjia/join', true, 'post', {
      kjid: kjid,
      token: token
    });
  },
  kanjiaDetail: function kanjiaDetail(kjid, joiner) {
    return request('/shop/goods/kanjia/info', true, 'get', {
      kjid: kjid,
      joiner: joiner
    });
  },
  kanjiaHelp: function kanjiaHelp(token, kjid, joiner) {
    var remark = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : '';

    return request('/shop/goods/kanjia/help', true, 'post', {
      kjid: kjid,
      joinerUser: joiner,
      token: token,
      remark: remark
    });
  },
  kanjiaClear: function kanjiaClear(token, kjid) {
    return request('/shop/goods/kanjia/clear', true, 'post', {
      kjid: kjid,
      token: token
    });
  },
  kanjiaMyJoinInfo: function kanjiaMyJoinInfo(token, kjid) {
    return request('/shop/goods/kanjia/my', true, 'get', {
      kjid: kjid,
      token: token
    });
  },
  kanjiaHelpDetail: function kanjiaHelpDetail(token, kjid, joiner) {
    return request('/shop/goods/kanjia/myHelp', true, 'get', {
      kjid: kjid,
      joinerUser: joiner,
      token: token
    });
  },
  checkToken: function checkToken(token) {
    return request('/user/check-token', true, 'get', {
      token: token
    });
  },
  checkReferrer: function checkReferrer(referrer) {
    return request('/user/check-referrer', true, 'get', {
      referrer: referrer
    });
  },
  addTempleMsgFormid: function addTempleMsgFormid(token, type, formId) {
    return request('/template-msg/wxa/formId', true, 'post', {
      token: token, type: type, formId: formId
    });
  },
  sendTempleMsg: function sendTempleMsg(data) {
    return request('/template-msg/put', true, 'post', data);
  },
  payVariableUrl: function payVariableUrl(url, data) {
    return request(url, true, 'post', data);
  },
  wxpay: function wxpay(data) {
    return request('/pay/wx/wxapp', true, 'post', data);
  },
  wxpayH5: function wxpayH5(data) {
    return request('/pay/wx/h5', true, 'post', data);
  },
  wxpayJsapi: function wxpayJsapi(data) {
    return request('/pay/wx/jsapi', true, 'post', data);
  },
  wxpayQrcode: function wxpayQrcode(data) {
    return request('/pay/wx/qrcode', true, 'post', data);
  },
  wxpayCode: function wxpayCode(data) {
    return request('/pay/wx/paymentCode', true, 'post', data);
  },
  wxpayApp: function wxpayApp(data) {
    return request('/pay/wx/app', true, 'post', data);
  },
  wxpayFOMO: function wxpayFOMO(data) {
    return request('/pay/fomo/wxapp', true, 'post', data);
  },
  payNow: function payNow(data) {
    return request('/pay/fomo/payNow', true, 'post', data);
  },
  fomoCheckout: function fomoCheckout(data) {
    return request('/pay/fomo/checkout', true, 'post', data);
  },
  wxpayFWS: function wxpayFWS(data) {
    return request('/pay/wxfws/wxapp', true, 'post', data);
  },
  ttpay: function ttpay(data) {
    return request('/pay/tt/microapp', true, 'post', data);
  },
  ttEcpay: function ttEcpay(data) {
    return request('/pay/tt/ecpay', true, 'post', data);
  },
  payQuery: function payQuery(token, outTradeId) {
    return request('/pay/query', true, 'get', { token: token, outTradeId: outTradeId });
  },
  wxpaySaobei: function wxpaySaobei(data) {
    return request('/pay/lcsw/wxapp', true, 'post', data);
  },
  wxpayWepayez: function wxpayWepayez(data) {
    return request('/pay/wepayez/wxapp', true, 'post', data);
  },
  wxpayxpert: function wxpayxpert(data) {
    return request('/pay/payxpert/wxapp', true, 'post', data);
  },
  wxpayIPaynow: function wxpayIPaynow(data) {
    return request('/pay/ipaynow/wxapp', true, 'post', data);
  },
  wxpayAirwallex: function wxpayAirwallex(data) {
    return request('/pay/airwallex/wxapp', true, 'post', data);
  },
  wxSphGetpaymentparams: function wxSphGetpaymentparams(token, orderId) {
    return request('/pay/wxsph/getpaymentparams', true, 'post', { token: token, orderId: orderId });
  },
  paypalCheckout: function paypalCheckout(data) {
    return request('/pay/paypal/checkout', true, 'post', data);
  },
  alipay: function alipay(data) {
    return request('/pay/alipay/semiAutomatic/payurl', true, 'post', data);
  },
  alipayMP: function alipayMP(data) {
    return request('/pay/alipay/gate/mp', true, 'post', data);
  },
  alipayAPP: function alipayAPP(data) {
    return request('/pay/alipay/gate/app', true, 'post', data);
  },
  alipayQrcode: function alipayQrcode(data) {
    return request('/pay/alipay/gate/qrcode', true, 'post', data);
  },
  alipayQrcode2: function alipayQrcode2(data) {
    return request('/pay/alipay/gate/paymentCode', true, 'post', data);
  },
  kasipayH5: function kasipayH5(data) {
    return request('/pay/kasipay/h5', true, 'post', data);
  },
  hmpayJsapi: function hmpayJsapi(data) {
    return request('/pay/sandpay/hmpay/jsapi', true, 'post', data);
  },
  login_wx: function login_wx(code) {
    return request('/user/wxapp/login', true, 'post', {
      code: code,
      type: 2
    });
  },
  loginWxV2: function loginWxV2(code, appid) {
    return request('/user/wxapp/login/v2', true, 'post', {
      code: code,
      appid: appid
    });
  },
  login_tt: function login_tt(code) {
    return request('/user/tt/microapp/login', true, 'post', {
      code: code
    });
  },
  login_q: function login_q(code) {
    return request('/user/q/login', true, 'post', {
      code: code,
      type: 2
    });
  },
  loginWxaMobile: function loginWxaMobile(code, encryptedData, iv) {
    return request('/user/wxapp/login/mobile', true, 'post', {
      code: code,
      encryptedData: encryptedData,
      iv: iv
    });
  },
  loginWxaMobileV2: function loginWxaMobileV2(data) {
    return request('/user/wxapp/login/mobile', true, 'post', data);
  },
  loginWxaMobileV3: function loginWxaMobileV3(data) {
    return request('/user/wxapp/login/mobile/v2', true, 'post', data);
  },
  fetchWxaMobile: function fetchWxaMobile(code) {
    return request('/user/wxapp/getMobile', true, 'get', { code: code });
  },
  login_username: function login_username(data) {
    return request('/user/username/login', true, 'post', data);
  },
  bindUsername: function bindUsername(token, username) {
    var pwd = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';

    return request('/user/username/bindUsername', true, 'post', {
      token: token, username: username, pwd: pwd
    });
  },
  login_mobile: function login_mobile(mobile, pwd) {
    var deviceId = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';
    var deviceName = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : '';

    return request('/user/m/login', true, 'post', {
      mobile: mobile, pwd: pwd, deviceId: deviceId, deviceName: deviceName
    });
  },
  loginMobileV2: function loginMobileV2(data) {
    return request('/user/m/login', true, 'post', data);
  },
  loginMobileSmsCode: function loginMobileSmsCode(data) {
    return request('/user/m/loginMobile', true, 'post', data);
  },
  resetPwdUseMobileCode: function resetPwdUseMobileCode(mobile, pwd, code) {
    return request('/user/m/reset-pwd', true, 'post', {
      mobile: mobile, pwd: pwd, code: code
    });
  },
  resetPwdUseEmailCode: function resetPwdUseEmailCode(email, pwd, code) {
    return request('/user/email/reset-pwd', true, 'post', {
      email: email, pwd: pwd, code: code
    });
  },
  wxmpAuth: function wxmpAuth(data) {
    return request('/user/wxmp/auth', true, 'post', data);
  },
  register_complex: function register_complex(data) {
    return request('/user/wxapp/register/complex', true, 'post', data);
  },
  register_tt: function register_tt(data) {
    return request('/user/tt/microapp/register', true, 'post', data);
  },
  registerQ: function registerQ(data) {
    return request('/user/q/register', true, 'post', data);
  },
  qqAuthorize: function qqAuthorize(data) {
    return request('/user/q/authorize', true, 'post', data);
  },
  qqQrcode: function qqQrcode(content) {
    return request('/user/q/qrcode', true, 'post', { content: content });
  },
  register_simple: function register_simple(data) {
    return request('/user/wxapp/register/simple', true, 'post', data);
  },
  authorize: function authorize(data) {
    return request('/user/wxapp/authorize', true, 'post', data);
  },
  ttAuthorize: function ttAuthorize(data) {
    return request('/user/tt/microapp/authorize', true, 'post', data);
  },
  register_username: function register_username(data) {
    return request('/user/username/register', true, 'post', data);
  },
  register_mobile: function register_mobile(data) {
    return request('/user/m/register', true, 'post', data);
  },
  bannerTypes: function bannerTypes() {
    return request('/banner/types', true, 'get');
  },
  banners: function banners(data) {
    return request('/banner/list', true, 'get', data);
  },
  goodsCategory: function goodsCategory() {
    return request('/shop/goods/category/all', true, 'get');
  },
  goodsCategoryV2: function goodsCategoryV2() {
    var shopId = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

    return request('/shop/goods/category/all', true, 'get', { shopId: shopId });
  },
  goodsCategoryDetail: function goodsCategoryDetail(id) {
    return request('/shop/goods/category/info', true, 'get', { id: id });
  },
  goods: function goods(data) {
    if (!data) {
      data = {};
    }
    var shopIds = wx.getStorageSync('shopIds');
    if (shopIds) {
      data.shopId = shopIds;
    }
    return request('/shop/goods/list', true, 'post', data);
  },
  goodsv2: function goodsv2(data) {
    if (!data) {
      data = {};
    }
    var shopIds = wx.getStorageSync('shopIds');
    if (shopIds) {
      data.shopId = shopIds;
    }
    return request('/shop/goods/list/v2', true, 'post', data);
  },
  goodsDetail: function goodsDetail(id) {
    var token = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';

    return request('/shop/goods/detail', true, 'get', {
      id: id, token: token
    });
  },
  goodsDetailV2: function goodsDetailV2(data) {
    return request('/shop/goods/detail', true, 'get', data);
  },
  goodsLimitations: function goodsLimitations(goodsId) {
    var priceId = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';

    return request('/shop/goods/limitation', true, 'get', {
      goodsId: goodsId, priceId: priceId
    });
  },
  goodsLimitationsV2: function goodsLimitationsV2(goodsId) {
    var propertyChildIds = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';

    return request('/shop/goods/limitation', true, 'get', {
      goodsId: goodsId, propertyChildIds: propertyChildIds
    });
  },
  goodsAddition: function goodsAddition(goodsId) {
    return request('/shop/goods/goodsAddition', true, 'get', {
      goodsId: goodsId
    });
  },
  goodsVideoEpisodesList: function goodsVideoEpisodesList(goodsId) {
    var token = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';

    return request('/goodsVideoEpisodes/list', true, 'get', {
      goodsId: goodsId, token: token
    });
  },
  goodsVideoEpisodesBuy: function goodsVideoEpisodesBuy(goodsId, number, token) {
    return request('/goodsVideoEpisodes/buy', true, 'post', {
      goodsId: goodsId, number: number, token: token
    });
  },
  goodsStatistics: function goodsStatistics(data) {
    return request('/shop/goods/statistics/days', true, 'post', data);
  },
  goodsUseless: function goodsUseless(data) {
    return request('/shop/goods/useful', true, 'post', data);
  },
  pushNewGoods: function pushNewGoods(data) {
    return request('/shop/goods/putOrUpdate', true, 'post', data);
  },
  deleteMyGoods: function deleteMyGoods(token, id) {
    return request('/shop/goods/del', true, 'post', { token: token, id: id });
  },
  goodsPrice: function goodsPrice(goodsId, propertyChildIds) {
    return request('/shop/goods/price', true, 'post', {
      goodsId: goodsId, propertyChildIds: propertyChildIds
    });
  },
  goodsPriceV2: function goodsPriceV2(data) {
    return request('/shop/goods/price', true, 'post', data);
  },
  goodsPriceDaily: function goodsPriceDaily(goodsId) {
    var priceId = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';

    return request('/shop/goods/price/day', true, 'get', {
      goodsId: goodsId, priceId: priceId
    });
  },
  goodsPriceFreight: function goodsPriceFreight(data) {
    return request('/shop/goods/price/freight', true, 'get', data);
  },
  goodsRebate: function goodsRebate(token, goodsId) {
    return request('/shop/goods/rebate/v2', true, 'get', {
      token: token, goodsId: goodsId
    });
  },
  goodsReputation: function goodsReputation(data) {
    return request('/shop/goods/reputation', true, 'post', data);
  },
  goodsReputationV2: function goodsReputationV2(data) {
    return request('/shop/goods/reputation/v2', true, 'post', data);
  },
  myBuyGoodsHis: function myBuyGoodsHis(data) {
    return request('/shop/goods/his/list', true, 'post', data);
  },
  myBuyGoodsHisDelete: function myBuyGoodsHisDelete(token) {
    var id = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
    var goodsId = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';

    return request('/shop/goods/his/delete', true, 'post', {
      token: token, id: id, goodsId: goodsId
    });
  },
  goodsFavList: function goodsFavList(data) {
    return request('/shop/goods/fav/list', true, 'post', data);
  },
  goodsFavListV2: function goodsFavListV2(data) {
    return request('/shop/goods/fav/list/v2', true, 'post', data);
  },
  goodsFavPut: function goodsFavPut(token, goodsId) {
    return request('/shop/goods/fav/add', true, 'post', {
      token: token, goodsId: goodsId
    });
  },
  goodsFavAdd: function goodsFavAdd(data) {
    return request('/shop/goods/fav/add', true, 'post', data);
  },
  goodsFavCheck: function goodsFavCheck(token, goodsId) {
    return request('/shop/goods/fav/check', true, 'get', {
      token: token, goodsId: goodsId
    });
  },
  goodsFavCheckV2: function goodsFavCheckV2(data) {
    return request('/shop/goods/fav/check', true, 'get', data);
  },
  goodsFavDelete: function goodsFavDelete(token) {
    var id = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
    var goodsId = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';

    return request('/shop/goods/fav/delete', true, 'post', {
      token: token, id: id, goodsId: goodsId
    });
  },
  goodsFavDeleteV2: function goodsFavDeleteV2(data) {
    return request('/shop/goods/fav/delete', true, 'post', data);
  },
  goodsSeckillGrab: function goodsSeckillGrab(token, goodsId, seconds) {
    return request('/goods/seckill/grab', true, 'post', { token: token, goodsId: goodsId, seconds: seconds });
  },
  coupons: function coupons(data) {
    return request('/discounts/coupons', true, 'get', data);
  },
  couponDetail: function couponDetail(id) {
    return request('/discounts/detail', true, 'get', {
      id: id
    });
  },
  couponStatistics: function couponStatistics(token) {
    return request('/discounts/statistics', true, 'get', { token: token });
  },
  myCoupons: function myCoupons(data) {
    return request('/discounts/my', true, 'get', data);
  },
  mergeCouponsRules: function mergeCouponsRules() {
    return request('/discounts/merge/list', true, 'get');
  },
  mergeCoupons: function mergeCoupons(data) {
    return request('/discounts/merge', true, 'post', data);
  },
  fetchCoupons: function fetchCoupons(data) {
    return request('/discounts/fetch', true, 'post', data);
  },
  sendCoupons: function sendCoupons(data) {
    return request('/discounts/send', true, 'post', data);
  },
  exchangeCoupons: function exchangeCoupons(token, number, pwd) {
    var extJsonStr = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : '';

    return request('/discounts/exchange', true, 'post', {
      token: token, number: number, pwd: pwd, extJsonStr: extJsonStr
    });
  },
  couponsShareOpen: function couponsShareOpen(token, id) {
    return request('/discounts/share/open', true, 'post', { token: token, id: id });
  },
  couponsShareClose: function couponsShareClose(token, id) {
    return request('/discounts/share/close', true, 'post', { token: token, id: id });
  },
  couponsShareFetch: function couponsShareFetch(token, id, shareToken) {
    return request('/discounts/share/fetch', true, 'post', { token: token, id: id, shareToken: shareToken });
  },
  noticeList: function noticeList(data) {
    return request('/notice/list', true, 'post', data);
  },
  noticeLastOne: function noticeLastOne() {
    var type = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

    return request('/notice/last-one', true, 'get', {
      type: type
    });
  },
  noticeDetail: function noticeDetail(id) {
    return request('/notice/detail', true, 'get', {
      id: id
    });
  },
  addAddress: function addAddress(data) {
    return request('/user/shipping-address/add', true, 'post', data);
  },
  updateAddress: function updateAddress(data) {
    return request('/user/shipping-address/update', true, 'post', data);
  },
  deleteAddress: function deleteAddress(token, id) {
    return request('/user/shipping-address/delete', true, 'post', {
      id: id,
      token: token
    });
  },
  queryAddress: function queryAddress(token) {
    return request('/user/shipping-address/list', true, 'get', {
      token: token
    });
  },
  queryAddressV2: function queryAddressV2(data) {
    return request('/user/shipping-address/list/v2', true, 'post', data);
  },
  defaultAddress: function defaultAddress(token) {
    return request('/user/shipping-address/default/v2', true, 'get', {
      token: token
    });
  },
  addressDetail: function addressDetail(token, id) {
    return request('/user/shipping-address/detail/v2', true, 'get', {
      id: id,
      token: token
    });
  },
  pingtuanSet: function pingtuanSet(goodsId) {
    return request('/shop/goods/pingtuan/set', true, 'get', {
      goodsId: goodsId
    });
  },
  pingtuanSets: function pingtuanSets(goodsIdArray) {
    return request('/shop/goods/pingtuan/sets', true, 'get', {
      goodsId: goodsIdArray.join()
    });
  },
  goodsDefaultPingtuan: function goodsDefaultPingtuan(goodsId) {
    return request('/shop/goods/pingtuan/default', true, 'get', {
      goodsId: goodsId
    });
  },
  pingtuanMultilevel: function pingtuanMultilevel(goodsId) {
    return request('/shop/goods/pingtuanMultilevel', true, 'get', {
      goodsId: goodsId
    });
  },
  pingtuanOpen: function pingtuanOpen(token, goodsId) {
    var extJsonStr = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';

    return request('/shop/goods/pingtuan/open', true, 'post', {
      goodsId: goodsId,
      token: token,
      extJsonStr: extJsonStr
    });
  },
  pingtuanTuanInfo: function pingtuanTuanInfo(tuanId) {
    return request('/shop/goods/pingtuan/tuanInfo', true, 'get', {
      tuanId: tuanId
    });
  },
  pingtuanList: function pingtuanList(data) {
    return request('/shop/goods/pingtuan/list/v2', true, 'post', data);
  },
  pingtuanJoinUsers: function pingtuanJoinUsers(tuanId) {
    return request('/shop/goods/pingtuan/joiner', true, 'get', { tuanId: tuanId });
  },
  pingtuanMyJoined: function pingtuanMyJoined(data) {
    return request('/shop/goods/pingtuan/my-join-list', true, 'post', data);
  },
  friendlyPartnerList: function friendlyPartnerList() {
    var type = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

    return request('/friendly-partner/list', true, 'post', {
      type: type
    });
  },
  friendList: function friendList(data) {
    return request('/user/friend/list', true, 'post', data);
  },
  addFriend: function addFriend(token, uid) {
    return request('/user/friend/add', true, 'post', { token: token, uid: uid });
  },
  deleteFriend: function deleteFriend(token, uid) {
    return request('/user/friend/delete', true, 'post', { token: token, uid: uid });
  },
  friendUserDetail: function friendUserDetail(token, uid) {
    return request('/user/friend/detail', true, 'get', { token: token, uid: uid });
  },
  userImList: function userImList(data) {
    return request('/userIm/list', true, 'post', data);
  },
  userImSendmessage: function userImSendmessage(token, uid, content) {
    return request('/userIm/sendmessage', true, 'post', { token: token, uid: uid, content: content });
  },
  userImEmpty: function userImEmpty(token, uid) {
    return request('/userIm/empty', true, 'post', { token: token, uid: uid });
  },
  videoDetail: function videoDetail(videoId) {
    return request('/media/video/detail', true, 'get', {
      videoId: videoId
    });
  },
  bindMobileWxa: function bindMobileWxa(token, encryptedData, iv) {
    var pwd = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : '';

    return request('/user/wxapp/bindMobile', true, 'post', {
      token: token, encryptedData: encryptedData, iv: iv, pwd: pwd
    });
  },
  bindMobileWxapp: function bindMobileWxapp(token, code, encryptedData, iv) {
    var pwd = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : '';

    return request('/user/wxapp/bindMobile', true, 'post', {
      token: token, code: code, encryptedData: encryptedData, iv: iv, pwd: pwd
    });
  },
  bindMobileWxappV2: function bindMobileWxappV2(token, code) {
    var pwd = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';

    return request('/user/wxapp/bindMobile/v2', true, 'post', {
      token: token, code: code, pwd: pwd
    });
  },
  bindMobileTta: function bindMobileTta(token, encryptedData, iv) {
    var pwd = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : '';

    return request('/user/tt/microapp/bindMobile', true, 'post', {
      token: token, encryptedData: encryptedData, iv: iv, pwd: pwd
    });
  },
  bindMobileSms: function bindMobileSms(token, mobile, code) {
    var pwd = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : '';

    return request('/user/m/bind-mobile', true, 'post', {
      token: token, mobile: mobile, code: code, pwd: pwd
    });
  },
  userDetail: function userDetail(token) {
    return request('/user/detail', true, 'get', {
      token: token
    });
  },
  userDetailSpreadUser: function userDetailSpreadUser(token, uid) {
    return request('/user/detail/spreadUser', true, 'get', {
      token: token, uid: uid
    });
  },
  userWxinfo: function userWxinfo(token) {
    return request('/user/wxinfo', true, 'get', {
      token: token
    });
  },
  userAliappInfo: function userAliappInfo(token) {
    return request('/user/aliappInfo', true, 'get', {
      token: token
    });
  },
  userAmount: function userAmount(token) {
    return request('/user/amount', true, 'get', {
      token: token
    });
  },
  orderCreate: function orderCreate(data) {
    return request('/order/create', true, 'post', data);
  },
  orderList: function orderList(data) {
    return request('/order/list', true, 'post', data);
  },
  orderDetail: function orderDetail(token, id) {
    var hxNumber = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';
    var peisongOrderId = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : '';

    return request('/order/detail', true, 'get', {
      id: id,
      token: token,
      hxNumber: hxNumber,
      peisongOrderId: peisongOrderId
    });
  },
  orderMtLocation: function orderMtLocation(id) {
    return request('/order/mtlocation', true, 'get', {
      id: id
    });
  },
  orderDelivery: function orderDelivery(token, orderId) {
    return request('/order/delivery', true, 'post', {
      orderId: orderId,
      token: token
    });
  },
  orderReputation: function orderReputation(data) {
    return request('/order/reputation', true, 'post', data);
  },
  orderReputationList: function orderReputationList(data) {
    return request('/order/listReputation', true, 'post', data);
  },
  orderClose: function orderClose(token, orderId) {
    return request('/order/close', true, 'post', {
      orderId: orderId,
      token: token
    });
  },
  orderDelete: function orderDelete(token, orderId) {
    return request('/order/delete', true, 'post', {
      orderId: orderId,
      token: token
    });
  },
  orderPay: function orderPay(token, orderId) {
    return request('/order/pay', true, 'post', {
      orderId: orderId,
      token: token
    });
  },
  jdjlOrderPay: function jdjlOrderPay(token, _token) {
    var couponId = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';

    return request('/jdjl/payOrder', true, 'post', {
      _token: _token,
      token: token,
      couponId: couponId
    });
  },
  orderHX: function orderHX(hxNumber) {
    return request('/order/hx', true, 'post', {
      hxNumber: hxNumber
    });
  },
  orderHXV2: function orderHXV2(data) {
    return request('/order/hx', true, 'post', data);
  },
  orderSet: function orderSet() {
    return request('/order/set', true, 'get');
  },
  orderRefunds: function orderRefunds(token, orderId) {
    return request('/order/refund', true, 'get', {
      token: token,
      orderId: orderId
    });
  },
  withDrawApply: function withDrawApply(token, money) {
    return request('/user/withDraw/apply', true, 'post', {
      money: money,
      token: token
    });
  },
  withDrawApplyV2: function withDrawApplyV2(data) {
    return request('/user/withDraw/apply', true, 'post', data);
  },
  withDrawDetail: function withDrawDetail(token, id) {
    return request('/user/withDraw/detail', true, 'get', {
      token: token,
      id: id
    });
  },
  withDrawLogs: function withDrawLogs(data) {
    return request('/user/withDraw/list', true, 'post', data);
  },
  withDrawSetting: function withDrawSetting() {
    return request('/user/withDraw/setting', true, 'get');
  },
  province: function province() {
    return request('/common/region/v2/province', false, 'get');
  },
  city: function city() {
    return request('/common/region/v2/city', false, 'get');
  },
  districts: function districts() {
    return request('/common/region/v2/districts', false, 'get');
  },
  streets: function streets() {
    return request('/common/region/v2/streets', false, 'get');
  },
  nextRegion: function nextRegion(pid) {
    return request('/common/region/v2/child', false, 'get', {
      pid: pid
    });
  },
  regionInfo: function regionInfo(id) {
    return request('/common/region/v2/info', false, 'get', {
      id: id
    });
  },
  regionSearch: function regionSearch(data) {
    return request('/common/region/v2/search', false, 'post', data);
  },
  cashLogs: function cashLogs(data) {
    return request('/user/cashLog', true, 'post', data);
  },
  cashLogsV2: function cashLogsV2(data) {
    return request('/user/cashLog/v2', true, 'post', data);
  },
  statisticsComingOut: function statisticsComingOut(data) {
    return request('/user/statisticsComingOut', true, 'post', data);
  },
  payLogs: function payLogs(data) {
    return request('/user/payLogs', true, 'post', data);
  },
  rechargeSendRules: function rechargeSendRules() {
    return request('/user/recharge/send/rule', true, 'get');
  },
  payBillDiscounts: function payBillDiscounts() {
    return request('/payBill/discounts', true, 'get');
  },
  payBill: function payBill(token, money) {
    var pwd = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';

    return request('/payBill/pay', true, 'post', { token: token, money: money, pwd: pwd });
  },
  payBillV2: function payBillV2(data) {
    return request('/payBill/pay', true, 'post', data);
  },
  vipLevel: function vipLevel() {
    return request('/config/vipLevel', true, 'get');
  },
  fxApply: function fxApply(token, name, mobile) {
    return request('/saleDistribution/apply', true, 'post', { token: token, name: name, mobile: mobile });
  },
  fxApplyV2: function fxApplyV2(data) {
    return request('/saleDistribution/apply/v2', true, 'post', data);
  },
  fxSetting: function fxSetting() {
    return request('/saleDistribution/setting', true, 'get');
  },
  fxBuy: function fxBuy(token) {
    return request('/saleDistribution/buy', true, 'post', { token: token });
  },
  fxApplyProgress: function fxApplyProgress(token) {
    return request('/saleDistribution/apply/progress', true, 'get', { token: token });
  },
  fxApplyProgressV2: function fxApplyProgressV2(token) {
    return request('/saleDistribution/apply/progress/v2', true, 'get', { token: token });
  },
  fxMembers: function fxMembers(data) {
    return request('/saleDistribution/members', true, 'post', data);
  },
  fxCommisionLog: function fxCommisionLog(data) {
    return request('/saleDistribution/commision/log', true, 'post', data);
  },
  fxCommisionFreezeAmount: function fxCommisionFreezeAmount(token) {
    return request('/saleDistribution/commission/freeze', true, 'get', { token: token });
  },
  fxSaleroomRankTotal: function fxSaleroomRankTotal(page, pageSize) {
    return request('/saleDistribution/sale-room-rank/total', true, 'get', {
      page: page, pageSize: pageSize
    });
  },
  fxSaleroomRankTotalTeam: function fxSaleroomRankTotalTeam(page, pageSize) {
    return request('/saleDistribution/sale-room-rank/team/total', true, 'get', {
      page: page, pageSize: pageSize
    });
  },
  fxSaleroomRankDaily: function fxSaleroomRankDaily(page, pageSize, day) {
    return request('/saleDistribution/sale-room-rank/daily', true, 'get', {
      page: page, pageSize: pageSize, day: day
    });
  },
  fxMembersStatistics: function fxMembersStatistics(token) {
    return request('/saleDistribution/members/statistics', true, 'get', { token: token });
  },
  fxMyCommisionStatistics: function fxMyCommisionStatistics(token, days) {
    return request('/saleDistribution/my/commision', true, 'get', { token: token, days: days });
  },
  fxGoods: function fxGoods(data) {
    return request('/saleDistribution/goods', true, 'post', data);
  },
  fxTeamReport: function fxTeamReport(data) {
    return request('/saleDistribution/team/report', true, 'post', data);
  },
  fxCities: function fxCities(token) {
    return request('/saleDistribution/city/list', true, 'get', { token: token });
  },
  fxCityReport: function fxCityReport(data) {
    return request('/saleDistribution/city/report', true, 'post', data);
  },
  goodsSellNumberStatistics: function goodsSellNumberStatistics(page, pageSize) {
    var goodsId = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';

    return request('/site/goods/statistics', true, 'get', {
      page: page, pageSize: pageSize, goodsId: goodsId
    });
  },
  wxaQrcode: function wxaQrcode(data) {
    return request('/qrcode/wxa/unlimit', true, 'post', data);
  },
  ttaQrcode: function ttaQrcode(paramsJson, expireHours) {
    return request('/user/tt/microapp/qrcode', true, 'post', {
      content: JSON.stringify(paramsJson),
      expireHours: expireHours
    });
  },
  commonQrcode: function commonQrcode(data) {
    return request('/qrcode/content', true, 'post', data);
  },
  uploadFile: function uploadFile(token, tempFilePath) {
    var expireHours = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';

    var uploadUrl = API_BASE_URL + '/' + subDomain + '/dfs/upload/file';
    return new Promise(function (resolve, reject) {
      wx.uploadFile({
        url: uploadUrl,
        filePath: tempFilePath,
        name: 'upfile',
        formData: {
          'token': token,
          expireHours: expireHours
        },
        success: function success(res) {
          resolve(JSON.parse(res.data));
        },
        fail: function fail(error) {
          reject(error);
        },
        complete: function complete(aaa) {
          // 加载完成
        }
      });
    });
  },
  uploadFileV2: function uploadFileV2(token, tempFilePath) {
    var expireHours = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';

    return new Promise(function (resolve, reject) {
      wx.uploadFile({
        url: 'https://oss.apifm.com/upload2',
        filePath: tempFilePath,
        name: 'upfile',
        formData: {
          token: token,
          subDomain: subDomain,
          expireHours: expireHours
        },
        success: function success(res) {
          resolve(JSON.parse(res.data));
        },
        fail: function fail(error) {
          reject(error);
        },
        complete: function complete(aaa) {
          // 加载完成
        }
      });
    });
  },
  uploadFileFromUrl: function uploadFileFromUrl() {
    var remoteFileUrl = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    var ext = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';

    return request('/dfs/upload/url', true, 'post', { remoteFileUrl: remoteFileUrl, ext: ext });
  },
  uploadFileList: function uploadFileList() {
    var path = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

    return request('/dfs/upload/list', true, 'post', { path: path });
  },
  uploadFileListV2: function uploadFileListV2(data) {
    return request('/dfs/upload/list/v2', true, 'post', data);
  },
  galleryList: function galleryList(data) {
    return request('/dfs/gallery', true, 'post', data);
  },
  refundApply: function refundApply(data) {
    return request('/order/refundApply/apply', true, 'post', data);
  },
  refundApplyDetail: function refundApplyDetail(token, orderId) {
    var orderGoodsId = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';

    return request('/order/refundApply/info', true, 'get', {
      token: token,
      orderId: orderId,
      orderGoodsId: orderGoodsId
    });
  },
  refundApplyCancel: function refundApplyCancel(token, orderId) {
    var orderGoodsId = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';

    return request('/order/refundApply/cancel', true, 'post', {
      token: token,
      orderId: orderId,
      orderGoodsId: orderGoodsId
    });
  },
  cmsCategories: function cmsCategories() {
    return request('/cms/category/list', true, 'get', {});
  },
  cmsCategoryDetail: function cmsCategoryDetail(id) {
    return request('/cms/category/info', true, 'get', { id: id });
  },
  cmsArticles: function cmsArticles(data) {
    return request('/cms/news/list', true, 'post', data);
  },
  cmsArticlesV2: function cmsArticlesV2(data) {
    return request('/cms/news/list/v2', true, 'post', data);
  },
  cmsArticleUsefulLogs: function cmsArticleUsefulLogs(data) {
    return request('/cms/news/useful/logs', true, 'post', data);
  },
  cmsArticleDetail: function cmsArticleDetail(id) {
    return request('/cms/news/detail', true, 'get', { id: id });
  },
  cmsArticleDetailV2: function cmsArticleDetailV2(id) {
    var token = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';

    return request('/cms/news/detail/v2', true, 'get', { id: id, token: token });
  },
  cmsArticlePreNext: function cmsArticlePreNext(id) {
    return request('/cms/news/preNext', true, 'get', { id: id });
  },
  cmsArticleCreate: function cmsArticleCreate(data) {
    return request('/cms/news/put', true, 'post', data);
  },
  cmsArticleDelete: function cmsArticleDelete(token, id) {
    return request('/cms/news/del', true, 'post', { token: token, id: id });
  },
  cmsArticleUseless: function cmsArticleUseless(data) {
    return request('/cms/news/useful', true, 'post', data);
  },
  cmsArticleModifyExtNumber: function cmsArticleModifyExtNumber(data) {
    return request('/cms/news/modifyExtNumber', true, 'post', data);
  },
  newsOwnerUserViewStatistics: function newsOwnerUserViewStatistics(data) {
    return request('/newsOwnerUserViewStatistics/list', true, 'post', data);
  },
  cmsPage: function cmsPage(key) {
    return request('/cms/page/info/v2', true, 'get', { key: key });
  },
  cmsTags: function cmsTags() {
    return request('/cms/tags/list', true, 'get', {});
  },
  cmsNewsSignUsers: function cmsNewsSignUsers(data) {
    return request('/newsSign/signUsers', true, 'post', data);
  },
  cmsNewsSignOnline: function cmsNewsSignOnline(data) {
    return request('/newsSign/signOnline', true, 'post', data);
  },
  cmsNewsSignOffline: function cmsNewsSignOffline(data) {
    return request('/newsSign/signOffline', true, 'post', data);
  },
  cmsNewsSignCheck: function cmsNewsSignCheck(token, newsId) {
    return request('/newsSign/check', true, 'get', { token: token, newsId: newsId });
  },
  invoiceList: function invoiceList(data) {
    return request('/invoice/list', true, 'post', data);
  },
  invoiceApply: function invoiceApply(data) {
    return request('/invoice/apply', true, 'post', data);
  },
  invoiceDetail: function invoiceDetail(token, id) {
    return request('/invoice/info', true, 'get', { token: token, id: id });
  },
  depositList: function depositList(data) {
    return request('/deposit/list', true, 'post', data);
  },
  payDeposit: function payDeposit(data) {
    return request('/deposit/pay', true, 'post', data);
  },
  depositInfo: function depositInfo(token, id) {
    return request('/deposit/info', true, 'get', { token: token, id: id });
  },
  depositBackApply: function depositBackApply(token, id) {
    return request('/deposit/back/apply', true, 'post', { token: token, id: id });
  },
  shopAreaCities: function shopAreaCities() {
    return request('/shopArea/cities', true, 'get');
  },
  shopAreaList: function shopAreaList(data) {
    return request('/shopArea/list', true, 'post', data);
  },
  shopAreaDetail: function shopAreaDetail(id) {
    return request('/shopArea/detail', true, 'get', { id: id });
  },
  fetchShopsCities: function fetchShopsCities() {
    return request('/shop/subshop/cities', true, 'get');
  },
  fetchShops: function fetchShops(data) {
    return request('/shop/subshop/list', true, 'post', data);
  },
  fetchMyShops: function fetchMyShops(token) {
    return request('/shop/subshop/my', true, 'get', { token: token });
  },
  shopSubdetail: function shopSubdetail(id) {
    return request('/shop/subshop/detail/v2', true, 'get', { id: id });
  },
  shopSubApply: function shopSubApply(data) {
    return request('/shop/subshop/apply', true, 'post', data);
  },
  pickPoints: function pickPoints(data) {
    return request('/shop/subshop/pickPoints', true, 'post', data);
  },
  shopReputationList: function shopReputationList(data) {
    return request('/shop/subshop/listReputation', true, 'post', data);
  },
  shopFavPut: function shopFavPut(token, shopId) {
    return request('/shop/fav/add', true, 'post', { token: token, shopId: shopId });
  },
  shopFavCheck: function shopFavCheck(token, shopId) {
    return request('/shop/fav/check', true, 'get', { token: token, shopId: shopId });
  },
  shopFavList: function shopFavList(data) {
    return request('/shop/fav/list', true, 'post', data);
  },
  shopFavDelete: function shopFavDelete(token, shopId) {
    return request('/shop/fav/delete', true, 'post', { token: token, shopId: shopId });
  },
  userAttendantFavPut: function userAttendantFavPut(token, attendantId) {
    return request('/userAttendantFav/add', true, 'post', { token: token, attendantId: attendantId });
  },
  userAttendantFavCheck: function userAttendantFavCheck(token, attendantId) {
    return request('/userAttendantFav/check', true, 'get', { token: token, attendantId: attendantId });
  },
  userAttendantFavList: function userAttendantFavList(data) {
    return request('/userAttendantFav/list', true, 'post', data);
  },
  userAttendantFavDelete: function userAttendantFavDelete(token, attendantId) {
    return request('/userAttendantFav/delete', true, 'post', { token: token, attendantId: attendantId });
  },
  addComment: function addComment(data) {
    return request('/comment/add', true, 'post', data);
  },
  commentList: function commentList(data) {
    return request('/comment/list', true, 'post', data);
  },
  commentListV2: function commentListV2(data) {
    return request('/comment/list/v2', true, 'post', data);
  },
  delComment: function delComment(data) {
    return request('/comment/del', true, 'post', data);
  },
  modifyUserInfo: function modifyUserInfo(data) {
    return request('/user/modify', true, 'post', data);
  },
  bindSaleman: function bindSaleman(data) {
    return request('/user/bindSaleman', true, 'post', data);
  },
  modifyUserPassword: function modifyUserPassword(token, pwdOld, pwdNew) {
    return request('/user/modify/password', true, 'post', { token: token, pwdOld: pwdOld, pwdNew: pwdNew });
  },
  modifyUserPasswordByUserName: function modifyUserPasswordByUserName(data) {
    return request('/user/username/modifyPassword', true, 'post', data);
  },
  uniqueId: function uniqueId() {
    var type = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

    return request('/uniqueId/get', true, 'get', { type: type });
  },
  queryBarcode: function queryBarcode() {
    var barcode = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

    return request('/barcode/info', true, 'get', { barcode: barcode });
  },
  luckyInfo: function luckyInfo(id) {
    return request('/luckyInfo/info/v2', true, 'get', { id: id });
  },
  luckyInfoJoin: function luckyInfoJoin(id, token) {
    return request('/luckyInfo/join', true, 'post', { id: id, token: token });
  },
  luckyInfoJoinMy: function luckyInfoJoinMy(id, token) {
    return request('/luckyInfo/join/my', true, 'get', { id: id, token: token });
  },
  luckyInfoJoinLogs: function luckyInfoJoinLogs(data) {
    return request('/luckyInfo/join/logs', true, 'post', data);
  },
  jsonList: function jsonList(data) {
    return request('/json/list', true, 'post', data);
  },
  jsonListV2: function jsonListV2(data) {
    return request('/json/list/v2', true, 'post', data);
  },
  jsonSet: function jsonSet(data) {
    return request('/json/set', true, 'post', data);
  },
  jsonDelete: function jsonDelete(token, id) {
    return request('/json/delete', true, 'post', { token: token, id: id });
  },
  jsonTop: function jsonTop(token, id, isTop) {
    return request('/json/top', true, 'post', { token: token, id: id, isTop: isTop });
  },
  jsonHighlight: function jsonHighlight(token, id, isHighlight) {
    return request('/json/highlight', true, 'post', { token: token, id: id, isHighlight: isHighlight });
  },
  graphValidateCodeUrl: function graphValidateCodeUrl() {
    var key = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : Math.random();

    var _url = API_BASE_URL + '/' + subDomain + '/verification/pic/get?key=' + key;
    return _url;
  },
  graphValidateCodeCheck: function graphValidateCodeCheck() {
    var key = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : Math.random();
    var code = arguments[1];

    return request('/verification/pic/check', true, 'post', { key: key, code: code });
  },
  shortUrl: function shortUrl() {
    var url = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

    return request('/common/short-url/shorten', false, 'post', { url: url });
  },
  shortUrlV2: function shortUrlV2(content) {
    return request('/common/short-url/shorten/v2', false, 'post', { content: content });
  },
  shortUrlExpand: function shortUrlExpand(suffix) {
    return request('/common/short-url/expand', false, 'post', { suffix: suffix });
  },
  smsValidateCode: function smsValidateCode(mobile) {
    var key = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
    var picCode = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';

    return request('/verification/sms/get', true, 'get', { mobile: mobile, key: key, picCode: picCode });
  },
  smsValidateCodeByToken: function smsValidateCodeByToken(token) {
    return request('/verification/sms/get-by-token', true, 'get', { token: token });
  },
  smsValidateCodeCheck: function smsValidateCodeCheck(mobile, code) {
    return request('/verification/sms/check', true, 'post', { mobile: mobile, code: code });
  },
  mailValidateCode: function mailValidateCode(mail) {
    return request('/verification/mail/get', true, 'get', { mail: mail });
  },
  mailValidateCodeCheck: function mailValidateCodeCheck(mail, code) {
    return request('/verification/mail/check', true, 'post', { mail: mail, code: code });
  },
  mapDistance: function mapDistance(lat1, lng1, lat2, lng2) {
    return request('/common/map/distance', false, 'get', { lat1: lat1, lng1: lng1, lat2: lat2, lng2: lng2 });
  },
  mapDistanceNavigation: function mapDistanceNavigation(key, mode, from, to) {
    return request('/common/map/qq/distance', false, 'post', { key: key, mode: mode, from: from, to: to });
  },
  mapQQAddress: function mapQQAddress() {
    var location = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    var coord_type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '5';

    return request('/common/map/qq/address', false, 'get', { location: location, coord_type: coord_type });
  },
  mapQQAddressV2: function mapQQAddressV2(key, location) {
    var coord_type = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '5';

    return request('/common/map/qq/address', false, 'get', { key: key, location: location, coord_type: coord_type });
  },
  mapQQSearch: function mapQQSearch(data) {
    return request('/common/map/qq/search', false, 'post', data);
  },
  virtualTraderList: function virtualTraderList(data) {
    return request('/virtualTrader/list', true, 'post', data);
  },
  virtualTraderDetail: function virtualTraderDetail(token, id) {
    return request('/virtualTrader/info', true, 'get', { token: token, id: id });
  },
  virtualTraderBuy: function virtualTraderBuy(token, id) {
    return request('/virtualTrader/buy', true, 'post', { token: token, id: id });
  },
  virtualTraderMyBuyLogs: function virtualTraderMyBuyLogs(data) {
    return request('/virtualTrader/buy/logs', true, 'post', data);
  },
  queuingTypes: function queuingTypes() {
    var status = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

    return request('/queuing/types', true, 'get', { status: status });
  },
  queuingGet: function queuingGet(token, typeId) {
    var mobile = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';

    return request('/queuing/get', true, 'post', { token: token, typeId: typeId, mobile: mobile });
  },
  queuingMy: function queuingMy(token) {
    var typeId = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
    var status = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';

    return request('/queuing/my', true, 'get', { token: token, typeId: typeId, status: status });
  },
  idcardCheck: function idcardCheck(token, name, idCardNo) {
    return request('/user/idcard', true, 'post', { token: token, name: name, idCardNo: idCardNo });
  },
  bindSeller: function bindSeller(data) {
    return request('/user/bindSeller', true, 'post', data);
  },
  loginout: function loginout(token) {
    return request('/user/loginout', true, 'get', { token: token });
  },
  userDelete: function userDelete(token) {
    return request('/user/delete', true, 'post', { token: token });
  },
  dynamicUserCode: function dynamicUserCode(token) {
    return request('/user/dynamicUserCode', true, 'get', { token: token });
  },
  userLevelList: function userLevelList(data) {
    return request('/user/level/list', true, 'post', data);
  },
  userLevelDetail: function userLevelDetail(levelId) {
    return request('/user/level/info', true, 'get', { id: levelId });
  },
  userLevelPrices: function userLevelPrices(levelId) {
    return request('/user/level/prices', true, 'get', { levelId: levelId });
  },
  userLevelBuy: function userLevelBuy(token, priceId) {
    var isAutoRenew = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
    var remark = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : '';

    return request('/user/level/buy', true, 'post', {
      token: token,
      userLevelPriceId: priceId,
      isAutoRenew: isAutoRenew,
      remark: remark
    });
  },
  userLevelBuyLogs: function userLevelBuyLogs(data) {
    return request('/user/level/buyLogs', true, 'post', data);
  },
  messageList: function messageList(data) {
    // SDK文档到这里
    return request('/user/message/list', true, 'post', data);
  },
  messageRead: function messageRead(token, id) {
    return request('/user/message/read', true, 'post', { token: token, id: id });
  },
  messageDelete: function messageDelete(token, id) {
    return request('/user/message/del', true, 'post', { token: token, id: id });
  },
  bindOpenid: function bindOpenid(token, code) {
    return request('/user/wxapp/bindOpenid', true, 'post', {
      token: token, code: code,
      type: 2
    });
  },
  bindOpenidV2: function bindOpenidV2(token, code, appid) {
    return request('/user/wxapp/bindOpenid/v2', true, 'post', {
      token: token, code: code, appid: appid
    });
  },
  encryptedData: function encryptedData(code, _encryptedData, iv) {
    return request('/user/wxapp/decode/encryptedData', true, 'post', {
      code: code, encryptedData: _encryptedData, iv: iv
    });
  },
  voteItems: function voteItems(data) {
    return request('/vote/items', true, 'post', data);
  },
  voteItemDetail: function voteItemDetail(id) {
    return request('/vote/info', true, 'get', { id: id });
  },
  vote: function vote(token, voteId, items, remark) {
    return request('/vote/vote', true, 'post', {
      token: token, voteId: voteId,
      items: items.join(),
      remark: remark
    });
  },
  voteCategory: function voteCategory(data) {
    return request('/vote/vote/category', true, 'post', data);
  },
  myVote: function myVote(token, voteId) {
    return request('/vote/vote/info', true, 'get', {
      token: token, voteId: voteId
    });
  },
  myVoteV2: function myVoteV2(token, voteId) {
    return request('/vote/vote/info/v2', true, 'get', {
      token: token, voteId: voteId
    });
  },
  voteLogs: function voteLogs(data) {
    return request('/vote/vote/list', true, 'post', data);
  },
  voteGroups: function voteGroups(data) {
    return request('/vote/vote/groups', true, 'post', data);
  },
  voteGroupsDetail: function voteGroupsDetail(data) {
    return request('/vote/vote/groups/detail', true, 'get', data);
  },
  myInviteVoteJoinList: function myInviteVoteJoinList(data) {
    return request('/vote/myInviteLoinList', true, 'post', data);
  },
  yuyueItemPublish: function yuyueItemPublish(data) {
    return request('/yuyue/publish', true, 'post', data);
  },
  yuyueItems: function yuyueItems(data) {
    return request('/yuyue/items', true, 'post', data);
  },
  yuyueItemDetail: function yuyueItemDetail(id) {
    var token = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';

    return request('/yuyue/info', true, 'get', { id: id, token: token });
  },
  yuyueItemDelete: function yuyueItemDelete(token, id) {
    return request('/yuyue/del', true, 'post', { token: token, id: id });
  },
  yuyueJoin: function yuyueJoin(data) {
    return request('/yuyue/join', true, 'post', data);
  },
  yuyueJoinPay: function yuyueJoinPay(token, joinId) {
    return request('/yuyue/pay', true, 'post', {
      token: token, joinId: joinId
    });
  },
  yuyueJoinUpdate: function yuyueJoinUpdate(token, joinId, extJsonStr) {
    return request('/yuyue/join/update', true, 'post', {
      token: token, joinId: joinId, extJsonStr: extJsonStr
    });
  },
  yuyueJoinDelete: function yuyueJoinDelete(token, joinId) {
    return request('/yuyue/delJoin', true, 'post', {
      token: token, id: joinId
    });
  },
  yuyueMyJoinInfo: function yuyueMyJoinInfo(token, joinId) {
    return request('/yuyue/join/info', true, 'post', {
      token: token, joinId: joinId
    });
  },
  yuyueMyJoinLogs: function yuyueMyJoinLogs(data) {
    return request('/yuyue/join/list', true, 'post', data);
  },
  yuyueTeams: function yuyueTeams(data) {
    return request('/yuyue/info/teams', true, 'post', data);
  },
  yuyueTeamDetail: function yuyueTeamDetail(teamId) {
    return request('/yuyue/info/team', true, 'get', { teamId: teamId });
  },
  yuyueTeamMembers: function yuyueTeamMembers(data) {
    return request('/yuyue/info/team/members', true, 'post', data);
  },
  yuyueTeamDeleteMember: function yuyueTeamDeleteMember(token, joinId) {
    return request('/yuyue/info/team/members/del', true, 'post', data);
  },
  register_email: function register_email(data) {
    return request('/user/email/register', true, 'post', data);
  },
  login_email: function login_email(data) {
    return request('/user/email/login', true, 'post', data);
  },
  bindEmail: function bindEmail(token, email, code) {
    var pwd = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : '';

    return request('/user/email/bindEmail', true, 'post', {
      token: token, email: email, code: code, pwd: pwd
    });
  },
  goodsDynamic: function goodsDynamic(type) {
    return request('/site/goods/dynamic', true, 'get', { type: type });
  },
  goodsDynamicV2: function goodsDynamicV2(data) {
    return request('/site/goods/dynamic', true, 'get', data);
  },
  usersDynamic: function usersDynamic(type) {
    return request('/site/user/dynamic', true, 'get', { type: type });
  },
  fetchSubDomainByWxappAppid: function fetchSubDomainByWxappAppid(appid) {
    return request('/subdomain/appid/wxapp', false, 'get', { appid: appid });
  },
  cmsArticleFavPut: function cmsArticleFavPut(token, newsId) {
    return request('/cms/news/fav/add', true, 'post', { token: token, newsId: newsId });
  },
  cmsArticleFavCheck: function cmsArticleFavCheck(token, newsId) {
    return request('/cms/news/fav/check', true, 'get', { token: token, newsId: newsId });
  },
  cmsArticleFavList: function cmsArticleFavList(data) {
    return request('/cms/news/fav/list', true, 'post', data);
  },
  cmsArticleFavListV2: function cmsArticleFavListV2(data) {
    return request('/cms/news/fav/list/v2', true, 'post', data);
  },
  cmsArticleFavDeleteById: function cmsArticleFavDeleteById(token, id) {
    return request('/cms/news/fav/delete', true, 'post', { token: token, id: id });
  },
  cmsArticleFavDeleteByNewsId: function cmsArticleFavDeleteByNewsId(token, newsId) {
    return request('/cms/news/fav/delete', true, 'post', { token: token, newsId: newsId });
  },
  shippingCarInfo: function shippingCarInfo(token) {
    var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';

    return request('/shopping-cart/info', true, 'get', {
      token: token, type: type
    });
  },
  shippingCarInfoAddItem: function shippingCarInfoAddItem(token, goodsId, number, sku, addition) {
    var type = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : '';

    return request('/shopping-cart/add', true, 'post', {
      token: token,
      goodsId: goodsId,
      number: number,
      sku: sku && sku.length > 0 ? JSON.stringify(sku) : '',
      addition: addition && addition.length > 0 ? JSON.stringify(addition) : '',
      type: type
    });
  },
  shippingCarInfoAddItemV2: function shippingCarInfoAddItemV2(data) {
    return request('/shopping-cart/add', true, 'post', data);
  },
  shippingCarInfoModifyNumber: function shippingCarInfoModifyNumber(token, key, number) {
    var type = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : '';

    return request('/shopping-cart/modifyNumber', true, 'post', {
      token: token, key: key, number: number, type: type
    });
  },
  shippingCarInfoRemoveItem: function shippingCarInfoRemoveItem(token, key) {
    var type = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';

    return request('/shopping-cart/remove', true, 'post', {
      token: token, key: key, type: type
    });
  },
  shippingCartSelected: function shippingCartSelected(token, key, selected) {
    var type = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : '';

    return request('/shopping-cart/select', true, 'post', {
      token: token, key: key, selected: selected, type: type
    });
  },
  shippingCarInfoRemoveAll: function shippingCarInfoRemoveAll(token) {
    var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';

    return request('/shopping-cart/empty', true, 'post', {
      token: token, type: type
    });
  },
  growthLogs: function growthLogs(data) {
    return request('/growth/logs', true, 'post', data);
  },
  exchangeScoreToGrowth: function exchangeScoreToGrowth(token, deductionScore) {
    return request('/growth/exchange', true, 'post', {
      token: token, deductionScore: deductionScore
    });
  },
  wxaMpLiveRooms: function wxaMpLiveRooms() {
    return request('/wx/live/rooms', true, 'get');
  },
  wxaMpLiveRoomHisVedios: function wxaMpLiveRoomHisVedios(roomId) {
    return request('/wx/live/his', true, 'get', {
      roomId: roomId
    });
  },
  peisonFeeList: function peisonFeeList() {
    return request('/fee/peisong/list', true, 'get');
  },
  peisongMembers: function peisongMembers(data) {
    return request('/peisong/member/list', true, 'post', data);
  },
  peisongMemberInfo: function peisongMemberInfo(token) {
    return request('/peisong/member/info', true, 'get', {
      token: token
    });
  },
  peisongMemberChangeWorkStatus: function peisongMemberChangeWorkStatus(token) {
    return request('/peisong/member/change-work-status', true, 'post', {
      token: token
    });
  },
  peisongOrdersGrabbing: function peisongOrdersGrabbing(token) {
    return request('/peisong/order/grabbing', true, 'get', { token: token });
  },
  peisongOrders: function peisongOrders(data) {
    return request('/peisong/order/list', true, 'post', data);
  },
  peisongOrderGrab: function peisongOrderGrab(data) {
    return request('/peisong/order/grab', true, 'post', data);
  },
  peisongOrderDetail: function peisongOrderDetail(token, id) {
    return request('/peisong/order/detail', true, 'get', { token: token, id: id });
  },
  peisongOrderEstimatedCompletionTime: function peisongOrderEstimatedCompletionTime(data) {
    return request('/peisong/order/estimatedCompletionTime', true, 'post', data);
  },
  peisongStartService: function peisongStartService(data) {
    return request('/peisong/order/start-service', true, 'post', data);
  },
  peisongEndService: function peisongEndService(data) {
    return request('/peisong/order/end-service', true, 'post', data);
  },
  peisongEndServiceRemark: function peisongEndServiceRemark(token, id, remarkEnd) {
    return request('/peisong/order/end-service/remarkEnd', true, 'post', { token: token, id: id, remarkEnd: remarkEnd });
  },
  peisongOrderAllocation: function peisongOrderAllocation(token, id, uid) {
    return request('/peisong/order/allocation', true, 'post', {
      token: token, id: id, uid: uid
    });
  },
  siteStatistics: function siteStatistics() {
    return request('/site/statistics', true, 'get');
  },
  orderStatistics: function orderStatistics(token) {
    return request('/order/statistics', true, 'get', {
      token: token
    });
  },
  orderStatisticsv2: function orderStatisticsv2(data) {
    return request('/order/statistics', true, 'get', data);
  },
  siteStatisticsSaleroom: function siteStatisticsSaleroom(data) {
    return request('/site/statistics/saleroom', true, 'get', data);
  },
  siteStatisticsSaleroomYear: function siteStatisticsSaleroomYear() {
    var year = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

    return request('/site/statistics/saleroom/year', true, 'get', { year: year });
  },
  bonusLog: function bonusLog(data) {
    return request('/bonusLog/list', true, 'post', data);
  },
  mtjAsset: function mtjAsset(token) {
    return request('/mtj/asset', true, 'get', { token: token });
  },
  mtjSetting: function mtjSetting() {
    return request('/mtj/setting', true, 'get');
  },
  mtjLogs: function mtjLogs(data) {
    return request('/mtj/logs', true, 'post', data);
  },
  mtjStatistics: function mtjStatistics() {
    return request('/site/statistics/mjt', true, 'get');
  },
  mtjTransfer: function mtjTransfer(data) {
    return request('/mtj/transfer', true, 'post', data);
  },
  mtjTransferLogs: function mtjTransferLogs(data) {
    return request('/mtj/transfer/logs', true, 'post', data);
  },
  wxOpenAuthorization: function wxOpenAuthorization(data) {
    return request('/user/wxsns/authorization', true, 'post', data);
  },
  wxOpenRegister: function wxOpenRegister(data) {
    return request('/user/wxsns/register', true, 'post', data);
  },
  wxOpenBindOpenid: function wxOpenBindOpenid(data) {
    return request('/user/wxsns/bindOpenid/v2', true, 'post', data);
  },
  wxOpenLogin: function wxOpenLogin(data) {
    return request('/user/wxsns/login', true, 'post', data);
  },
  userAttentioncheck: function userAttentioncheck(token, uid) {
    return request('/user/attention/check', true, 'get', {
      token: token, uid: uid
    });
  },
  userAttentionAdd: function userAttentionAdd(token, uid) {
    return request('/user/attention/add', true, 'post', {
      token: token, uid: uid
    });
  },
  userAttentionRemove: function userAttentionRemove(token, uid) {
    return request('/user/attention/remove', true, 'post', {
      token: token, uid: uid
    });
  },
  userAttentionMeList: function userAttentionMeList(data) {
    return request('/user/attention/attention-me', true, 'post', data);
  },
  userMyAttentionList: function userMyAttentionList(data) {
    return request('/user/attention/my-attention', true, 'post', data);
  },
  userAttentionDetail: function userAttentionDetail(token, uid) {
    return request('/user/attention/detail', true, 'get', {
      token: token, uid: uid
    });
  },
  userAttentionStatistics: function userAttentionStatistics(token) {
    return request('/user/attention/statistics', true, 'get', {
      token: token
    });
  },
  cyTableToken: function cyTableToken(tableId, key) {
    return request('/cyTable/token', true, 'post', {
      id: tableId,
      k: key
    });
  },
  cyTableAddOrder: function cyTableAddOrder(data) {
    return request('/cyTable/add-order', true, 'post', data);
  },
  cyTablePayOrder: function cyTablePayOrder(data) {
    return request('/cyTable/pay-order', true, 'post', data);
  },
  cyTableInfo: function cyTableInfo(id) {
    return request('/cyTable/info', true, 'get', { id: id });
  },
  cyTableList: function cyTableList(data) {
    return request('/cyTable/list', true, 'post', data);
  },
  goodsTimesSchedule: function goodsTimesSchedule() {
    var goodsId = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    var propertyChildIds = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
    var brandId = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';
    var categoryId = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : '';

    return request('/shop/goods/times/schedule', true, 'post', { goodsId: goodsId, propertyChildIds: propertyChildIds, brandId: brandId, categoryId: categoryId });
  },
  goodsTimesDays: function goodsTimesDays(goodsId) {
    var propertyChildIds = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';

    return request('/shop/goods/times/days', true, 'post', { goodsId: goodsId, propertyChildIds: propertyChildIds });
  },
  goodsTimesDayItems: function goodsTimesDayItems(day, goodsId) {
    var propertyChildIds = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';

    return request('/shop/goods/times/items', true, 'post', { day: day, goodsId: goodsId, propertyChildIds: propertyChildIds });
  },
  goodsBrandList: function goodsBrandList(data) {
    return request('/shop/goods/brand/list', true, 'post', data);
  },
  goodsBrandDetail: function goodsBrandDetail(id) {
    return request('/shop/goods/brand/detail', true, 'get', { id: id });
  },
  wxappServiceLogin: function wxappServiceLogin(data) {
    return request('/user/wxappService/login', true, 'post', data);
  },
  wxappServiceLoginWxaMobile: function wxappServiceLoginWxaMobile(data) {
    return request('/user/wxappService/login/mobile', true, 'post', data);
  },
  wxappServiceRegisterComplex: function wxappServiceRegisterComplex(data) {
    return request('/user/wxappService/register/complex', true, 'post', data);
  },
  wxappServiceRegisterSimple: function wxappServiceRegisterSimple(data) {
    return request('/user/wxappService/register/simple', true, 'post', data);
  },
  wxappServiceAuthorize: function wxappServiceAuthorize(data) {
    return request('/user/wxappService/authorize', true, 'post', data);
  },
  wxappServiceBindMobile: function wxappServiceBindMobile(data) {
    return request('/user/wxappService/bindMobile', true, 'post', data);
  },
  wxappServiceBindMobileV2: function wxappServiceBindMobileV2(data) {
    return request('/user/wxappService/bindMobile/v2', true, 'post', data);
  },
  wxappServiceBindOpenid: function wxappServiceBindOpenid(data) {
    return request('/user/wxappService/bindOpenid', true, 'post', data);
  },
  wxappServiceEncryptedData: function wxappServiceEncryptedData(data) {
    return request('/user/wxappService/decode/encryptedData', true, 'post', data);
  },
  trtcUserSig: function trtcUserSig(token) {
    return request('/trtc/userSig', true, 'get', { token: token });
  },
  setPayPassword: function setPayPassword(token, pwd) {
    return request('/user/paypwd/set', true, 'post', { token: token, pwd: pwd });
  },
  modifyPayPassword: function modifyPayPassword(token, pwdOld, pwdNew) {
    return request('/user/paypwd/modify', true, 'post', { token: token, pwdOld: pwdOld, pwdNew: pwdNew });
  },
  resetPayPassword: function resetPayPassword(mobile, code, pwd) {
    return request('/user/paypwd/reset', true, 'post', { mobile: mobile, code: code, pwd: pwd });
  },
  adPosition: function adPosition(key) {
    return request('/site/adPosition/info', true, 'get', { key: key });
  },
  adPositionBatch: function adPositionBatch(keys) {
    return request('/site/adPosition/batch', true, 'get', { keys: keys });
  },
  momentsCategory: function momentsCategory() {
    return request('/momentsCategory/list', true, 'get');
  },
  momentsList: function momentsList(data) {
    return request('/moments/list', true, 'post', data);
  },
  momentsdetail: function momentsdetail(id) {
    return request('/moments/detail', true, 'get', { id: id });
  },
  goodsVisitLog: function goodsVisitLog(data) {
    return request('/goods/visitLog', true, 'post', data);
  },
  goodsVisitLogAdd: function goodsVisitLogAdd(data) {
    return request('/goods/visitLog/add', true, 'post', data);
  },
  goodsVisitLogDelete: function goodsVisitLogDelete(data) {
    return request('/goods/visitLog/delete', true, 'post', data);
  },
  goodsVisitLogClear: function goodsVisitLogClear(token) {
    return request('/goods/visitLog/clear', true, 'post', { token: token });
  },
  channelDataPush: function channelDataPush(key, content) {
    return request('/channelData/push', true, 'post', { key: key, content: content });
  },
  channelDataPull: function channelDataPull(key) {
    return request('/channelData/pull', true, 'get', { key: key });
  },
  bindPartner: function bindPartner(token, partnerId) {
    return request('/user/bindPartner', true, 'post', { token: token, uid: partnerId });
  },
  partnerSetting: function partnerSetting() {
    return request('/partner/setting', true, 'get');
  },
  partnerBindTeamLeader: function partnerBindTeamLeader(token, uid) {
    return request('/partner/bindTeamLeader', true, 'post', { token: token, uid: uid });
  },
  partnerBuyTeamLeader: function partnerBuyTeamLeader(token) {
    return request('/partner/buy', true, 'post', { token: token });
  },
  partnerMembersStatistics: function partnerMembersStatistics(token) {
    return request('/partner/members/statistics', true, 'get', { token: token });
  },
  partnerMembers: function partnerMembers(data) {
    return request('/partner/members', true, 'post', data);
  },
  myLiveRooms: function myLiveRooms(data) {
    return request('/liveRooms/my', true, 'post', data);
  },
  liveRooms: function liveRooms(data) {
    return request('/liveRooms/list', true, 'post', data);
  },
  myLiveRoomsInfo: function myLiveRoomsInfo(token, id) {
    return request('/liveRooms/my/info', true, 'get', { token: token, id: id });
  },
  liveRoomsInfo: function liveRoomsInfo(token, id) {
    return request('/liveRooms/info', true, 'get', { token: token, id: id });
  },
  liveRoomGoodsMainly: function liveRoomGoodsMainly(data) {
    return request('/liveRooms/goods/mainly', true, 'post', data);
  },
  stopLiveRoom: function stopLiveRoom(token, id) {
    return request('/liveRooms/my/stop', true, 'post', { token: token, id: id });
  },
  likeLiveRoom: function likeLiveRoom(token, id) {
    return request('/liveRooms/like', true, 'post', { token: token, id: id });
  },
  liveRoomOnlineUsers: function liveRoomOnlineUsers(token, roomId) {
    return request('/websocket/rest/liveRoom/onlines', false, 'get', { token: token, roomId: roomId });
  },
  liveRoomKickOutUser: function liveRoomKickOutUser(token, roomId, uid) {
    return request('/websocket/rest/liveRoom/kickOut', false, 'post', { token: token, roomId: roomId, uid: uid });
  },
  mockApi: function mockApi(groupName, apiName, method) {
    return request('/mock/' + groupName + '/' + apiName, true, method);
  },
  tourJourneyList: function tourJourneyList(type, refId) {
    return request('/tourJourney/list', true, 'get', { type: type, refId: refId });
  },
  userBankSelectBanks: function userBankSelectBanks() {
    return request('/userBank/banks', true, 'get');
  },
  userBankInfo: function userBankInfo(token) {
    return request('/userBank/info', true, 'get', { token: token });
  },
  userBankBind: function userBankBind(data) {
    return request('/userBank/bind', true, 'post', data);
  },
  userBankUnBind: function userBankUnBind(token) {
    return request('/userBank/unbind', true, 'post', { token: token });
  },
  // 京东VOP相关接口
  jdvopGoodsList: function jdvopGoodsList(data) {
    return request('/jdvop/' + merchantId + '/goods/list', false, 'post', data);
  },
  jdvopGoodsCheckCanBuy: function jdvopGoodsCheckCanBuy(data) {
    return request('/jdvop/' + merchantId + '/goods/checkCanBuy', false, 'post', data);
  },
  jdvopGoodsDetail: function jdvopGoodsDetail(goodsId) {
    return request('/jdvop/' + merchantId + '/goods/detail', false, 'get', {
      skuId: goodsId,
      queryExts: 'wxintroduction'
    });
  },
  jdvopGoodsSkuImages: function jdvopGoodsSkuImages(goodsId) {
    return request('/jdvop/' + merchantId + '/goods/skuImages', false, 'get', {
      skuId: goodsId
    });
  },
  jdvopCartInfo: function jdvopCartInfo(token) {
    return request('/jdvop/' + merchantId + '/shopping-cart/info', false, 'get', {
      token: token
    });
  },
  jdvopCartAdd: function jdvopCartAdd(data) {
    return request('/jdvop/' + merchantId + '/shopping-cart/add', false, 'post', data);
  },
  jdvopCartModifyNumber: function jdvopCartModifyNumber(token, key, number) {
    return request('/jdvop/' + merchantId + '/shopping-cart/modifyNumber', false, 'post', {
      token: token, key: key, number: number
    });
  },
  jdvopCartSelect: function jdvopCartSelect(token, key, selected) {
    return request('/jdvop/' + merchantId + '/shopping-cart/select', false, 'post', {
      token: token, key: key, selected: selected
    });
  },
  jdvopCartRemove: function jdvopCartRemove(token, key) {
    return request('/jdvop/' + merchantId + '/shopping-cart/remove', false, 'post', {
      token: token, key: key
    });
  },
  jdvopCartEmpty: function jdvopCartEmpty(token) {
    return request('/jdvop/' + merchantId + '/shopping-cart/empty', false, 'post', {
      token: token
    });
  },
  // 商家从区管进货
  jdvopJinhuoGoods: function jdvopJinhuoGoods(data) {
    return request('/vop/goods/list', true, 'post', data);
  },
  jdvopJinhuoGoodsDetail: function jdvopJinhuoGoodsDetail(token, skuId) {
    return request('/vop/goods/detail', true, 'get', { token: token, skuId: skuId });
  },
  // cps
  cpsJdGoodsCategory: function cpsJdGoodsCategory(parentId, grade) {
    return request('/cpsJdGoods/category', true, 'get', { parentId: parentId, grade: grade });
  },
  cpsJdGoodsSearch: function cpsJdGoodsSearch(data) {
    return request('/cpsJdGoods/search', true, 'post', data);
  },
  cpsJdGoodsDetail: function cpsJdGoodsDetail(data) {
    return request('/cpsJdGoods/detail', true, 'get', data);
  },
  cpsJdGoodsSetExt: function cpsJdGoodsSetExt(data) {
    return request('/cpsJdGoods/ext/set', true, 'post', data);
  },
  cpsJdGoodsQueryExt: function cpsJdGoodsQueryExt(skuId) {
    return request('/cpsJdGoods/ext/query', true, 'get', { skuId: skuId });
  },
  cpsJdGoodsShotUrl: function cpsJdGoodsShotUrl(token, skuId) {
    return request('/cpsJdGoods/shotUrl', true, 'get', { token: token, skuId: skuId });
  },
  cpsJdGoodsShotUrlSite: function cpsJdGoodsShotUrlSite(token, materialUrl, couponUrl) {
    return request('/cpsJdGoods/shotUrl/site', true, 'post', { token: token, materialUrl: materialUrl, couponUrl: couponUrl });
  },
  cpsJdOrders: function cpsJdOrders(data) {
    return request('/cpsJdOrder/list', true, 'post', data);
  },
  cpsJdOrderDetail: function cpsJdOrderDetail(token, id) {
    return request('/cpsJdOrder/detail', true, 'get', { token: token, id: id });
  },
  cpsPddBeian: function cpsPddBeian(token) {
    return request('/cpsPddGoods/beian', true, 'get', { token: token });
  },
  cpsPddGoodsDetail: function cpsPddGoodsDetail(data) {
    return request('/cpsPddGoods/detail', true, 'get', data);
  },
  cpsPddGoodsShotUrl: function cpsPddGoodsShotUrl(token, goodsSign) {
    return request('/cpsPddGoods/shotUrl', true, 'get', { token: token, goodsSign: goodsSign });
  },
  cpsPddOrders: function cpsPddOrders(data) {
    return request('/cpsPddOrder/list', true, 'post', data);
  },
  cpsPddOrderDetail: function cpsPddOrderDetail(token, id) {
    return request('/cpsPddOrder/detail', true, 'get', { token: token, id: id });
  },
  cpsTaobaoGoodsDetail: function cpsTaobaoGoodsDetail(data) {
    return request('/cpsTaobaoGoods/detail', true, 'get', data);
  },
  cpsTaobaoGoodsShotUrl: function cpsTaobaoGoodsShotUrl(token, content) {
    return request('/cpsTaobaoGoods/shotUrl', true, 'post', { token: token, content: content });
  },
  cpsTaobaoGoodsKouling: function cpsTaobaoGoodsKouling(token, content) {
    return request('/cpsTaobaoGoods/kouling', true, 'post', { token: token, content: content });
  },
  // 回收
  recycleOrders: function recycleOrders(data) {
    return request('/recycleOrder/list', true, 'post', data);
  },
  recycleOrderApply: function recycleOrderApply(data) {
    return request('/recycleOrder/apply', true, 'post', data);
  },
  recycleOrderDetail: function recycleOrderDetail(token, id) {
    return request('/recycleOrder/detail', true, 'get', { token: token, id: id });
  },
  recycleOrderFahuo: function recycleOrderFahuo(data) {
    return request('/recycleOrder/fahuo', true, 'post', data);
  },
  recycleOrderClose: function recycleOrderClose(token, id) {
    return request('/recycleOrder/close', true, 'post', { token: token, id: id });
  },
  recycleOrderDelete: function recycleOrderDelete(token, id) {
    return request('/recycleOrder/del', true, 'post', { token: token, id: id });
  },
  // 会员卡
  cardList: function cardList(data) {
    return request('/card/list', true, 'get', data);
  },
  cardInfo: function cardInfo(id) {
    return request('/card/info', true, 'get', { id: id });
  },
  cardBuy: function cardBuy(token, id) {
    return request('/card/buy', true, 'post', { token: token, id: id });
  },
  cardMyList: function cardMyList(token) {
    return request('/card/my', true, 'get', { token: token });
  },
  cardMyLogs: function cardMyLogs(data) {
    return request('/card/logs', true, 'post', data);
  },
  cardExchangeFromPwd: function cardExchangeFromPwd(data) {
    return request('/card/exchange', true, 'post', data);
  },
  // 收藏卡片
  collectCardHis: function collectCardHis(data) {
    return request('/collectCard/del', true, 'post', data);
  },
  collectCardInfo: function collectCardInfo(number) {
    return request('/collectCard/cardInfo', true, 'get', { number: number });
  },
  collectCardHisInfo: function collectCardHisInfo(token, id) {
    return request('/collectCard/hisInfo', true, 'get', { token: token, id: id });
  },
  collectCardBind: function collectCardBind(data) {
    return request('/collectCard/bind', true, 'post', data);
  },
  collectCardUnBind: function collectCardUnBind(token, id, smsCode) {
    return request('/collectCard/bind', true, 'post', { token: token, id: id, smsCode: smsCode });
  },
  // 其他
  bengenSaleTongjiList: function bengenSaleTongjiList(data) {
    return request('/bengenSaleTongji/list', true, 'post', data);
  },
  bengenSaleTongjiRank: function bengenSaleTongjiRank(data) {
    return request('/bengenSaleTongji/rank', true, 'get', data);
  },
  // 购买课程
  courseInfoList: function courseInfoList(data) {
    return request('/courseInfo/list', true, 'post', data);
  },
  courseInfo: function courseInfo(id) {
    return request('/courseInfo/info', true, 'get', { id: id });
  },
  courseBuyLogPublic: function courseBuyLogPublic(data) {
    return request('/courseBuyLog/public', true, 'post', data);
  },
  courseBuyLogMy: function courseBuyLogMy(data) {
    return request('/courseBuyLog/my', true, 'post', data);
  },
  courseInfoBuy: function courseInfoBuy(data) {
    return request('/courseBuyLog/buy', true, 'post', data);
  },
  courseInfoBuyLogPay: function courseInfoBuyLogPay(token, orderId) {
    return request('/courseBuyLog/pay', true, 'post', { token: token, orderId: orderId });
  },
  courseInfoBuyLogDetail: function courseInfoBuyLogDetail(token, id) {
    var hxNumber = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';

    return request('/courseBuyLog/detail', true, 'get', { token: token, id: id, hxNumber: hxNumber });
  },
  courseInfoBuyLogClose: function courseInfoBuyLogClose(token, orderId) {
    return request('/courseBuyLog/close', true, 'post', { token: token, orderId: orderId });
  },
  courseInfoBuyLogDelete: function courseInfoBuyLogDelete(token, orderId) {
    return request('/courseBuyLog/del', true, 'post', { token: token, orderId: orderId });
  },
  // 橱窗
  chuchuanSettingInfo: function chuchuanSettingInfo(uid) {
    return request('/chuchuan/info', true, 'get', { uid: uid });
  },
  chuchuanSettingModify: function chuchuanSettingModify(data) {
    return request('/chuchuan/modify', true, 'post', data);
  },
  chuchuanGoodsList: function chuchuanGoodsList(data) {
    return request('/chuchuanGoods/list', true, 'post', data);
  },
  chuchuanGoodsAdd: function chuchuanGoodsAdd(data) {
    return request('/chuchuanGoods/add', true, 'post', data);
  },
  chuchuanGoodsRemove: function chuchuanGoodsRemove(token, goodsId) {
    return request('/chuchuanGoods/remove', true, 'post', { token: token, goodsId: goodsId });
  },
  chuchuanGoodsCheck: function chuchuanGoodsCheck(token, goodsId) {
    return request('/chuchuanGoods/check', true, 'get', { token: token, goodsId: goodsId });
  },
  // 寄存
  jicunGoodsList: function jicunGoodsList(data) {
    return request('/jicunGoods/list', true, 'post', data);
  },
  jicunGoodsDetail: function jicunGoodsDetail(data) {
    return request('/jicunGoods/detail', true, 'get', data);
  },
  // ocr
  ocrBusinessLicense: function ocrBusinessLicense(imageUrl) {
    return request('/ocr/businessLicense', true, 'post', { imageUrl: imageUrl });
  },
  ocrIdcard: function ocrIdcard(imageUrl) {
    return request('/ocr/idcard', true, 'post', { imageUrl: imageUrl });
  },
  ocrBankcard: function ocrBankcard(imageUrl) {
    return request('/ocr/bankcard', true, 'post', { imageUrl: imageUrl });
  },
  ocrDriverLicense: function ocrDriverLicense(imageUrl) {
    return request('/ocr/driverLicense', true, 'post', { imageUrl: imageUrl });
  },
  // 朋友圈
  momentsPublish: function momentsPublish(data) {
    return request('/user/moments/publish', true, 'post', data);
  },
  userMomentsList: function userMomentsList(data) {
    return request('/user/moments/list', true, 'get', data);
  },
  momentsDetail: function momentsDetail(token, momentsId) {
    return request('/user/moments/detail', true, 'get', { token: token, momentsId: momentsId });
  },
  momentsDelete: function momentsDelete(token, momentsId) {
    return request('/user/moments/del', true, 'post', { token: token, momentsId: momentsId });
  },
  momentsDeleteComment: function momentsDeleteComment(token, commentId) {
    return request('/user/moments/delCommon', true, 'post', { token: token, commentId: commentId });
  },
  momentsLike: function momentsLike(token, momentsId) {
    return request('/user/moments/like', true, 'post', { token: token, momentsId: momentsId });
  },
  momentsComment: function momentsComment(token, momentsId) {
    var uid = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';
    var content = arguments[3];

    return request('/user/moments/comment', true, 'post', { token: token, momentsId: momentsId, uid: uid, content: content });
  },
  momentsCommentLogs: function momentsCommentLogs(data) {
    return request('/user/moments/logs', true, 'get', data);
  },
  momentsLogsRead: function momentsLogsRead(token, logsIds) {
    return request('/user/moments/logRead', true, 'post', { token: token, logsIds: logsIds });
  },
  bottleMsgPublish: function bottleMsgPublish(data) {
    return request('/bottleMsg/publish', true, 'post', data);
  },
  bottleMsgSalvage: function bottleMsgSalvage(token) {
    return request('/bottleMsg/salvage', true, 'get', { token: token });
  },
  userInvoiceInfo: function userInvoiceInfo(token) {
    return request('/userInvoice/info', true, 'get', { token: token });
  },
  userInvoiceUnbind: function userInvoiceUnbind(token) {
    return request('/userInvoice/unbind', true, 'post', { token: token });
  },
  userInvoiceBind: function userInvoiceBind(data) {
    return request('/userInvoice/bind', true, 'post', data);
  },
  goodsLendsList: function goodsLendsList(data) {
    return request('/goodsLends/list', true, 'post', data);
  },
  goodsLendsLogs: function goodsLendsLogs(data) {
    return request('/goodsLends/logs', true, 'post', data);
  },
  // 支付宝小程序
  aliappUserRegister: function aliappUserRegister(data) {
    return request('/user/aliapp/register', true, 'post', data);
  },
  aliappUserLogin: function aliappUserLogin(data) {
    return request('/user/aliapp/login', true, 'post', data);
  },
  aliappUserAuthorize: function aliappUserAuthorize(data) {
    return request('/user/aliapp/authorize', true, 'post', data);
  },
  aliappWebUserAuthorize: function aliappWebUserAuthorize(data) {
    return request('/user/aliappweb/authorize', true, 'post', data);
  },
  aliappQrcode: function aliappQrcode(content) {
    return request('/user/aliapp/qrcode', true, 'post', { content: content });
  },
  aliappBindMobile: function aliappBindMobile(data) {
    return request('/user/aliapp/bindMobile', true, 'post', data);
  },
  aliappGetMobile: function aliappGetMobile(encryptedData) {
    return request('/user/aliapp/getMobile', true, 'post', { encryptedData: encryptedData });
  },
  tempDataSet: function tempDataSet(key, content) {
    return request('/tempData/set', true, 'post', { key: key, content: content });
  },
  tempDataGet: function tempDataGet(key) {
    return request('/tempData/get', true, 'get', { key: key });
  },
  commonDatetime: function commonDatetime() {
    return request('/common/datetime', true, 'get');
  },
  commonDays: function commonDays() {
    var startDay = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    var days = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';

    return request('/common/days', false, 'get', { startDay: startDay, days: days });
  },
  commonDiffMillis: function commonDiffMillis() {
    var d1 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    var d2 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';

    return request('/common/diffMillis', false, 'get', { d1: d1, d2: d2 });
  },
  // 企业应用 组织/成员/网盘
  organizePrices: function organizePrices() {
    return request('/organizeInfo/prices', true, 'get');
  },
  organizeCreate: function organizeCreate(data) {
    return request('/organizeInfo/create', true, 'post', data);
  },
  organizeUpgrade: function organizeUpgrade(data) {
    return request('/organizeInfo/upgrade', true, 'post', data);
  },
  organizeModify: function organizeModify(data) {
    return request('/organizeInfo/modify', true, 'post', data);
  },
  organizeJoinKey: function organizeJoinKey(data) {
    return request('/organizeInfo/joinKey', true, 'get', data);
  },
  organizeJoin: function organizeJoin(data) {
    return request('/organizeInfo/join', true, 'post', data);
  },
  organizeGrantAdmin: function organizeGrantAdmin(data) {
    return request('/organizeInfo/grantAdmin', true, 'post', data);
  },
  organizeKick: function organizeKick(data) {
    return request('/organizeInfo/kick', true, 'post', data);
  },
  organizeKickAllMembers: function organizeKickAllMembers(data) {
    return request('/organizeInfo/kickAllMembers', true, 'post', data);
  },
  organizeKickSelf: function organizeKickSelf(data) {
    return request('/organizeInfo/kickSelf', true, 'post', data);
  },
  organizeNick: function organizeNick(data) {
    return request('/organizeInfo/nick', true, 'post', data);
  },
  organizeDelete: function organizeDelete(data) {
    return request('/organizeInfo/deleteOrganize', true, 'post', data);
  },
  organizeMyOrganizeInfo: function organizeMyOrganizeInfo(data) {
    return request('/organizeInfo/myOrganizeInfo', true, 'post', data);
  },
  organizeDetail: function organizeDetail(data) {
    return request('/organizeInfo/organizeDetail', true, 'get', data);
  },
  organizeMembers: function organizeMembers(data) {
    return request('/organizeInfo/members', true, 'post', data);
  },
  newsExtFieldList: function newsExtFieldList(token, organizeId, newsId) {
    return request('/newsExtField/extFields', true, 'get', { token: token, organizeId: organizeId, newsId: newsId });
  },
  newsExtFieldDynamic: function newsExtFieldDynamic(token, newsId) {
    return request('/newsExtField/dynamic', true, 'get', { token: token, newsId: newsId });
  },
  newsExtFieldSet: function newsExtFieldSet(data) {
    return request('/newsExtField/setField', true, 'post', data);
  },
  userAttendantList: function userAttendantList(data) {
    return request('/user/attendant/list', true, 'post', data);
  },
  userAttendantDetail: function userAttendantDetail(id) {
    var token = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';

    return request('/user/attendant/detail', true, 'get', { id: id, token: token });
  },
  userAttendantGoods: function userAttendantGoods(id) {
    return request('/user/attendant/goods', true, 'get', { id: id });
  },
  userAttendantGoodsSet: function userAttendantGoodsSet(token, ids) {
    return request('/user/attendant/goodsSet', true, 'post', { token: token, ids: ids });
  },
  userAttendantBindShop: function userAttendantBindShop(token, shopId) {
    return request('/user/attendant/bindShop', true, 'post', { shopId: shopId, token: token });
  },
  userAttendantUnBindShop: function userAttendantUnBindShop(token) {
    return request('/user/attendant/unbindShop', true, 'post', { token: token });
  },
  userAttendantChangeStatus: function userAttendantChangeStatus(data) {
    return request('/user/attendant/changeStatus', true, 'post', data);
  },
  userAttendantDaysTimesAttendant: function userAttendantDaysTimesAttendant(goodsId, day) {
    return request('/user/attendant/daysTimesAttendant', true, 'get', { goodsId: goodsId, day: day });
  },
  userAttendantDaysTimesAttendantSetQuery: function userAttendantDaysTimesAttendantSetQuery(token, day) {
    return request('/user/attendant/daysTimesAttendant/set/query', true, 'get', { token: token, day: day });
  },
  userAttendantDaysTimesAttendantSet: function userAttendantDaysTimesAttendantSet(data) {
    return request('/user/attendant/daysTimesAttendant/set', true, 'post', data);
  },
  userAttendantListReputation: function userAttendantListReputation(data) {
    return request('/user/attendant/listReputation', true, 'post', data);
  },
  userAttendantShowPics: function userAttendantShowPics(id) {
    return request('/user/attendant/showPics', true, 'get', { id: id });
  },
  userAttendantShowPicsAdd: function userAttendantShowPicsAdd(token, url) {
    return request('/user/attendant/showPicsAdd', true, 'post', { token: token, url: url });
  },
  userAttendantShowPicsDel: function userAttendantShowPicsDel(token, id) {
    return request('/user/attendant/showPicsDel', true, 'post', { token: token, id: id });
  },
  userAttendantUpdate: function userAttendantUpdate(data) {
    return request('/user/attendant/update', true, 'post', data);
  },
  userAttendantOrderServing: function userAttendantOrderServing(token, orderId) {
    return request('/order/serving', true, 'post', { token: token, orderId: orderId });
  },
  userAttendantOrderRejectOrder: function userAttendantOrderRejectOrder(token, orderId) {
    return request('/order/rejectOrder', true, 'post', { token: token, orderId: orderId });
  },
  userAttendantOrderSuccess: function userAttendantOrderSuccess(token, orderId) {
    return request('/order/success', true, 'post', { token: token, orderId: orderId });
  },
  shopCategory: function shopCategory() {
    return request('/shopCategory/all', true, 'get');
  },
  shopCategoryDetail: function shopCategoryDetail(id) {
    return request('/shopCategory/info', true, 'get', { id: id });
  },
  yudingStatistics: function yudingStatistics(day) {
    return request('/shop/goods/yudingStatistics', true, 'get', { day: day });
  },
  contactList: function contactList() {
    return request('/contact/list', true, 'get');
  },
  distributedLock: function distributedLock(key, seconds) {
    return request('/distributedLock/lock', true, 'get', { key: key, seconds: seconds });
  },
  distributedLockRelease: function distributedLockRelease(key) {
    return request('/distributedLock/lock', true, 'get', { key: key });
  },
  communitySetting: function communitySetting() {
    return request('/community/setting', true, 'get');
  },
  communityLeaderApply: function communityLeaderApply(data) {
    return request('/communityLeader/apply', true, 'post', data);
  },
  communityLeaderApplyInfo: function communityLeaderApplyInfo(token) {
    return request('/communityLeader/apply/info', true, 'get', { token: token });
  },
  communityLeaderBuy: function communityLeaderBuy(token) {
    return request('/communityLeader/buy', true, 'post', { token: token });
  },
  communityOrderFahuo: function communityOrderFahuo(data) {
    return request('/communityOrder/fahuo', true, 'post', data);
  },
  wxmpOpenid: function wxmpOpenid(code) {
    return request('/user/wxmp/openid', true, 'get', { code: code });
  },
  listingSet: function listingSet() {
    return request('/listingSet/info', true, 'get');
  },
  listingMyListing: function listingMyListing(token) {
    return request('/listingInfo/myListing', true, 'get', { token: token });
  },
  listingSave: function listingSave(data) {
    return request('/listingInfo/save', true, 'post', data);
  },
  listingDetail: function listingDetail(id) {
    return request('/listingInfo/detail', true, 'get', { id: id });
  },
  listingCancel: function listingCancel(token, id) {
    return request('/listingInfo/cancel', true, 'post', { token: token, id: id });
  },
  listingSuccess: function listingSuccess(token, id) {
    return request('/listingInfo/success', true, 'post', { token: token, id: id });
  },
  listingDelete: function listingDelete(token, id) {
    return request('/listingInfo/delete', true, 'post', { token: token, id: id });
  },
  listingAddGoods: function listingAddGoods(data) {
    return request('/listingInfo/addGoods', true, 'post', data);
  },
  listingRemoveGoods: function listingRemoveGoods(data) {
    return request('/listingInfo/removeGoods', true, 'post', data);
  },
  listingJoinList: function listingJoinList(data) {
    return request('/listingInfo/joinList', true, 'post', data);
  },
  shopIotDevices: data => {
    return request('/shopIot/devices', true, 'get', data)
  },
  shopIotCmds: data => {
    return request('/shopIot/cmds', true, 'get', data)
  },
  shopIotExecute: data => {
    return request('/shopIot/execute', true, 'post', data)
  },
};

/***/ })
/******/ ]);