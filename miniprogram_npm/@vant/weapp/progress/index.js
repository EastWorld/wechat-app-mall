'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
var component_1 = require('../common/component');
var color_1 = require('../common/color');
var utils_1 = require('../common/utils');
component_1.VantComponent({
  props: {
    inactive: Boolean,
    percentage: {
      type: Number,
      observer: 'setLeft',
    },
    pivotText: String,
    pivotColor: String,
    trackColor: String,
    showPivot: {
      type: Boolean,
      value: true,
    },
    color: {
      type: String,
      value: color_1.BLUE,
    },
    textColor: {
      type: String,
      value: '#fff',
    },
    strokeWidth: {
      type: null,
      value: 4,
    },
  },
  data: {
    right: 0,
  },
  mounted: function () {
    this.setLeft();
  },
  methods: {
    setLeft: function () {
      var _this = this;
      Promise.all([
        utils_1.getRect(this, '.van-progress'),
        utils_1.getRect(this, '.van-progress__pivot'),
      ]).then(function (_a) {
        var portion = _a[0],
          pivot = _a[1];
        if (portion && pivot) {
          _this.setData({
            right: (pivot.width * (_this.data.percentage - 100)) / 100,
          });
        }
      });
    },
  },
});
