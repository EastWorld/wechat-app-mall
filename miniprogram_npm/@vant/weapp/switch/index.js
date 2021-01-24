'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
var component_1 = require('../common/component');
component_1.VantComponent({
  field: true,
  classes: ['node-class'],
  props: {
    checked: null,
    loading: Boolean,
    disabled: Boolean,
    activeColor: String,
    inactiveColor: String,
    size: {
      type: String,
      value: '30',
    },
    activeValue: {
      type: null,
      value: true,
    },
    inactiveValue: {
      type: null,
      value: false,
    },
  },
  methods: {
    onClick: function () {
      var _a = this.data,
        activeValue = _a.activeValue,
        inactiveValue = _a.inactiveValue,
        disabled = _a.disabled,
        loading = _a.loading;
      if (disabled || loading) {
        return;
      }
      var checked = this.data.checked === activeValue;
      var value = checked ? inactiveValue : activeValue;
      this.$emit('input', value);
      this.$emit('change', value);
    },
  },
});
