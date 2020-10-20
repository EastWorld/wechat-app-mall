'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.isVideoUrl = exports.isImageUrl = exports.isBoolean = exports.isNumber = exports.isObj = exports.isDef = exports.isPromise = exports.isPlainObject = exports.isFunction = void 0;
function isFunction(val) {
  return typeof val === 'function';
}
exports.isFunction = isFunction;
function isPlainObject(val) {
  return val !== null && typeof val === 'object' && !Array.isArray(val);
}
exports.isPlainObject = isPlainObject;
function isPromise(val) {
  return isPlainObject(val) && isFunction(val.then) && isFunction(val.catch);
}
exports.isPromise = isPromise;
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
function isBoolean(value) {
  return typeof value === 'boolean';
}
exports.isBoolean = isBoolean;
var IMAGE_REGEXP = /\.(jpeg|jpg|gif|png|svg|webp|jfif|bmp|dpg)/i;
var VIDEO_REGEXP = /\.(mp4|mpg|mpeg|dat|asf|avi|rm|rmvb|mov|wmv|flv|mkv)/i;
function isImageUrl(url) {
  return IMAGE_REGEXP.test(url);
}
exports.isImageUrl = isImageUrl;
function isVideoUrl(url) {
  return VIDEO_REGEXP.test(url);
}
exports.isVideoUrl = isVideoUrl;
