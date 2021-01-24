'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
var component_1 = require('../common/component');
var relation_1 = require('../common/relation');
component_1.VantComponent({
  relation: relation_1.useChildren('grid-item'),
  props: {
    square: {
      type: Boolean,
      observer: 'updateChildren',
    },
    gutter: {
      type: null,
      value: 0,
      observer: 'updateChildren',
    },
    clickable: {
      type: Boolean,
      observer: 'updateChildren',
    },
    columnNum: {
      type: Number,
      value: 4,
      observer: 'updateChildren',
    },
    center: {
      type: Boolean,
      value: true,
      observer: 'updateChildren',
    },
    border: {
      type: Boolean,
      value: true,
      observer: 'updateChildren',
    },
    direction: {
      type: String,
      observer: 'updateChildren',
    },
    iconSize: {
      type: String,
      observer: 'updateChildren',
    },
  },
  methods: {
    updateChildren: function () {
      this.children.forEach(function (child) {
        child.updateStyle();
      });
    },
  },
});
