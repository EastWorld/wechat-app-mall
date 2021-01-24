'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
var component_1 = require('../common/component');
var relation_1 = require('../common/relation');
component_1.VantComponent({
  relation: relation_1.useChildren('goods-action-button', function () {
    this.children.forEach(function (item) {
      item.updateStyle();
    });
  }),
  props: {
    safeAreaInsetBottom: {
      type: Boolean,
      value: true,
    },
  },
});
