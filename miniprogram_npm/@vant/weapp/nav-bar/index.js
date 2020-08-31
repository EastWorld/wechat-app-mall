'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
var component_1 = require('../common/component');
var utils_1 = require('../common/utils');
component_1.VantComponent({
  classes: ['title-class'],
  props: {
    title: String,
    fixed: {
      type: Boolean,
      observer: 'setHeight',
    },
    placeholder: {
      type: Boolean,
      observer: 'setHeight',
    },
    leftText: String,
    rightText: String,
    customStyle: String,
    leftArrow: Boolean,
    border: {
      type: Boolean,
      value: true,
    },
    zIndex: {
      type: Number,
      value: 1,
    },
    safeAreaInsetTop: {
      type: Boolean,
      value: true,
    },
  },
  data: {
    statusBarHeight: 0,
    height: 44,
    baseStyle: '',
  },
  created: function () {
    var statusBarHeight = utils_1.getSystemInfoSync().statusBarHeight;
    var _a = this.data,
      safeAreaInsetTop = _a.safeAreaInsetTop,
      zIndex = _a.zIndex;
    var paddingTop = safeAreaInsetTop ? statusBarHeight : 0;
    var baseStyle =
      'z-index: ' + zIndex + ';padding-top: ' + paddingTop + 'px;';
    this.setData({
      statusBarHeight: statusBarHeight,
      height: 44 + statusBarHeight,
      baseStyle: baseStyle,
    });
  },
  mounted: function () {
    this.setHeight();
  },
  methods: {
    onClickLeft: function () {
      this.$emit('click-left');
    },
    onClickRight: function () {
      this.$emit('click-right');
    },
    setHeight: function () {
      var _this = this;
      if (!this.data.fixed || !this.data.placeholder) {
        return;
      }
      wx.nextTick(function () {
        _this.getRect('.van-nav-bar').then(function (res) {
          _this.setData({ height: res.height });
        });
      });
    },
  },
});
