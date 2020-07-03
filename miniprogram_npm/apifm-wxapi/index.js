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

var request = function request(url, needSubDomain, method, data) {
  var _url = API_BASE_URL + (needSubDomain ? '/' + subDomain : '') + url;
  return new Promise(function (resolve, reject) {
    wx.request({
      url: _url,
      method: method,
      data: data,
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
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
Promise.prototype.finally = function (callback) {
  var Promise = this.constructor;
  return this.then(function (value) {
    Promise.resolve(callback()).then(function () {
      return value;
    });
  }, function (reason) {
    Promise.resolve(callback()).then(function () {
      throw reason;
    });
  });
};

module.exports = {
  init2: function init2(a, b) {
    API_BASE_URL = a;
    subDomain = b;
  },
  init: function init(b) {
    subDomain = b;
  },
  request: request,
  queryMobileLocation: function queryMobileLocation() {
    var mobile = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

    return request('/common/mobile-segment/location', false, 'get', { mobile: mobile });
  },
  nextMobileSegment: function nextMobileSegment(data) {
    return request('/common/mobile-segment/next', false, 'post', data);
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
  wxpay: function wxpay(data) {
    return request('/pay/wx/wxapp', true, 'post', data);
  },
  ttpay: function ttpay(data) {
    return request('/pay/tt/microapp', true, 'post', data);
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
  alipay: function alipay(data) {
    return request('/pay/alipay/semiAutomatic/payurl', true, 'post', data);
  },
  login_wx: function login_wx(code) {
    return request('/user/wxapp/login', true, 'post', {
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
  register_complex: function register_complex(data) {
    return request('/user/wxapp/register/complex', true, 'post', data);
  },
  register_simple: function register_simple(data) {
    return request('/user/wxapp/register/simple', true, 'post', data);
  },
  register_username: function register_username(data) {
    return request('/user/username/register', true, 'post', data);
  },
  register_mobile: function register_mobile(data) {
    return request('/user/m/register', true, 'post', data);
  },
  banners: function banners(data) {
    return request('/banner/list', true, 'get', data);
  },
  goodsCategory: function goodsCategory() {
    return request('/shop/goods/category/all', true, 'get');
  },
  goodsCategoryDetail: function goodsCategoryDetail(id) {
    return request('/shop/goods/category/info', true, 'get', { id: id });
  },
  goods: function goods(data) {
    return request('/shop/goods/list', true, 'post', data);
  },
  goodsDetail: function goodsDetail(id) {
    return request('/shop/goods/detail', true, 'get', {
      id: id
    });
  },
  goodsLimitations: function goodsLimitations(goodsId) {
    var priceId = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';

    return request('/shop/goods/limitation', true, 'get', {
      goodsId: goodsId, priceId: priceId
    });
  },
  goodsPrice: function goodsPrice(goodsId, propertyChildIds) {
    return request('/shop/goods/price', true, 'post', {
      goodsId: goodsId, propertyChildIds: propertyChildIds
    });
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
  goodsFavList: function goodsFavList(data) {
    return request('/shop/goods/fav/list', true, 'post', data);
  },
  goodsFavPut: function goodsFavPut(token, goodsId) {
    return request('/shop/goods/fav/add', true, 'post', {
      token: token, goodsId: goodsId
    });
  },
  goodsFavCheck: function goodsFavCheck(token, goodsId) {
    return request('/shop/goods/fav/check', true, 'get', {
      token: token, goodsId: goodsId
    });
  },
  goodsFavDelete: function goodsFavDelete(token) {
    var id = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
    var goodsId = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';

    return request('/shop/goods/fav/delete', true, 'post', {
      token: token, id: id, goodsId: goodsId
    });
  },
  coupons: function coupons(data) {
    return request('/discounts/coupons', true, 'get', data);
  },
  couponDetail: function couponDetail(id) {
    return request('/discounts/detail', true, 'get', {
      id: id
    });
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
    return request('/discounts/exchange', true, 'post', {
      token: token, number: number, pwd: pwd
    });
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
  pingtuanOpen: function pingtuanOpen(token, goodsId) {
    return request('/shop/goods/pingtuan/open', true, 'post', {
      goodsId: goodsId,
      token: token
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
  friendUserDetail: function friendUserDetail(token, uid) {
    return request('/user/friend/detail', true, 'get', { token: token, uid: uid });
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
  userWxinfo: function userWxinfo(token) {
    return request('/user/wxinfo', true, 'get', {
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

    return request('/order/detail', true, 'get', {
      id: id,
      token: token,
      hxNumber: hxNumber
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
  orderHX: function orderHX(hxNumber) {
    return request('/order/hx', true, 'post', {
      hxNumber: hxNumber
    });
  },
  orderStatistics: function orderStatistics(token) {
    return request('/order/statistics', true, 'get', {
      token: token
    });
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
  withDrawDetail: function withDrawDetail(token, id) {
    return request('/user/withDraw/detail', true, 'get', {
      token: token,
      id: id
    });
  },
  withDrawLogs: function withDrawLogs(data) {
    return request('/user/withDraw/list', true, 'post', data);
  },
  province: function province() {
    return request('/common/region/v2/province', false, 'get');
  },
  nextRegion: function nextRegion(pid) {
    return request('/common/region/v2/child', false, 'get', {
      pid: pid
    });
  },
  cashLogs: function cashLogs(data) {
    return request('/user/cashLog', true, 'post', data);
  },
  cashLogsV2: function cashLogsV2(data) {
    return request('/user/cashLog/v2', true, 'post', data);
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
    return request('/payBill/pay', true, 'post', { token: token, money: money });
  },
  vipLevel: function vipLevel() {
    return request('/config/vipLevel', true, 'get');
  },
  fxApply: function fxApply(token, name, mobile) {
    return request('/saleDistribution/apply', true, 'post', { token: token, name: name, mobile: mobile });
  },
  fxApplyProgress: function fxApplyProgress(token) {
    return request('/saleDistribution/apply/progress', true, 'get', { token: token });
  },
  fxMembers: function fxMembers(data) {
    return request('/saleDistribution/members', true, 'post', data);
  },
  fxCommisionLog: function fxCommisionLog(data) {
    return request('/saleDistribution/commision/log', true, 'post', data);
  },
  wxaQrcode: function wxaQrcode(data) {
    return request('/qrcode/wxa/unlimit', true, 'post', data);
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
  uploadFileFromUrl: function uploadFileFromUrl() {
    var remoteFileUrl = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    var ext = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';

    return request('/dfs/upload/url', true, 'post', { remoteFileUrl: remoteFileUrl, ext: ext });
  },
  uploadFileList: function uploadFileList() {
    var path = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

    return request('/dfs/upload/list', true, 'post', { path: path });
  },
  refundApply: function refundApply(data) {
    return request('/order/refundApply/apply', true, 'post', data);
  },
  refundApplyDetail: function refundApplyDetail(token, orderId) {
    return request('/order/refundApply/info', true, 'get', {
      token: token,
      orderId: orderId
    });
  },
  refundApplyCancel: function refundApplyCancel(token, orderId) {
    return request('/order/refundApply/cancel', true, 'post', {
      token: token,
      orderId: orderId
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
  cmsArticleUsefulLogs: function cmsArticleUsefulLogs(data) {
    return request('/cms/news/useful/logs', true, 'post', data);
  },
  cmsArticleDetail: function cmsArticleDetail(id) {
    return request('/cms/news/detail', true, 'get', { id: id });
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
  cmsPage: function cmsPage(key) {
    return request('/cms/page/info/v2', true, 'get', { key: key });
  },
  cmsTags: function cmsTags() {
    return request('/cms/tags/list', true, 'get', {});
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
  addComment: function addComment(data) {
    return request('/comment/add', true, 'post', data);
  },
  commentList: function commentList(data) {
    return request('/comment/list', true, 'post', data);
  },
  modifyUserInfo: function modifyUserInfo(data) {
    return request('/user/modify', true, 'post', data);
  },
  modifyUserPassword: function modifyUserPassword(token, pwdOld, pwdNew) {
    return request('/user/modify/password', true, 'post', { token: token, pwdOld: pwdOld, pwdNew: pwdNew });
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
  jsonSet: function jsonSet(data) {
    return request('/json/set', true, 'post', data);
  },
  jsonDelete: function jsonDelete() {
    var token = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    var id = arguments[1];

    return request('/json/delete', true, 'post', { token: token, id: id });
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
  smsValidateCode: function smsValidateCode(mobile) {
    var key = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
    var picCode = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';

    return request('/verification/sms/get', true, 'get', { mobile: mobile, key: key, picCode: picCode });
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
  mapQQAddress: function mapQQAddress() {
    var location = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    var coord_type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '5';

    return request('/common/map/qq/address', false, 'get', { location: location, coord_type: coord_type });
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
  loginout: function loginout(token) {
    return request('/user/loginout', true, 'get', { token: token });
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
  encryptedData: function encryptedData(code, _encryptedData, iv) {
    return request('/user/wxapp/decode/encryptedData', true, 'post', {
      code: code, encryptedData: _encryptedData, iv: iv
    });
  },
  scoreDeductionRules: function scoreDeductionRules() {
    var type = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

    return request('/score/deduction/rules', true, 'get', { type: type });
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
  myVote: function myVote(token, voteId) {
    return request('/vote/vote/info', true, 'get', {
      token: token, voteId: voteId
    });
  },
  voteLogs: function voteLogs(data) {
    return request('/vote/vote/list', true, 'post', data);
  },
  yuyueItems: function yuyueItems(data) {
    return request('/yuyue/items', true, 'post', data);
  },
  yuyueItemDetail: function yuyueItemDetail(id) {
    return request('/yuyue/info', true, 'get', { id: id });
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

    return request('/user/email/bindUsername', true, 'post', {
      token: token, email: email, code: code, pwd: pwd
    });
  },
  siteStatistics: function siteStatistics() {
    return request('/site/statistics', true, 'get');
  },
  goodsDynamic: function goodsDynamic(type) {
    return request('/site/goods/dynamic', true, 'get', { type: type });
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
  cmsArticleFavDeleteById: function cmsArticleFavDeleteById(token, id) {
    return request('/cms/news/fav/delete', true, 'post', { token: token, id: id });
  },
  cmsArticleFavDeleteByNewsId: function cmsArticleFavDeleteByNewsId(token, newsId) {
    return request('/cms/news/fav/delete', true, 'post', { token: token, newsId: newsId });
  },
  shippingCarInfo: function shippingCarInfo(token) {
    return request('/shopping-cart/info', true, 'get', {
      token: token
    });
  },
  shippingCarInfoAddItem: function shippingCarInfoAddItem(token, goodsId, number, sku) {
    return request('/shopping-cart/add', true, 'post', {
      token: token, goodsId: goodsId, number: number, sku: JSON.stringify(sku)
    });
  },
  shippingCarInfoModifyNumber: function shippingCarInfoModifyNumber(token, key, number) {
    return request('/shopping-cart/modifyNumber', true, 'post', {
      token: token, key: key, number: number
    });
  },
  shippingCarInfoRemoveItem: function shippingCarInfoRemoveItem(token, key) {
    return request('/shopping-cart/remove', true, 'post', {
      token: token, key: key
    });
  },
  shippingCarInfoRemoveAll: function shippingCarInfoRemoveAll(token) {
    return request('/shopping-cart/empty', true, 'post', {
      token: token
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
  }
};

/***/ })
/******/ ]);