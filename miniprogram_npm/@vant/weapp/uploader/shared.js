"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.messageFileProps = exports.mediaProps = exports.videoProps = exports.imageProps = void 0;
// props for image
exports.imageProps = {
    sizeType: {
        type: Array,
        value: ['original', 'compressed'],
    },
    capture: {
        type: Array,
        value: ['album', 'camera'],
    },
    showmenu: {
        type: Boolean,
        value: true,
    },
};
// props for video
exports.videoProps = {
    capture: {
        type: Array,
        value: ['album', 'camera'],
    },
    compressed: {
        type: Boolean,
        value: true,
    },
    maxDuration: {
        type: Number,
        value: 60,
    },
    camera: {
        type: String,
        value: 'back',
    },
    referrerPolicy: {
        type: String,
        value: 'no-referrer',
    },
};
// props for media
exports.mediaProps = {
    capture: {
        type: Array,
        value: ['album', 'camera'],
    },
    mediaType: {
        type: Array,
        value: ['image', 'video', 'mix'],
    },
    maxDuration: {
        type: Number,
        value: 60,
    },
    camera: {
        type: String,
        value: 'back',
    },
};
// props for file
exports.messageFileProps = {
    extension: null,
    previewFile: {
        type: Boolean,
        value: true,
    },
};
