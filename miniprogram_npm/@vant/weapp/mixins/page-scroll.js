"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pageScrollMixin = void 0;
var validator_1 = require("../common/validator");
var utils_1 = require("../common/utils");
function onPageScroll(event) {
    var _a = (0, utils_1.getCurrentPage)().vanPageScroller, vanPageScroller = _a === void 0 ? [] : _a;
    vanPageScroller.forEach(function (scroller) {
        if (typeof scroller === 'function') {
            // @ts-ignore
            scroller(event);
        }
    });
}
function pageScrollMixin(scroller) {
    return Behavior({
        attached: function () {
            var page = (0, utils_1.getCurrentPage)();
            if (!(0, utils_1.isDef)(page)) {
                return;
            }
            var _scroller = scroller.bind(this);
            var _a = page.vanPageScroller, vanPageScroller = _a === void 0 ? [] : _a;
            if ((0, validator_1.isFunction)(page.onPageScroll) && page.onPageScroll !== onPageScroll) {
                vanPageScroller.push(page.onPageScroll.bind(page));
            }
            vanPageScroller.push(_scroller);
            page.vanPageScroller = vanPageScroller;
            page.onPageScroll = onPageScroll;
            this._scroller = _scroller;
        },
        detached: function () {
            var _this = this;
            var page = (0, utils_1.getCurrentPage)();
            if (!(0, utils_1.isDef)(page) || !(0, utils_1.isDef)(page.vanPageScroller)) {
                return;
            }
            var vanPageScroller = page.vanPageScroller;
            var index = vanPageScroller.findIndex(function (v) { return v === _this._scroller; });
            if (index > -1) {
                page.vanPageScroller.splice(index, 1);
            }
            this._scroller = undefined;
        },
    });
}
exports.pageScrollMixin = pageScrollMixin;
