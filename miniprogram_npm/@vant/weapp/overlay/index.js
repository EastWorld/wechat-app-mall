'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
var component_1 = require('../common/component');
component_1.VantComponent({
  props: {
    show: Boolean,
    customStyle: String,
    duration: {
      type: null,
      value: 300,
    },
    zIndex: {
      type: Number,
      value: 1,
    },
  },
  methods: {
    onClick: function () {
      this.$emit('click');
    },
    // for prevent touchmove
    noop: function () {},
  },
});
