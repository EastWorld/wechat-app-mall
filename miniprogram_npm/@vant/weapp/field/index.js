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
var utils_1 = require("../common/utils");
var component_1 = require("../common/component");
var props_1 = require("./props");
(0, component_1.VantComponent)({
    field: true,
    classes: ['input-class', 'right-icon-class', 'label-class'],
    props: __assign(__assign(__assign(__assign({}, props_1.commonProps), props_1.inputProps), props_1.textareaProps), { size: String, icon: String, label: String, error: Boolean, center: Boolean, isLink: Boolean, leftIcon: String, rightIcon: String, autosize: null, required: Boolean, iconClass: String, clickable: Boolean, inputAlign: String, customStyle: String, errorMessage: String, arrowDirection: String, showWordLimit: Boolean, errorMessageAlign: String, readonly: {
            type: Boolean,
            observer: 'setShowClear',
        }, clearable: {
            type: Boolean,
            observer: 'setShowClear',
        }, clearTrigger: {
            type: String,
            value: 'focus',
        }, border: {
            type: Boolean,
            value: true,
        }, titleWidth: {
            type: String,
            value: '6.2em',
        }, clearIcon: {
            type: String,
            value: 'clear',
        }, extraEventParams: {
            type: Boolean,
            value: false,
        } }),
    data: {
        focused: false,
        innerValue: '',
        showClear: false,
    },
    created: function () {
        this.value = this.data.value;
        this.setData({ innerValue: this.value });
    },
    methods: {
        formatValue: function (value) {
            var maxlength = this.data.maxlength;
            if (maxlength !== -1 && value.length > maxlength) {
                return value.slice(0, maxlength);
            }
            return value;
        },
        onInput: function (event) {
            var _a = (event.detail || {}).value, value = _a === void 0 ? '' : _a;
            var formatValue = this.formatValue(value);
            this.value = formatValue;
            this.setShowClear();
            return this.emitChange(__assign(__assign({}, event.detail), { value: formatValue }));
        },
        onFocus: function (event) {
            this.focused = true;
            this.setShowClear();
            this.$emit('focus', event.detail);
        },
        onBlur: function (event) {
            this.focused = false;
            this.setShowClear();
            this.$emit('blur', event.detail);
        },
        onClickIcon: function () {
            this.$emit('click-icon');
        },
        onClickInput: function (event) {
            this.$emit('click-input', event.detail);
        },
        onClear: function () {
            var _this = this;
            this.setData({ innerValue: '' });
            this.value = '';
            this.setShowClear();
            (0, utils_1.nextTick)(function () {
                _this.emitChange({ value: '' });
                _this.$emit('clear', '');
            });
        },
        onConfirm: function (event) {
            var _a = (event.detail || {}).value, value = _a === void 0 ? '' : _a;
            this.value = value;
            this.setShowClear();
            this.$emit('confirm', value);
        },
        setValue: function (value) {
            this.value = value;
            this.setShowClear();
            if (value === '') {
                this.setData({ innerValue: '' });
            }
            this.emitChange({ value: value });
        },
        onLineChange: function (event) {
            this.$emit('linechange', event.detail);
        },
        onKeyboardHeightChange: function (event) {
            this.$emit('keyboardheightchange', event.detail);
        },
        emitChange: function (detail) {
            var extraEventParams = this.data.extraEventParams;
            this.setData({ value: detail.value });
            var result;
            var data = extraEventParams
                ? __assign(__assign({}, detail), { callback: function (data) {
                        result = data;
                    } }) : detail.value;
            this.$emit('input', data);
            this.$emit('change', data);
            return result;
        },
        setShowClear: function () {
            var _a = this.data, clearable = _a.clearable, readonly = _a.readonly, clearTrigger = _a.clearTrigger;
            var _b = this, focused = _b.focused, value = _b.value;
            var showClear = false;
            if (clearable && !readonly) {
                var hasValue = !!value;
                var trigger = clearTrigger === 'always' || (clearTrigger === 'focus' && focused);
                showClear = hasValue && trigger;
            }
            this.setData({ showClear: showClear });
        },
        noop: function () { },
    },
});
