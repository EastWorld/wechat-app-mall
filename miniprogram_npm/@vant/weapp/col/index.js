'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
var relation_1 = require('../common/relation');
var component_1 = require('../common/component');
component_1.VantComponent({
  relation: relation_1.useParent('row'),
  props: {
    span: Number,
    offset: Number,
  },
});
