'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
var component_1 = require('../common/component');
component_1.VantComponent({
  relation: {
    type: 'descendant',
    name: 'goods-action-button',
    current: 'goods-action',
    linked: function () {
      this.updateStyle();
    },
    unlinked: function () {
      this.updateStyle();
    },
    linkChanged: function () {
      this.updateStyle();
    },
  },
  props: {
    safeAreaInsetBottom: {
      type: Boolean,
      value: true,
    },
  },
  methods: {
    updateStyle: function () {
      var _this = this;
      wx.nextTick(function () {
        _this.children.forEach(function (child) {
          child.updateStyle();
        });
      });
    },
  },
});
