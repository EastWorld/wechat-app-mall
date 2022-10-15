"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pageScrollMixin = void 0;
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
var pageScrollMixin = function (scroller) {
    return Behavior({
        attached: function () {
            var page = (0, utils_1.getCurrentPage)();
            if (!(0, utils_1.isDef)(page)) {
                return;
            }
            if (Array.isArray(page.vanPageScroller)) {
                page.vanPageScroller.push(scroller.bind(this));
            }
            else {
                page.vanPageScroller =
                    typeof page.onPageScroll === 'function'
                        ? [page.onPageScroll.bind(page), scroller.bind(this)]
                        : [scroller.bind(this)];
            }
            page.onPageScroll = onPageScroll;
        },
        detached: function () {
            var _a;
            var page = (0, utils_1.getCurrentPage)();
            if ((0, utils_1.isDef)(page)) {
                page.vanPageScroller =
                    ((_a = page.vanPageScroller) === null || _a === void 0 ? void 0 : _a.filter(function (item) { return item !== scroller; })) || [];
            }
        },
    });
};
exports.pageScrollMixin = pageScrollMixin;
