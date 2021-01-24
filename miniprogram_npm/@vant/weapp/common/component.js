'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.VantComponent = void 0;
var basic_1 = require('../mixins/basic');
function mapKeys(source, target, map) {
  Object.keys(map).forEach(function (key) {
    if (source[key]) {
      target[map[key]] = source[key];
    }
  });
}
function VantComponent(vantOptions) {
  var options = {};
  mapKeys(vantOptions, options, {
    data: 'data',
    props: 'properties',
    mixins: 'behaviors',
    methods: 'methods',
    beforeCreate: 'created',
    created: 'attached',
    mounted: 'ready',
    destroyed: 'detached',
    classes: 'externalClasses',
  });
  // add default externalClasses
  options.externalClasses = options.externalClasses || [];
  options.externalClasses.push('custom-class');
  // add default behaviors
  options.behaviors = options.behaviors || [];
  options.behaviors.push(basic_1.basic);
  // add relations
  var relation = vantOptions.relation;
  if (relation) {
    options.relations = relation.relations;
    options.behaviors.push(relation.mixin);
  }
  // map field to form-field behavior
  if (vantOptions.field) {
    options.behaviors.push('wx://form-field');
  }
  // add default options
  options.options = {
    multipleSlots: true,
    addGlobalClass: true,
  };
  Component(options);
}
exports.VantComponent = VantComponent;
