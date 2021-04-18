'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.canIUseCanvas2d = exports.canIUseNextTick = exports.canIUseGroupSetData = exports.canIUseAnimate = exports.canIUseFormFieldButton = exports.canIUseModel = void 0;
var utils_1 = require('./utils');
function compareVersion(v1, v2) {
  v1 = v1.split('.');
  v2 = v2.split('.');
  var len = Math.max(v1.length, v2.length);
  while (v1.length < len) {
    v1.push('0');
  }
  while (v2.length < len) {
    v2.push('0');
  }
  for (var i = 0; i < len; i++) {
    var num1 = parseInt(v1[i], 10);
    var num2 = parseInt(v2[i], 10);
    if (num1 > num2) {
      return 1;
    }
    if (num1 < num2) {
      return -1;
    }
  }
  return 0;
}
function gte(version) {
  var system = utils_1.getSystemInfoSync();
  return compareVersion(system.SDKVersion, version) >= 0;
}
function canIUseModel() {
  return gte('2.9.3');
}
exports.canIUseModel = canIUseModel;
function canIUseFormFieldButton() {
  return gte('2.10.3');
}
exports.canIUseFormFieldButton = canIUseFormFieldButton;
function canIUseAnimate() {
  return gte('2.9.0');
}
exports.canIUseAnimate = canIUseAnimate;
function canIUseGroupSetData() {
  return gte('2.4.0');
}
exports.canIUseGroupSetData = canIUseGroupSetData;
function canIUseNextTick() {
  return wx.canIUse('nextTick');
}
exports.canIUseNextTick = canIUseNextTick;
function canIUseCanvas2d() {
  return gte('2.9.0');
}
exports.canIUseCanvas2d = canIUseCanvas2d;
