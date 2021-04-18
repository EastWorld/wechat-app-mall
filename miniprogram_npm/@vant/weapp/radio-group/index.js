'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
var component_1 = require('../common/component');
var relation_1 = require('../common/relation');
component_1.VantComponent({
  field: true,
  relation: relation_1.useChildren('radio', function (target) {
    this.updateChild(target);
  }),
  props: {
    value: {
      type: null,
      observer: 'updateChildren',
    },
    direction: String,
    disabled: {
      type: Boolean,
      observer: 'updateChildren',
    },
  },
  methods: {
    updateChildren: function () {
      var _this = this;
      this.children.forEach(function (child) {
        return _this.updateChild(child);
      });
    },
    updateChild: function (child) {
      var _a = this.data,
        value = _a.value,
        disabled = _a.disabled,
        direction = _a.direction;
      child.setData({
        value: value,
        direction: direction,
        disabled: disabled || child.data.disabled,
      });
    },
  },
});
