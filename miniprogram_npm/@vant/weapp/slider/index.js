"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var component_1 = require("../common/component");
var touch_1 = require("../mixins/touch");
var version_1 = require("../common/version");
var utils_1 = require("../common/utils");
(0, component_1.VantComponent)({
    mixins: [touch_1.touch],
    props: {
        range: Boolean,
        disabled: Boolean,
        useButtonSlot: Boolean,
        activeColor: String,
        inactiveColor: String,
        max: {
            type: Number,
            value: 100,
        },
        min: {
            type: Number,
            value: 0,
        },
        step: {
            type: Number,
            value: 1,
        },
        value: {
            type: null,
            value: 0,
            observer: function (val) {
                if (val !== this.value) {
                    this.updateValue(val);
                }
            },
        },
        vertical: Boolean,
        barHeight: null,
    },
    created: function () {
        this.updateValue(this.data.value);
    },
    methods: {
        onTouchStart: function (event) {
            var _this = this;
            if (this.data.disabled)
                return;
            var index = event.currentTarget.dataset.index;
            if (typeof index === 'number') {
                this.buttonIndex = index;
            }
            this.touchStart(event);
            this.startValue = this.format(this.value);
            this.newValue = this.value;
            if (this.isRange(this.newValue)) {
                this.startValue = this.newValue.map(function (val) { return _this.format(val); });
            }
            else {
                this.startValue = this.format(this.newValue);
            }
            this.dragStatus = 'start';
        },
        onTouchMove: function (event) {
            var _this = this;
            if (this.data.disabled)
                return;
            if (this.dragStatus === 'start') {
                this.$emit('drag-start');
            }
            this.touchMove(event);
            this.dragStatus = 'draging';
            (0, utils_1.getRect)(this, '.van-slider').then(function (rect) {
                var vertical = _this.data.vertical;
                var delta = vertical ? _this.deltaY : _this.deltaX;
                var total = vertical ? rect.height : rect.width;
                var diff = (delta / total) * _this.getRange();
                if (_this.isRange(_this.startValue)) {
                    _this.newValue[_this.buttonIndex] =
                        _this.startValue[_this.buttonIndex] + diff;
                }
                else {
                    _this.newValue = _this.startValue + diff;
                }
                _this.updateValue(_this.newValue, false, true);
            });
        },
        onTouchEnd: function () {
            if (this.data.disabled)
                return;
            if (this.dragStatus === 'draging') {
                this.updateValue(this.newValue, true);
                this.$emit('drag-end');
            }
        },
        onClick: function (event) {
            var _this = this;
            if (this.data.disabled)
                return;
            var min = this.data.min;
            (0, utils_1.getRect)(this, '.van-slider').then(function (rect) {
                var vertical = _this.data.vertical;
                var touch = event.touches[0];
                var delta = vertical
                    ? touch.clientY - rect.top
                    : touch.clientX - rect.left;
                var total = vertical ? rect.height : rect.width;
                var value = Number(min) + (delta / total) * _this.getRange();
                if (_this.isRange(_this.value)) {
                    var _a = _this.value, left = _a[0], right = _a[1];
                    var middle = (left + right) / 2;
                    if (value <= middle) {
                        _this.updateValue([value, right], true);
                    }
                    else {
                        _this.updateValue([left, value], true);
                    }
                }
                else {
                    _this.updateValue(value, true);
                }
            });
        },
        isRange: function (val) {
            var range = this.data.range;
            return range && Array.isArray(val);
        },
        handleOverlap: function (value) {
            if (value[0] > value[1]) {
                return value.slice(0).reverse();
            }
            return value;
        },
        updateValue: function (value, end, drag) {
            var _this = this;
            if (this.isRange(value)) {
                value = this.handleOverlap(value).map(function (val) { return _this.format(val); });
            }
            else {
                value = this.format(value);
            }
            this.value = value;
            var vertical = this.data.vertical;
            var mainAxis = vertical ? 'height' : 'width';
            this.setData({
                wrapperStyle: "\n          background: ".concat(this.data.inactiveColor || '', ";\n          ").concat(vertical ? 'width' : 'height', ": ").concat((0, utils_1.addUnit)(this.data.barHeight) || '', ";\n        "),
                barStyle: "\n          ".concat(mainAxis, ": ").concat(this.calcMainAxis(), ";\n          left: ").concat(vertical ? 0 : this.calcOffset(), ";\n          top: ").concat(vertical ? this.calcOffset() : 0, ";\n          ").concat(drag ? 'transition: none;' : '', "\n        "),
            });
            if (drag) {
                this.$emit('drag', { value: value });
            }
            if (end) {
                this.$emit('change', value);
            }
            if ((drag || end) && (0, version_1.canIUseModel)()) {
                this.setData({ value: value });
            }
        },
        getScope: function () {
            return Number(this.data.max) - Number(this.data.min);
        },
        getRange: function () {
            var _a = this.data, max = _a.max, min = _a.min;
            return max - min;
        },
        // 计算选中条的长度百分比
        calcMainAxis: function () {
            var value = this.value;
            var min = this.data.min;
            var scope = this.getScope();
            if (this.isRange(value)) {
                return "".concat(((value[1] - value[0]) * 100) / scope, "%");
            }
            return "".concat(((value - Number(min)) * 100) / scope, "%");
        },
        // 计算选中条的开始位置的偏移量
        calcOffset: function () {
            var value = this.value;
            var min = this.data.min;
            var scope = this.getScope();
            if (this.isRange(value)) {
                return "".concat(((value[0] - Number(min)) * 100) / scope, "%");
            }
            return '0%';
        },
        format: function (value) {
            var _a = this.data, max = _a.max, min = _a.min, step = _a.step;
            return Math.round(Math.max(min, Math.min(value, max)) / step) * step;
        },
    },
});
