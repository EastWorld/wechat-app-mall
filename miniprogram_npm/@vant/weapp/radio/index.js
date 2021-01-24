'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
var component_1 = require('../common/component');
var relation_1 = require('../common/relation');
component_1.VantComponent({
  field: true,
  relation: relation_1.useParent('radio-group'),
  classes: ['icon-class', 'label-class'],
  props: {
    name: null,
    value: null,
    disabled: Boolean,
    useIconSlot: Boolean,
    checkedColor: String,
    labelPosition: {
      type: String,
      value: 'right',
    },
    labelDisabled: Boolean,
    shape: {
      type: String,
      value: 'round',
    },
    iconSize: {
      type: null,
      value: 20,
    },
  },
  methods: {
    emitChange: function (value) {
      var instance = this.parent || this;
      instance.$emit('input', value);
      instance.$emit('change', value);
    },
    onChange: function () {
      if (!this.data.disabled) {
        this.emitChange(this.data.name);
      }
    },
    onClickLabel: function () {
      var _a = this.data,
        disabled = _a.disabled,
        labelDisabled = _a.labelDisabled,
        name = _a.name;
      if (!disabled && !labelDisabled) {
        this.emitChange(name);
      }
    },
  },
});
