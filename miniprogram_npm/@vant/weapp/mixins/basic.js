"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.basic = void 0;
exports.basic = Behavior({
    methods: {
        $emit: function (name, detail, options) {
            this.triggerEvent(name, detail, options);
        },
        set: function (data) {
            this.setData(data);
            return new Promise(function (resolve) { return wx.nextTick(resolve); });
        },
        // high performance setData
        setView: function (data, callback) {
            var _this = this;
            var target = {};
            var hasChange = false;
            Object.keys(data).forEach(function (key) {
                if (data[key] !== _this.data[key]) {
                    target[key] = data[key];
                    hasChange = true;
                }
            });
            if (hasChange) {
                return this.setData(target, callback);
            }
            return callback && callback();
        },
    },
});
