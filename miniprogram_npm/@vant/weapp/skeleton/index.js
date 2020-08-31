'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
var component_1 = require('../common/component');
component_1.VantComponent({
  classes: ['avatar-class', 'title-class', 'row-class'],
  props: {
    row: {
      type: Number,
      value: 0,
      observer: function (value) {
        this.setData({ rowArray: Array.from({ length: value }) });
      },
    },
    title: Boolean,
    avatar: Boolean,
    loading: {
      type: Boolean,
      value: true,
    },
    animate: {
      type: Boolean,
      value: true,
    },
    avatarSize: {
      type: String,
      value: '32px',
    },
    avatarShape: {
      type: String,
      value: 'round',
    },
    titleWidth: {
      type: String,
      value: '40%',
    },
    rowWidth: {
      type: null,
      value: '100%',
      observer: function (val) {
        this.setData({ isArray: val instanceof Array });
      },
    },
  },
  data: {
    isArray: false,
    rowArray: [],
  },
});
