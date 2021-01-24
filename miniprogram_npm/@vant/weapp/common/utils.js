'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.getCurrentPage = exports.toPromise = exports.groupSetData = exports.getAllRect = exports.getRect = exports.pickExclude = exports.requestAnimationFrame = exports.addUnit = exports.getSystemInfoSync = exports.nextTick = exports.range = void 0;
var validator_1 = require('./validator');
var version_1 = require('./version');
function range(num, min, max) {
  return Math.min(Math.max(num, min), max);
}
exports.range = range;
function nextTick(cb) {
  if (version_1.canIUseNextTick()) {
    wx.nextTick(cb);
  } else {
    setTimeout(function () {
      cb();
    }, 1000 / 30);
  }
}
exports.nextTick = nextTick;
var systemInfo;
function getSystemInfoSync() {
  if (systemInfo == null) {
    systemInfo = wx.getSystemInfoSync();
  }
  return systemInfo;
}
exports.getSystemInfoSync = getSystemInfoSync;
function addUnit(value) {
  if (!validator_1.isDef(value)) {
    return undefined;
  }
  value = String(value);
  return validator_1.isNumber(value) ? value + 'px' : value;
}
exports.addUnit = addUnit;
function requestAnimationFrame(cb) {
  var systemInfo = getSystemInfoSync();
  if (systemInfo.platform === 'devtools') {
    return setTimeout(function () {
      cb();
    }, 1000 / 30);
  }
  return wx
    .createSelectorQuery()
    .selectViewport()
    .boundingClientRect()
    .exec(function () {
      cb();
    });
}
exports.requestAnimationFrame = requestAnimationFrame;
function pickExclude(obj, keys) {
  if (!validator_1.isPlainObject(obj)) {
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
        if (rect === void 0) {
          rect = [];
        }
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
        if (rect === void 0) {
          rect = [];
        }
        return resolve(rect[0]);
      });
  });
}
exports.getAllRect = getAllRect;
function groupSetData(context, cb) {
  if (version_1.canIUseGroupSetData()) {
    context.groupSetData(cb);
  } else {
    cb();
  }
}
exports.groupSetData = groupSetData;
function toPromise(promiseLike) {
  if (validator_1.isPromise(promiseLike)) {
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
