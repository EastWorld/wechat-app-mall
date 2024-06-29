"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.textareaProps = exports.inputProps = exports.commonProps = void 0;
exports.commonProps = {
    value: String,
    placeholder: String,
    placeholderStyle: String,
    placeholderClass: String,
    disabled: Boolean,
    maxlength: {
        type: Number,
        value: -1,
    },
    cursorSpacing: {
        type: Number,
        value: 50,
    },
    autoFocus: Boolean,
    focus: Boolean,
    cursor: {
        type: Number,
        value: -1,
    },
    selectionStart: {
        type: Number,
        value: -1,
    },
    selectionEnd: {
        type: Number,
        value: -1,
    },
    adjustPosition: {
        type: Boolean,
        value: true,
    },
    holdKeyboard: Boolean,
};
exports.inputProps = {
    type: {
        type: String,
        value: 'text',
    },
    password: Boolean,
    confirmType: String,
    confirmHold: Boolean,
    alwaysEmbed: Boolean,
};
exports.textareaProps = {
    autoHeight: Boolean,
    fixed: Boolean,
    showConfirmBar: {
        type: Boolean,
        value: true,
    },
    disableDefaultPadding: {
        type: Boolean,
        value: true,
    },
};
