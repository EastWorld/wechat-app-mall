'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
var utils_1 = require('../common/utils');
var component_1 = require('../common/component');
component_1.VantComponent({
  relation: {
    name: 'index-bar',
    type: 'ancestor',
    current: 'index-anchor',
  },
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
