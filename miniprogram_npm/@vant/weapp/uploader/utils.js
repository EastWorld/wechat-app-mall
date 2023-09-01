"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.chooseFile = exports.isVideoFile = exports.isImageFile = void 0;
var utils_1 = require("../common/utils");
var validator_1 = require("../common/validator");
function isImageFile(item) {
    if (item.isImage != null) {
        return item.isImage;
    }
    if (item.type) {
        return item.type === 'image';
    }
    if (item.url) {
        return (0, validator_1.isImageUrl)(item.url);
    }
    return false;
}
exports.isImageFile = isImageFile;
function isVideoFile(item) {
    if (item.isVideo != null) {
        return item.isVideo;
    }
    if (item.type) {
        return item.type === 'video';
    }
    if (item.url) {
        return (0, validator_1.isVideoUrl)(item.url);
    }
    return false;
}
exports.isVideoFile = isVideoFile;
function formatImage(res) {
    return res.tempFiles.map(function (item) { return (__assign(__assign({}, (0, utils_1.pickExclude)(item, ['path'])), { type: 'image', url: item.tempFilePath || item.path, thumb: item.tempFilePath || item.path })); });
}
function formatVideo(res) {
    return [
        __assign(__assign({}, (0, utils_1.pickExclude)(res, ['tempFilePath', 'thumbTempFilePath', 'errMsg'])), { type: 'video', url: res.tempFilePath, thumb: res.thumbTempFilePath }),
    ];
}
function formatMedia(res) {
    return res.tempFiles.map(function (item) { return (__assign(__assign({}, (0, utils_1.pickExclude)(item, ['fileType', 'thumbTempFilePath', 'tempFilePath'])), { type: res.type, url: item.tempFilePath, thumb: res.type === 'video' ? item.thumbTempFilePath : item.tempFilePath })); });
}
function formatFile(res) {
    return res.tempFiles.map(function (item) { return (__assign(__assign({}, (0, utils_1.pickExclude)(item, ['path'])), { url: item.path })); });
}
function chooseFile(_a) {
    var accept = _a.accept, multiple = _a.multiple, capture = _a.capture, compressed = _a.compressed, maxDuration = _a.maxDuration, sizeType = _a.sizeType, camera = _a.camera, maxCount = _a.maxCount, mediaType = _a.mediaType, extension = _a.extension;
    return new Promise(function (resolve, reject) {
        switch (accept) {
            case 'image':
                if (utils_1.isPC) {
                    wx.chooseImage({
                        count: multiple ? Math.min(maxCount, 9) : 1,
                        sourceType: capture,
                        sizeType: sizeType,
                        success: function (res) { return resolve(formatImage(res)); },
                        fail: reject,
                    });
                }
                else {
                    wx.chooseMedia({
                        count: multiple ? Math.min(maxCount, 9) : 1,
                        mediaType: ['image'],
                        sourceType: capture,
                        maxDuration: maxDuration,
                        sizeType: sizeType,
                        camera: camera,
                        success: function (res) { return resolve(formatImage(res)); },
                        fail: reject,
                    });
                }
                break;
            case 'media':
                wx.chooseMedia({
                    count: multiple ? Math.min(maxCount, 9) : 1,
                    mediaType: mediaType,
                    sourceType: capture,
                    maxDuration: maxDuration,
                    sizeType: sizeType,
                    camera: camera,
                    success: function (res) { return resolve(formatMedia(res)); },
                    fail: reject,
                });
                break;
            case 'video':
                wx.chooseVideo({
                    sourceType: capture,
                    compressed: compressed,
                    maxDuration: maxDuration,
                    camera: camera,
                    success: function (res) { return resolve(formatVideo(res)); },
                    fail: reject,
                });
                break;
            default:
                wx.chooseMessageFile(__assign(__assign({ count: multiple ? maxCount : 1, type: accept }, (extension ? { extension: extension } : {})), { success: function (res) { return resolve(formatFile(res)); }, fail: reject }));
                break;
        }
    });
}
exports.chooseFile = chooseFile;
