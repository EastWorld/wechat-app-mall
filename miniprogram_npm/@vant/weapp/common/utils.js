"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCurrentPage = exports.toPromise = exports.groupSetData = exports.getAllRect = exports.getRect = exports.pickExclude = exports.requestAnimationFrame = exports.addUnit = exports.nextTick = exports.range = exports.getSystemInfoSync = exports.isDef = void 0;
var validator_1 = require("./validator");
var version_1 = require("./version");
var validator_2 = require("./validator");
Object.defineProperty(exports, "isDef", { enumerable: true, get: function () { return validator_2.isDef; } });
var version_2 = require("./version");
Object.defineProperty(exports, "getSystemInfoSync", { enumerable: true, get: function () { return version_2.getSystemInfoSync; } });
function range(num, min, max) {
    return Math.min(Math.max(num, min), max);
}
exports.range = range;
function nextTick(cb) {
    if ((0, version_1.canIUseNextTick)()) {
        wx.nextTick(cb);
    }
    else {
        setTimeout(function () {
            cb();
        }, 1000 / 30);
    }
}
exports.nextTick = nextTick;
function addUnit(value) {
    if (!(0, validator_1.isDef)(value)) {
        return undefined;
    }
    value = String(value);
    return (0, validator_1.isNumber)(value) ? "".concat(value, "px") : value;
}
exports.addUnit = addUnit;
function requestAnimationFrame(cb) {
    return setTimeout(function () {
        cb();
    }, 1000 / 30);
}
exports.requestAnimationFrame = requestAnimationFrame;
function pickExclude(obj, keys) {
    if (!(0, validator_1.isPlainObject)(obj)) {
        return {};
    }
    return Object.keys(obj).reduce(function (prev, key) {
        if (!keys.includes(key)) {
            prev[key] = obj[key];
        }
        return prev;
    }, {});
}
exports.pickExclude = pickExclude;
function getRect(context, selector) {
    return new Promise(function (resolve) {
        wx.createSelectorQuery()
            .in(context)
            .select(selector)
            .boundingClientRect()
            .exec(function (rect) {
            if (rect === void 0) { rect = []; }
            return resolve(rect[0]);
        });
    });
}
exports.getRect = getRect;
function getAllRect(context, selector) {
    return new Promise(function (resolve) {
        wx.createSelectorQuery()
            .in(context)
            .selectAll(selector)
            .boundingClientRect()
            .exec(function (rect) {
            if (rect === void 0) { rect = []; }
            return resolve(rect[0]);
        });
    });
}
exports.getAllRect = getAllRect;
function groupSetData(context, cb) {
    if ((0, version_1.canIUseGroupSetData)()) {
        context.groupSetData(cb);
    }
    else {
        cb();
    }
}
exports.groupSetData = groupSetData;
function toPromise(promiseLike) {
    if ((0, validator_1.isPromise)(promiseLike)) {
        return promiseLike;
    }
    return Promise.resolve(promiseLike);
}
exports.toPromise = toPromise;
function getCurrentPage() {
    var pages = getCurrentPages();
    return pages[pages.length - 1];
}
exports.getCurrentPage = getCurrentPage;
