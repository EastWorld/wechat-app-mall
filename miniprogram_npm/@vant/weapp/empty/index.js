'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
var component_1 = require('../common/component');
var PRESETS = ['error', 'search', 'default', 'network'];
component_1.VantComponent({
  props: {
    description: String,
    image: {
      type: String,
      value: 'default',
    },
  },
  created: function () {
    if (PRESETS.indexOf(this.data.image) !== -1) {
      this.setData({
        imageUrl:
          'https://img.yzcdn.cn/vant/empty-image-' + this.data.image + '.png',
      });
    } else {
      this.setData({ imageUrl: this.data.image });
    }
  },
});
