'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.requestAnimationFrame = exports.addUnit = exports.getSystemInfoSync = exports.nextTick = exports.range = exports.isNumber = exports.isObj = exports.isDef = void 0;
function isDef(value) {
  return value !== undefined && value !== null;
}
exports.isDef = isDef;
function isObj(x) {
  var type = typeof x;
  return x !== null && (type === 'object' || type === 'function');
}
exports.isObj = isObj;
function isNumber(value) {
  return /^\d+(\.\d+)?$/.test(value);
}
exports.isNumber = isNumber;
function range(num, min, max) {
  return Math.min(Math.max(num, min), max);
}
exports.range = range;
function nextTick(fn) {
  setTimeout(function () {
    fn();
  }, 1000 / 30);
}
exports.nextTick = nextTick;
var systemInfo = null;
function getSystemInfoSync() {
  if (systemInfo == null) {
    systemInfo = wx.getSystemInfoSync();
  }
  return systemInfo;
}
exports.getSystemInfoSync = getSystemInfoSync;
function addUnit(value) {
  if (!isDef(value)) {
    return undefined;
  }
  value = String(value);
  return isNumber(value) ? value + 'px' : value;
}
exports.addUnit = addUnit;
function requestAnimationFrame(cb) {
  var systemInfo = getSystemInfoSync();
  if (systemInfo.platform === 'devtools') {
    return nextTick(cb);
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
