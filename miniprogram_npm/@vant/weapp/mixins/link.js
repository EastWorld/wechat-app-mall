'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.link = void 0;
exports.link = Behavior({
  properties: {
    url: String,
    linkType: {
      type: String,
      value: 'navigateTo',
    },
  },
  methods: {
    jumpLink: function (urlKey) {
      if (urlKey === void 0) {
        urlKey = 'url';
      }
      var url = this.data[urlKey];
      if (url) {
        wx[this.data.linkType]({ url: url });
      }
    },
  },
});
