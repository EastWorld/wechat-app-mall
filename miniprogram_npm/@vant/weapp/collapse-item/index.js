'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
var component_1 = require('../common/component');
var animate_1 = require('./animate');
component_1.VantComponent({
  classes: ['title-class', 'content-class'],
  relation: {
    name: 'collapse',
    type: 'ancestor',
    current: 'collapse-item',
  },
  props: {
    name: null,
    title: null,
    value: null,
    icon: String,
    label: String,
    disabled: Boolean,
    clickable: Boolean,
    border: {
      type: Boolean,
      value: true,
    },
    isLink: {
      type: Boolean,
      value: true,
    },
  },
  data: {
    expanded: false,
  },
  mounted: function () {
    this.updateExpanded();
    this.mounted = true;
  },
  methods: {
    updateExpanded: function () {
      if (!this.parent) {
        return;
      }
      var _a = this.parent.data,
        value = _a.value,
        accordion = _a.accordion;
      var _b = this.parent.children,
        children = _b === void 0 ? [] : _b;
      var name = this.data.name;
      var index = children.indexOf(this);
      var currentName = name == null ? index : name;
      var expanded = accordion
        ? value === currentName
        : (value || []).some(function (name) {
            return name === currentName;
          });
      if (expanded !== this.data.expanded) {
        animate_1.setContentAnimate(this, expanded, this.mounted);
      }
      this.setData({ index: index, expanded: expanded });
    },
    onClick: function () {
      if (this.data.disabled) {
        return;
      }
      var _a = this.data,
        name = _a.name,
        expanded = _a.expanded;
      var index = this.parent.children.indexOf(this);
      var currentName = name == null ? index : name;
      this.parent.switch(currentName, !expanded);
    },
  },
});
