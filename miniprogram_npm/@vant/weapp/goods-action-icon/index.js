'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
var component_1 = require('../common/component');
var button_1 = require('../mixins/button');
var link_1 = require('../mixins/link');
var open_type_1 = require('../mixins/open-type');
component_1.VantComponent({
  classes: ['icon-class', 'text-class'],
  mixins: [link_1.link, button_1.button, open_type_1.openType],
  props: {
    text: String,
    dot: Boolean,
    info: String,
    icon: String,
    disabled: Boolean,
    loading: Boolean,
  },
  methods: {
    onClick: function (event) {
      this.$emit('click', event.detail);
      this.jumpLink();
    },
  },
});
