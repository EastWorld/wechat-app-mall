'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
var component_1 = require('../common/component');
component_1.VantComponent({
  relation: {
    name: 'sidebar-item',
    type: 'descendant',
    current: 'sidebar',
    linked: function () {
      this.setActive(this.data.activeKey);
    },
    unlinked: function () {
      this.setActive(this.data.activeKey);
    },
  },
  props: {
    activeKey: {
      type: Number,
      value: 0,
      observer: 'setActive',
    },
  },
  beforeCreate: function () {
    this.currentActive = -1;
  },
  methods: {
    setActive: function (activeKey) {
      var _a = this,
        children = _a.children,
        currentActive = _a.currentActive;
      if (!children.length) {
        return Promise.resolve();
      }
      this.currentActive = activeKey;
      var stack = [];
      if (currentActive !== activeKey && children[currentActive]) {
        stack.push(children[currentActive].setActive(false));
      }
      if (children[activeKey]) {
        stack.push(children[activeKey].setActive(true));
      }
      return Promise.all(stack);
    },
  },
});
