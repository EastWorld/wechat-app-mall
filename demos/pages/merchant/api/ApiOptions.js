var e = require("../../../@babel/runtime/helpers/interopRequireDefault"), t = e(require("../../../@babel/runtime/helpers/classCallCheck")), i = e(require("../../../@babel/runtime/helpers/createClass")), n = "".concat("https://app.gz11shop.com/swjk/api/mono"), a = [ "name", "version", "app_key", "data", "format", "timestamp" ], o = require("md5"), s = require("../dateformat"), r = function() {
    function e(i, a) {
        var o = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : "POST";
        (0, t.default)(this, e), this.data = encodeURIComponent(JSON.stringify(a || {})), 
        this.format = "json", this.name = i, this.version = "1.0", this.app_key = "test", 
        this.secret = "Yzkj_5GBaby", this.isSilence = !1, this.options = {
            url: n,
            data: {
                data: this.data
            },
            file: a,
            method: o
        };
    }
    return (0, i.default)(e, [ {
        key: "setParams",
        value: function(e) {
            return this.options.data = e || {}, this;
        }
    }, {
        key: "setSilence",
        value: function(e) {
            return this.isSilence = e || !1, this;
        }
    }, {
        key: "setHeaders",
        value: function(e) {
            return this.options.header = e || {}, this;
        }
    }, {
        key: "showLoading",
        value: function() {
            wx.showLoading({
                title: "请稍等...",
                mask: !0
            });
        }
    }, {
        key: "hideLoading",
        value: function() {
            wx.hideLoading();
        }
    }, {
        key: "showModal",
        value: function(e, t) {
            wx.showModal({
                title: e,
                content: t
            });
        }
    }, {
        key: "signature",
        value: function() {
            this.timestamp = s(new Date(), "yyyy-mm-dd HH:MM:ss");
            var e = this, t = [];
            a.sort().forEach(function(i) {
                var n = e[i];
                n && (t.push(i), t.push(n), e.options.data[i] = n);
            });
            var i = e.secret;
            return e.options.data.timestamp = e.timestamp, e.options.data.sign = o("" + i + t.join("") + i).toUpperCase(), 
            e;
        }
    }, {
        key: "request",
        value: function() {
            var e = this;
            e.isSilence || e.showLoading();
            var t = e.options || {};
            return new Promise(function(i, n) {
                function a(e) {
                    n(e);
                }
                t.complete = function() {
                    e.hideLoading();
                }, t.success = function(n) {
                    var o = n.data || {};
                    if (console.log(t.url, t.data, o), "string" == typeof o.code) {
                        var s = /(unknown)/g.test(o.msg);
                        "0" === o.code ? i(o) : o.msg && !s ? (e.showModal("抱歉", o.msg), a(new Error(o.msg))) : a(new Error("网络异常，请稍后重试"));
                    } else a(new Error(n.errMsg));
                }, t.fail = a, wx.request(t);
            });
        }
    }, {
        key: "uploadFile",
        value: function() {
            console.log(this);
            var e = this.options, t = this.name;
            return new Promise(function(i, n) {
                wx.uploadFile({
                    url: e.url.replace("api/mono", "") + t,
                    header: {
                        "content-Type": "multipart/form-data"
                    },
                    filePath: e.file.file,
                    name: "image",
                    success: function(e) {
                        console.log(e);
                        var t = JSON.parse(e.data);
                        console.log(t), t && i(t);
                    },
                    fail: function(e) {
                        n(e);
                    }
                });
            });
        }
    } ]), e;
}();

module.exports = {
    ApiOptions: r,
    TEST: !1,
    DOMAIN: n
};