'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
var component_1 = require('../common/component');
var link_1 = require('../mixins/link');
var button_1 = require('../mixins/button');
var open_type_1 = require('../mixins/open-type');
component_1.VantComponent({
  mixins: [link_1.link, button_1.button, open_type_1.openType],
  relation: {
    type: 'ancestor',
    name: 'goods-action',
    current: 'goods-action-button',
  },
  props: {
    text: String,
    color: String,
    loading: Boolean,
    disabled: Boolean,
    plain: Boolean,
    type: {
      type: String,
      value: 'danger',
    },
  },
  methods: {
    onClick: function (event) {
      this.$emit('click', event.detail);
      this.jumpLink();
    },
    updateStyle: function () {
      if (this.parent == null) {
        return;
      }
      var _a = this.parent.children,
        children = _a === void 0 ? [] : _a;
      var length = children.length;
      var index = children.indexOf(this);
      this.setData({
        isFirst: index === 0,
        isLast: index === length - 1,
      });
    },
  },
});
