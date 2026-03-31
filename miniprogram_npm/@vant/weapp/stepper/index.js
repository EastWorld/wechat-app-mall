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
var component_1 = require("../common/component");
var validator_1 = require("../common/validator");
var LONG_PRESS_START_TIME = 600;
var LONG_PRESS_INTERVAL = 200;
// add num and avoid float number
function add(num1, num2) {
    var cardinal = Math.pow(10, 10);
    return Math.round((num1 + num2) * cardinal) / cardinal;
}
function equal(value1, value2) {
    return String(value1) === String(value2);
}
(0, component_1.VantComponent)({
    field: true,
    classes: ['input-class', 'plus-class', 'minus-class'],
    props: {
        value: {
            type: null,
        },
        integer: {
            type: Boolean,
            observer: 'check',
        },
        disabled: Boolean,
        inputWidth: String,
        buttonSize: String,
        asyncChange: Boolean,
        disableInput: Boolean,
        decimalLength: {
            type: Number,
            value: null,
            observer: 'check',
        },
        min: {
            type: null,
            value: 1,
            observer: 'check',
        },
        max: {
            type: null,
            value: Number.MAX_SAFE_INTEGER,
            observer: 'check',
        },
        step: {
            type: null,
            value: 1,
        },
        showPlus: {
            type: Boolean,
            value: true,
        },
        showMinus: {
            type: Boolean,
            value: true,
        },
        disablePlus: Boolean,
        disableMinus: Boolean,
        longPress: {
            type: Boolean,
            value: true,
        },
        theme: String,
        alwaysEmbed: Boolean,
    },
    data: {
        currentValue: '',
    },
    watch: {
        value: function () {
            this.observeValue();
        },
    },
    created: function () {
        this.setData({
            currentValue: this.format(this.data.value).newValue,
        });
    },
    methods: {
        observeValue: function () {
            var value = this.data.value;
            this.setData({ currentValue: this.format(value).newValue });
        },
        check: function () {
            var newValue = this.format(this.data.currentValue).newValue;
            if (!equal(newValue, this.data.currentValue)) {
                this.setData({ currentValue: newValue });
            }
        },
        isDisabled: function (type) {
            var _a = this.data, disabled = _a.disabled, disablePlus = _a.disablePlus, disableMinus = _a.disableMinus, currentValue = _a.currentValue, max = _a.max, min = _a.min;
            if (type === 'plus') {
                return disabled || disablePlus || +currentValue >= +max;
            }
            return disabled || disableMinus || +currentValue <= +min;
        },
        onFocus: function (event) {
            this.$emit('focus', event.detail);
        },
        onBlur: function (event) {
            var data = this.format(event.detail.value);
            this.setData({ currentValue: data.newValue });
            this.emitChange(data);
            this.$emit('blur', __assign(__assign({}, event.detail), { value: +data.newValue }));
        },
        // filter illegal characters
        filter: function (value) {
            value = String(value).replace(/[^0-9.-]/g, '');
            if (this.data.integer && value.indexOf('.') !== -1) {
                value = value.split('.')[0];
            }
            return value;
        },
        format: function (value) {
            // filter illegal characters and format integer
            var safeValue = this.filter(value);
            // format range
            var rangeValue = Math.max(Math.min(this.data.max, +safeValue), this.data.min);
            // format decimal
            var newValue = (0, validator_1.isDef)(this.data.decimalLength)
                ? rangeValue.toFixed(this.data.decimalLength)
                : String(rangeValue);
            return { value: value, newValue: newValue };
        },
        onInput: function (event) {
            var _a = (event.detail || {}).value, value = _a === void 0 ? '' : _a;
            // allow input to be empty
            if (value === '') {
                return;
            }
            var formatted = this.format(value);
            this.emitChange(formatted);
        },
        emitChange: function (data) {
            var value = data.value, newValue = data.newValue;
            if (!this.data.asyncChange) {
                // fix when input 11. parsed to 11, unable to enter decimal
                this.setData({ currentValue: +value === +newValue ? value : newValue });
            }
            this.$emit('change', +newValue);
        },
        onChange: function () {
            var type = this.type;
            if (this.isDisabled(type)) {
                this.$emit('overlimit', type);
                return;
            }
            var diff = type === 'minus' ? -this.data.step : +this.data.step;
            var value = this.format(String(add(+this.data.currentValue, diff)));
            this.emitChange(value);
            this.$emit(type);
        },
        longPressStep: function () {
            var _this = this;
            this.longPressTimer = setTimeout(function () {
                _this.onChange();
                _this.longPressStep();
            }, LONG_PRESS_INTERVAL);
        },
        onTap: function (event) {
            var type = event.currentTarget.dataset.type;
            this.type = type;
            this.onChange();
        },
        onTouchStart: function (event) {
            var _this = this;
            if (!this.data.longPress) {
                return;
            }
            clearTimeout(this.longPressTimer);
            var type = event.currentTarget.dataset.type;
            this.type = type;
            this.isLongPress = false;
            this.longPressTimer = setTimeout(function () {
                _this.isLongPress = true;
                _this.onChange();
                _this.longPressStep();
            }, LONG_PRESS_START_TIME);
        },
        onTouchEnd: function () {
            if (!this.data.longPress) {
                return;
            }
            clearTimeout(this.longPressTimer);
        },
    },
});
