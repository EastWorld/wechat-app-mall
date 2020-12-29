'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
var utils_1 = require('../common/utils');
var component_1 = require('../common/component');
component_1.VantComponent({
  relation: {
    name: 'tabbar-item',
    type: 'descendant',
    current: 'tabbar',
    linked: function (target) {
      target.parent = this;
      target.updateFromParent();
    },
    unlinked: function () {
      this.updateChildren();
    },
  },
  props: {
    active: {
      type: null,
      observer: 'updateChildren',
    },
    activeColor: {
      type: String,
      observer: 'updateChildren',
    },
    inactiveColor: {
      type: String,
      observer: 'updateChildren',
    },
    fixed: {
      type: Boolean,
      value: true,
      observer: 'setHeight',
    },
    placeholder: {
      type: Boolean,
      observer: 'setHeight',
    },
    border: {
      type: Boolean,
      value: true,
    },
    zIndex: {
      type: Number,
      value: 1,
    },
    safeAreaInsetBottom: {
      type: Boolean,
      value: true,
    },
  },
  data: {
    height: 50,
  },
  methods: {
    updateChildren: function () {
      var children = this.children;
      if (!Array.isArray(children) || !children.length) {
        return;
      }
      children.forEach(function (child) {
        return child.updateFromParent();
      });
    },
    setHeight: function () {
      var _this = this;
      if (!this.data.fixed || !this.data.placeholder) {
        return;
      }
      wx.nextTick(function () {
        utils_1.getRect(_this, '.van-tabbar').then(function (res) {
          _this.setData({ height: res.height });
        });
      });
    },
  },
});
