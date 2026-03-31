"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pickerProps = void 0;
exports.pickerProps = {
    title: String,
    loading: Boolean,
    showToolbar: Boolean,
    cancelButtonText: {
        type: String,
        value: '取消',
    },
    confirmButtonText: {
        type: String,
        value: '确认',
    },
    visibleItemCount: {
        type: Number,
        value: 6,
    },
    itemHeight: {
        type: Number,
        value: 44,
    },
};
