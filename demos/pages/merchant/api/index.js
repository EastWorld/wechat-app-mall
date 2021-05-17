var e, t = require("../../../@babel/runtime/helpers/interopRequireDefault")(require("../../../@babel/runtime/helpers/defineProperty")), r = require("./ApiOptions"), n = r.ApiOptions, u = r.TEST, a = r.DOMAIN, i = "POST", s = function(e, t) {
    var r = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : "POST", u = wx.getStorageSync("userInfo") || {}, a = u.jwt;
    return new n(e, t, r).setHeaders({
        Authorization: "Bearer ".concat(a)
    }).signature();
};

module.exports = (e = {
    TEST: u,
    DOMAIN: a,
    wechatAuth: function(e) {
        return new n("swjk.manager.user.wx.login", {
            code: e
        }, i).signature().request();
    },
    bindPhone: function(e) {
        return s("swjk.manager.user.bind.wx", e).request();
    },
    sendSms: function(e) {
        return s("sms.send.randomcode", e).request();
    }
}, (0, t.default)(e, "bindPhone", function(e) {
    return s("swjk.manager.user.bind.wx", e).request();
}), (0, t.default)(e, "getOrderList", function(e) {
    return s("swjk.order.page", e).request();
}), (0, t.default)(e, "getOrderDetail", function(e) {
    return s("swjk.order.detail", e).request();
}), (0, t.default)(e, "getOrder", function(e) {
    return s("swjk.order.create", e).request();
}), (0, t.default)(e, "getTradePay", function(e) {
    return s("trade.pay", e).request();
}), (0, t.default)(e, "getProductList", function(e) {
    return s("swjk.product.page", e).request();
}), (0, t.default)(e, "getProductDetail", function(e) {
    return s("swjk.product.detail", e).request();
}), (0, t.default)(e, "getPlatformList", function(e) {
    return new n("platform.config.maincode", e, i).signature().request();
}), (0, t.default)(e, "getAreaList", function() {
    var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
    return new n("district.select.list", e, i).signature().request();
}), (0, t.default)(e, "getBankList", function() {
    var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
    return new n("bank.select.list", e, i).signature().request();
}), (0, t.default)(e, "getCategoryList", function() {
    var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
    return new n("company.mcc.list", e, i).signature().request();
}), (0, t.default)(e, "companyCreate", function() {
    var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
    return new n("company.input.create", e, i).signature().request();
}), (0, t.default)(e, "uploadFileImage", function(e) {
    return new n("bestpay/file/upload", {
        file: e
    }).signature().uploadFile();
}), (0, t.default)(e, "getCompanyList", function(e) {
    return s("company.input.list", e).request();
}), (0, t.default)(e, "getCompanyDetail", function(e) {
    return s("company.input.detail", e).request();
}), (0, t.default)(e, "getCompanyUpdate", function(e) {
    return s("company.input.update", e).request();
}), e);