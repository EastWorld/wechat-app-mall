"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var IMAGE_EXT = ['jpeg', 'jpg', 'gif', 'png', 'svg', 'webp'];
function isImageUrl(url) {
    return IMAGE_EXT.some(function (ext) { return url.indexOf("." + ext) !== -1 || url.indexOf("." + ext.toLocaleUpperCase()) !== -1; }); // 有些七牛返回来的后缀的大写，加以判断
}
exports.isImageUrl = isImageUrl;
function isImageFile(item) {
    if (item.type) {
        return item.type.indexOf('image') === 0;
    }
    if (item.path) {
        return isImageUrl(item.path);
    }
    if (item.url) {
        return isImageUrl(item.url);
    }
    return false;
}
exports.isImageFile = isImageFile;
function isVideo(res, accept) {
    return accept === 'video';
}
exports.isVideo = isVideo;
function chooseFile(_a) {
    var accept = _a.accept, multiple = _a.multiple, capture = _a.capture, compressed = _a.compressed, maxDuration = _a.maxDuration, sizeType = _a.sizeType, camera = _a.camera, maxCount = _a.maxCount;
    if (accept === 'image') {
        return new Promise(function (resolve, reject) {
            wx.chooseImage({
                count: multiple ? Math.min(maxCount, 9) : 1,
                sourceType: capture,
                sizeType: sizeType,
                success: resolve,
                fail: reject
            });
        });
    }
    if (accept === 'video') {
        return new Promise(function (resolve, reject) {
            wx.chooseVideo({
                sourceType: capture,
                compressed: compressed,
                maxDuration: maxDuration,
                camera: camera,
                success: resolve,
                fail: reject
            });
        });
    }
    return new Promise(function (resolve, reject) {
        wx.chooseMessageFile({
            count: multiple ? maxCount : 1,
            type: 'file',
            success: resolve,
            fail: reject
        });
    });
}
exports.chooseFile = chooseFile;
function isFunction(val) {
    return typeof val === 'function';
}
exports.isFunction = isFunction;
function isObject(val) {
    return val !== null && typeof val === 'object';
}
exports.isObject = isObject;
function isPromise(val) {
    return isObject(val) && isFunction(val.then) && isFunction(val.catch);
}
exports.isPromise = isPromise;
