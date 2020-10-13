'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
var component_1 = require('../common/component');
var touch_1 = require('../mixins/touch');
var utils_1 = require('../common/utils');
component_1.VantComponent({
  mixins: [touch_1.touch],
  classes: ['nav-class', 'tab-class', 'tab-active-class', 'line-class'],
  relation: {
    name: 'tab',
    type: 'descendant',
    current: 'tabs',
    linked: function (target) {
      target.index = this.children.length - 1;
      this.updateTabs();
    },
    unlinked: function () {
      this.children = this.children.map(function (child, index) {
        child.index = index;
        return child;
      });
      this.updateTabs();
    },
  },
  props: {
    sticky: Boolean,
    border: Boolean,
    swipeable: Boolean,
    titleActiveColor: String,
    titleInactiveColor: String,
    color: String,
    animated: {
      type: Boolean,
      observer: function () {
        var _this = this;
        this.children.forEach(function (child, index) {
          return child.updateRender(index === _this.data.currentIndex, _this);
        });
      },
    },
    lineWidth: {
      type: [String, Number],
      value: 40,
      observer: 'setLine',
    },
    lineHeight: {
      type: [String, Number],
      value: -1,
    },
    active: {
      type: [String, Number],
      value: 0,
      observer: function (name) {
        if (name !== this.getCurrentName()) {
          this.setCurrentIndexByName(name);
        }
      },
    },
    type: {
      type: String,
      value: 'line',
    },
    ellipsis: {
      type: Boolean,
      value: true,
    },
    duration: {
      type: Number,
      value: 0.3,
    },
    zIndex: {
      type: Number,
      value: 1,
    },
    swipeThreshold: {
      type: Number,
      value: 5,
      observer: function (value) {
        this.setData({
          scrollable: this.children.length > value || !this.data.ellipsis,
        });
      },
    },
    offsetTop: {
      type: Number,
      value: 0,
    },
    lazyRender: {
      type: Boolean,
      value: true,
    },
  },
  data: {
    tabs: [],
    lineStyle: '',
    scrollLeft: 0,
    scrollable: false,
    trackStyle: '',
    currentIndex: 0,
    container: null,
    skipTransition: true,
    lineOffsetLeft: 0,
  },
  mounted: function () {
    var _this = this;
    wx.nextTick(function () {
      _this.setLine(true);
      _this.scrollIntoView();
    });
  },
  methods: {
    updateContainer: function () {
      var _this = this;
      this.setData({
        container: function () {
          return _this.createSelectorQuery().select('.van-tabs');
        },
      });
    },
    updateTabs: function () {
      var _a = this,
        _b = _a.children,
        children = _b === void 0 ? [] : _b,
        data = _a.data;
      this.setData({
        tabs: children.map(function (child) {
          return child.data;
        }),
        scrollable:
          this.children.length > data.swipeThreshold || !data.ellipsis,
      });
      this.setCurrentIndexByName(this.getCurrentName() || data.active);
    },
    trigger: function (eventName, child) {
      var currentIndex = this.data.currentIndex;
      var currentChild = child || this.children[currentIndex];
      if (!utils_1.isDef(currentChild)) {
        return;
      }
      this.$emit(eventName, {
        index: currentChild.index,
        name: currentChild.getComputedName(),
        title: currentChild.data.title,
      });
    },
    onTap: function (event) {
      var _this = this;
      var index = event.currentTarget.dataset.index;
      var child = this.children[index];
      if (child.data.disabled) {
        this.trigger('disabled', child);
      } else {
        this.setCurrentIndex(index);
        wx.nextTick(function () {
          _this.trigger('click');
        });
      }
    },
    // correct the index of active tab
    setCurrentIndexByName: function (name) {
      var _a = this.children,
        children = _a === void 0 ? [] : _a;
      var matched = children.filter(function (child) {
        return child.getComputedName() === name;
      });
      if (matched.length) {
        this.setCurrentIndex(matched[0].index);
      }
    },
    setCurrentIndex: function (currentIndex) {
      var _this = this;
      var _a = this,
        data = _a.data,
        _b = _a.children,
        children = _b === void 0 ? [] : _b;
      if (
        !utils_1.isDef(currentIndex) ||
        currentIndex >= children.length ||
        currentIndex < 0
      ) {
        return;
      }
      children.forEach(function (item, index) {
        var active = index === currentIndex;
        if (active !== item.data.active || !item.inited) {
          item.updateRender(active, _this);
        }
      });
      if (currentIndex === data.currentIndex) {
        return;
      }
      var shouldEmitChange = data.currentIndex !== null;
      this.setData({ currentIndex: currentIndex });
      wx.nextTick(function () {
        _this.setLine();
        _this.scrollIntoView();
        _this.updateContainer();
        _this.trigger('input');
        if (shouldEmitChange) {
          _this.trigger('change');
        }
      });
    },
    getCurrentName: function () {
      var activeTab = this.children[this.data.currentIndex];
      if (activeTab) {
        return activeTab.getComputedName();
      }
    },
    setLine: function (skipTransition) {
      var _this = this;
      if (skipTransition === void 0) {
        skipTransition = false;
      }
      if (this.data.type !== 'line') {
        return;
      }
      var currentIndex = this.data.currentIndex;
      Promise.all([
        utils_1.getAllRect.call(this, '.van-tab'),
        utils_1.getRect.call(this, '.van-tabs__line'),
      ]).then(function (_a) {
        var _b = _a[0],
          rects = _b === void 0 ? [] : _b,
          lineRect = _a[1];
        var rect = rects[currentIndex];
        if (rect == null) {
          return;
        }
        var lineOffsetLeft = rects
          .slice(0, currentIndex)
          .reduce(function (prev, curr) {
            return prev + curr.width;
          }, 0);
        lineOffsetLeft += (rect.width - lineRect.width) / 2;
        _this.setData({
          lineOffsetLeft: lineOffsetLeft,
          skipTransition: skipTransition,
        });
      });
    },
    // scroll active tab into view
    scrollIntoView: function () {
      var _this = this;
      var _a = this.data,
        currentIndex = _a.currentIndex,
        scrollable = _a.scrollable;
      if (!scrollable) {
        return;
      }
      Promise.all([
        utils_1.getAllRect.call(this, '.van-tab'),
        utils_1.getRect.call(this, '.van-tabs__nav'),
      ]).then(function (_a) {
        var tabRects = _a[0],
          navRect = _a[1];
        var tabRect = tabRects[currentIndex];
        var offsetLeft = tabRects
          .slice(0, currentIndex)
          .reduce(function (prev, curr) {
            return prev + curr.width;
          }, 0);
        _this.setData({
          scrollLeft: offsetLeft - (navRect.width - tabRect.width) / 2,
        });
      });
    },
    onTouchScroll: function (event) {
      this.$emit('scroll', event.detail);
    },
    onTouchStart: function (event) {
      if (!this.data.swipeable) return;
      this.touchStart(event);
    },
    onTouchMove: function (event) {
      if (!this.data.swipeable) return;
      this.touchMove(event);
    },
    // watch swipe touch end
    onTouchEnd: function () {
      if (!this.data.swipeable) return;
      var _a = this,
        direction = _a.direction,
        deltaX = _a.deltaX,
        offsetX = _a.offsetX;
      var minSwipeDistance = 50;
      if (direction === 'horizontal' && offsetX >= minSwipeDistance) {
        var index = this.getAvaiableTab(deltaX);
        if (index !== -1) {
          this.setCurrentIndex(index);
        }
      }
    },
    getAvaiableTab: function (direction) {
      var _a = this.data,
        tabs = _a.tabs,
        currentIndex = _a.currentIndex;
      var step = direction > 0 ? -1 : 1;
      for (
        var i = step;
        currentIndex + i < tabs.length && currentIndex + i >= 0;
        i += step
      ) {
        var index = currentIndex + i;
        if (
          index >= 0 &&
          index < tabs.length &&
          tabs[index] &&
          !tabs[index].disabled
        ) {
          return index;
        }
      }
      return -1;
    },
  },
});
