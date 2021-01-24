'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
var utils_1 = require('../common/utils');
var component_1 = require('../common/component');
var relation_1 = require('../common/relation');
component_1.VantComponent({
  relation: relation_1.useParent('index-bar'),
  props: {
    useSlot: Boolean,
    index: null,
  },
  data: {
    active: false,
    wrapperStyle: '',
    anchorStyle: '',
  },
  methods: {
    scrollIntoView: function (scrollTop) {
      var _this = this;
      utils_1.getRect(this, '.van-index-anchor-wrapper').then(function (rect) {
        wx.pageScrollTo({
          duration: 0,
          scrollTop: scrollTop + rect.top - _this.parent.data.stickyOffsetTop,
        });
      });
    },
  },
});
