'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
var component_1 = require('../../../common/component');
component_1.VantComponent({
  props: {
    title: {
      type: String,
      value: '日期选择',
    },
    subtitle: String,
    showTitle: Boolean,
    showSubtitle: Boolean,
  },
  data: {
    weekdays: ['日', '一', '二', '三', '四', '五', '六'],
  },
  methods: {},
});
