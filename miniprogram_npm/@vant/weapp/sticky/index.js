'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
var utils_1 = require('../common/utils');
var component_1 = require('../common/component');
var page_scroll_1 = require('../mixins/page-scroll');
var ROOT_ELEMENT = '.van-sticky';
component_1.VantComponent({
  props: {
    zIndex: {
      type: Number,
      value: 99,
    },
    offsetTop: {
      type: Number,
      value: 0,
      observer: 'onScroll',
    },
    disabled: {
      type: Boolean,
      observer: 'onScroll',
    },
    container: {
      type: null,
      observer: 'onScroll',
    },
    scrollTop: {
      type: null,
      observer: function (val) {
        this.onScroll({ scrollTop: val });
      },
    },
  },
  mixins: [
    page_scroll_1.pageScrollMixin(function (event) {
      if (this.data.scrollTop != null) {
        return;
      }
      this.onScroll(event);
    }),
  ],
  data: {
    height: 0,
    fixed: false,
    transform: 0,
  },
  mounted: function () {
    this.onScroll();
  },
  methods: {
    onScroll: function (_a) {
      var _this = this;
      var scrollTop = (_a === void 0 ? {} : _a).scrollTop;
      var _b = this.data,
        container = _b.container,
        offsetTop = _b.offsetTop,
        disabled = _b.disabled;
      if (disabled) {
        this.setDataAfterDiff({
          fixed: false,
          transform: 0,
        });
        return;
      }
      this.scrollTop = scrollTop || this.scrollTop;
      if (typeof container === 'function') {
        Promise.all([
          utils_1.getRect(this, ROOT_ELEMENT),
          this.getContainerRect(),
        ]).then(function (_a) {
          var root = _a[0],
            container = _a[1];
          if (offsetTop + root.height > container.height + container.top) {
            _this.setDataAfterDiff({
              fixed: false,
              transform: container.height - root.height,
            });
          } else if (offsetTop >= root.top) {
            _this.setDataAfterDiff({
              fixed: true,
              height: root.height,
              transform: 0,
            });
          } else {
            _this.setDataAfterDiff({ fixed: false, transform: 0 });
          }
        });
        return;
      }
      utils_1.getRect(this, ROOT_ELEMENT).then(function (root) {
        if (offsetTop >= root.top) {
          _this.setDataAfterDiff({ fixed: true, height: root.height });
          _this.transform = 0;
        } else {
          _this.setDataAfterDiff({ fixed: false });
        }
      });
    },
    setDataAfterDiff: function (data) {
      var _this = this;
      wx.nextTick(function () {
        var diff = Object.keys(data).reduce(function (prev, key) {
          if (data[key] !== _this.data[key]) {
            prev[key] = data[key];
          }
          return prev;
        }, {});
        if (Object.keys(diff).length > 0) {
          _this.setData(diff);
        }
        _this.$emit('scroll', {
          scrollTop: _this.scrollTop,
          isFixed: data.fixed || _this.data.fixed,
        });
      });
    },
    getContainerRect: function () {
      var nodesRef = this.data.container();
      return new Promise(function (resolve) {
        return nodesRef.boundingClientRect(resolve).exec();
      });
    },
  },
});
