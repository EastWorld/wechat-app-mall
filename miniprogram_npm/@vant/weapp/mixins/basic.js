"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.basic = Behavior({
    methods: {
        $emit: function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            this.triggerEvent.apply(this, args);
        },
        set: function (data, callback) {
            this.setData(data, callback);
            return new Promise(function (resolve) { return wx.nextTick(resolve); });
        },
        getRect: function (selector, all) {
            var _this = this;
            return new Promise(function (resolve) {
                wx.createSelectorQuery()
                    .in(_this)[all ? 'selectAll' : 'select'](selector)
                    .boundingClientRect(function (rect) {
                    if (all && Array.isArray(rect) && rect.length) {
                        resolve(rect);
                    }
                    if (!all && rect) {
                        resolve(rect);
                    }
                })
                    .exec();
            });
        }
    }
});
