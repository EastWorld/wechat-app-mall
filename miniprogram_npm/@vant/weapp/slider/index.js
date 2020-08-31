'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
var component_1 = require('../common/component');
var touch_1 = require('../mixins/touch');
var version_1 = require('../common/version');
component_1.VantComponent({
  mixins: [touch_1.touch],
  props: {
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
      type: Number,
      value: 0,
      observer: function (val) {
        if (val !== this.value) {
          this.updateValue(val);
        }
      },
    },
    barHeight: {
      type: null,
      value: 2,
    },
  },
  created: function () {
    this.updateValue(this.data.value);
  },
  methods: {
    onTouchStart: function (event) {
      if (this.data.disabled) return;
      this.touchStart(event);
      this.startValue = this.format(this.value);
      this.dragStatus = 'start';
    },
    onTouchMove: function (event) {
      var _this = this;
      if (this.data.disabled) return;
      if (this.dragStatus === 'start') {
        this.$emit('drag-start');
      }
      this.touchMove(event);
      this.dragStatus = 'draging';
      this.getRect('.van-slider').then(function (rect) {
        var diff = (_this.deltaX / rect.width) * 100;
        _this.newValue = _this.startValue + diff;
        _this.updateValue(_this.newValue, false, true);
      });
    },
    onTouchEnd: function () {
      if (this.data.disabled) return;
      if (this.dragStatus === 'draging') {
        this.updateValue(this.newValue, true);
        this.$emit('drag-end');
      }
    },
    onClick: function (event) {
      var _this = this;
      if (this.data.disabled) return;
      var min = this.data.min;
      this.getRect('.van-slider').then(function (rect) {
        var value =
          ((event.detail.x - rect.left) / rect.width) * _this.getRange() + min;
        _this.updateValue(value, true);
      });
    },
    updateValue: function (value, end, drag) {
      value = this.format(value);
      var min = this.data.min;
      var width = ((value - min) * 100) / this.getRange() + '%';
      this.value = value;
      this.setData({
        barStyle:
          '\n          width: ' +
          width +
          ';\n          ' +
          (drag ? 'transition: none;' : '') +
          '\n        ',
      });
      if (drag) {
        this.$emit('drag', { value: value });
      }
      if (end) {
        this.$emit('change', value);
      }
      if ((drag || end) && version_1.canIUseModel()) {
        this.setData({ value: value });
      }
    },
    getRange: function () {
      var _a = this.data,
        max = _a.max,
        min = _a.min;
      return max - min;
    },
    format: function (value) {
      var _a = this.data,
        max = _a.max,
        min = _a.min,
        step = _a.step;
      return Math.round(Math.max(min, Math.min(value, max)) / step) * step;
    },
  },
});
