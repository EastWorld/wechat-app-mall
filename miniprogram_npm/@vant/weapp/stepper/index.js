'use strict';
var __assign =
  (this && this.__assign) ||
  function () {
    __assign =
      Object.assign ||
      function (t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
          s = arguments[i];
          for (var p in s)
            if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
      };
    return __assign.apply(this, arguments);
  };
Object.defineProperty(exports, '__esModule', { value: true });
var component_1 = require('../common/component');
var utils_1 = require('../common/utils');
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
component_1.VantComponent({
  field: true,
  classes: ['input-class', 'plus-class', 'minus-class'],
  props: {
    value: {
      type: null,
      observer: function (value) {
        if (!equal(value, this.data.currentValue)) {
          this.setData({ currentValue: this.format(value) });
        }
      },
    },
    integer: {
      type: Boolean,
      observer: 'check',
    },
    disabled: Boolean,
    inputWidth: null,
    buttonSize: null,
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
  },
  data: {
    currentValue: '',
  },
  created: function () {
    this.setData({
      currentValue: this.format(this.data.value),
    });
  },
  methods: {
    check: function () {
      var val = this.format(this.data.currentValue);
      if (!equal(val, this.data.currentValue)) {
        this.setData({ currentValue: val });
      }
    },
    isDisabled: function (type) {
      if (type === 'plus') {
        return (
          this.data.disabled ||
          this.data.disablePlus ||
          this.data.currentValue >= this.data.max
        );
      }
      return (
        this.data.disabled ||
        this.data.disableMinus ||
        this.data.currentValue <= this.data.min
      );
    },
    onFocus: function (event) {
      this.$emit('focus', event.detail);
    },
    onBlur: function (event) {
      var value = this.format(event.detail.value);
      this.emitChange(value);
      this.$emit(
        'blur',
        __assign(__assign({}, event.detail), { value: value })
      );
    },
    // filter illegal characters
    filter: function (value) {
      value = String(value).replace(/[^0-9.-]/g, '');
      if (this.data.integer && value.indexOf('.') !== -1) {
        value = value.split('.')[0];
      }
      return value;
    },
    // limit value range
    format: function (value) {
      value = this.filter(value);
      // format range
      value = value === '' ? 0 : +value;
      value = Math.max(Math.min(this.data.max, value), this.data.min);
      // format decimal
      if (utils_1.isDef(this.data.decimalLength)) {
        value = value.toFixed(this.data.decimalLength);
      }
      return value;
    },
    onInput: function (event) {
      var _a = (event.detail || {}).value,
        value = _a === void 0 ? '' : _a;
      // allow input to be empty
      if (value === '') {
        return;
      }
      var formatted = this.filter(value);
      // limit max decimal length
      if (
        utils_1.isDef(this.data.decimalLength) &&
        formatted.indexOf('.') !== -1
      ) {
        var pair = formatted.split('.');
        formatted = pair[0] + '.' + pair[1].slice(0, this.data.decimalLength);
      }
      this.emitChange(formatted);
    },
    emitChange: function (value) {
      if (!this.data.asyncChange) {
        this.setData({ currentValue: value });
      }
      this.$emit('change', value);
    },
    onChange: function () {
      var type = this.type;
      if (this.isDisabled(type)) {
        this.$emit('overlimit', type);
        return;
      }
      var diff = type === 'minus' ? -this.data.step : +this.data.step;
      var value = this.format(add(+this.data.currentValue, diff));
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
