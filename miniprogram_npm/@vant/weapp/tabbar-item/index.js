'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
var component_1 = require('../common/component');
component_1.VantComponent({
  props: {
    info: null,
    name: null,
    icon: String,
    dot: Boolean,
  },
  relation: {
    name: 'tabbar',
    type: 'ancestor',
    current: 'tabbar-item',
  },
  data: {
    active: false,
  },
  methods: {
    onClick: function () {
      if (this.parent) {
        this.parent.onChange(this);
      }
      this.$emit('click');
    },
    updateFromParent: function () {
      var parent = this.parent;
      if (!parent) {
        return;
      }
      var index = parent.children.indexOf(this);
      var parentData = parent.data;
      var data = this.data;
      var active = (data.name || index) === parentData.active;
      var patch = {};
      if (active !== data.active) {
        patch.active = active;
      }
      if (parentData.activeColor !== data.activeColor) {
        patch.activeColor = parentData.activeColor;
      }
      if (parentData.inactiveColor !== data.inactiveColor) {
        patch.inactiveColor = parentData.inactiveColor;
      }
      return Object.keys(patch).length > 0
        ? this.set(patch)
        : Promise.resolve();
    },
  },
});
