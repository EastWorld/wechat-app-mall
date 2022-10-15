"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var component_1 = require("../common/component");
var touch_1 = require("../mixins/touch");
var utils_1 = require("../common/utils");
var validator_1 = require("../common/validator");
var relation_1 = require("../common/relation");
(0, component_1.VantComponent)({
    mixins: [touch_1.touch],
    classes: ['nav-class', 'tab-class', 'tab-active-class', 'line-class'],
    relation: (0, relation_1.useChildren)('tab', function () {
        this.updateTabs();
    }),
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
            type: null,
            value: 40,
            observer: 'resize',
        },
        lineHeight: {
            type: null,
            value: -1,
        },
        active: {
            type: null,
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
        scrollLeft: 0,
        scrollable: false,
        currentIndex: 0,
        container: null,
        skipTransition: true,
        scrollWithAnimation: false,
        lineOffsetLeft: 0,
    },
    mounted: function () {
        var _this = this;
        (0, utils_1.requestAnimationFrame)(function () {
            _this.swiping = true;
            _this.setData({
                container: function () { return _this.createSelectorQuery().select('.van-tabs'); },
            });
            _this.resize();
            _this.scrollIntoView();
        });
    },
    methods: {
        updateTabs: function () {
            var _a = this, _b = _a.children, children = _b === void 0 ? [] : _b, data = _a.data;
            this.setData({
                tabs: children.map(function (child) { return child.data; }),
                scrollable: this.children.length > data.swipeThreshold || !data.ellipsis,
            });
            this.setCurrentIndexByName(data.active || this.getCurrentName());
        },
        trigger: function (eventName, child) {
            var currentIndex = this.data.currentIndex;
            var currentChild = child || this.children[currentIndex];
            if (!(0, validator_1.isDef)(currentChild)) {
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
            }
            else {
                this.setCurrentIndex(index);
                (0, utils_1.nextTick)(function () {
                    _this.trigger('click');
                });
            }
        },
        // correct the index of active tab
        setCurrentIndexByName: function (name) {
            var _a = this.children, children = _a === void 0 ? [] : _a;
            var matched = children.filter(function (child) { return child.getComputedName() === name; });
            if (matched.length) {
                this.setCurrentIndex(matched[0].index);
            }
        },
        setCurrentIndex: function (currentIndex) {
            var _this = this;
            var _a = this, data = _a.data, _b = _a.children, children = _b === void 0 ? [] : _b;
            if (!(0, validator_1.isDef)(currentIndex) ||
                currentIndex >= children.length ||
                currentIndex < 0) {
                return;
            }
            (0, utils_1.groupSetData)(this, function () {
                children.forEach(function (item, index) {
                    var active = index === currentIndex;
                    if (active !== item.data.active || !item.inited) {
                        item.updateRender(active, _this);
                    }
                });
            });
            if (currentIndex === data.currentIndex) {
                return;
            }
            var shouldEmitChange = data.currentIndex !== null;
            this.setData({ currentIndex: currentIndex });
            (0, utils_1.requestAnimationFrame)(function () {
                _this.resize();
                _this.scrollIntoView();
            });
            (0, utils_1.nextTick)(function () {
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
        resize: function () {
            var _this = this;
            if (this.data.type !== 'line') {
                return;
            }
            var _a = this.data, currentIndex = _a.currentIndex, ellipsis = _a.ellipsis, skipTransition = _a.skipTransition;
            Promise.all([
                (0, utils_1.getAllRect)(this, '.van-tab'),
                (0, utils_1.getRect)(this, '.van-tabs__line'),
            ]).then(function (_a) {
                var _b = _a[0], rects = _b === void 0 ? [] : _b, lineRect = _a[1];
                var rect = rects[currentIndex];
                if (rect == null) {
                    return;
                }
                var lineOffsetLeft = rects
                    .slice(0, currentIndex)
                    .reduce(function (prev, curr) { return prev + curr.width; }, 0);
                lineOffsetLeft +=
                    (rect.width - lineRect.width) / 2 + (ellipsis ? 0 : 8);
                _this.setData({ lineOffsetLeft: lineOffsetLeft });
                _this.swiping = true;
                if (skipTransition) {
                    (0, utils_1.nextTick)(function () {
                        _this.setData({ skipTransition: false });
                    });
                }
            });
        },
        // scroll active tab into view
        scrollIntoView: function () {
            var _this = this;
            var _a = this.data, currentIndex = _a.currentIndex, scrollable = _a.scrollable, scrollWithAnimation = _a.scrollWithAnimation;
            if (!scrollable) {
                return;
            }
            Promise.all([
                (0, utils_1.getAllRect)(this, '.van-tab'),
                (0, utils_1.getRect)(this, '.van-tabs__nav'),
            ]).then(function (_a) {
                var tabRects = _a[0], navRect = _a[1];
                var tabRect = tabRects[currentIndex];
                var offsetLeft = tabRects
                    .slice(0, currentIndex)
                    .reduce(function (prev, curr) { return prev + curr.width; }, 0);
                _this.setData({
                    scrollLeft: offsetLeft - (navRect.width - tabRect.width) / 2,
                });
                if (!scrollWithAnimation) {
                    (0, utils_1.nextTick)(function () {
                        _this.setData({ scrollWithAnimation: true });
                    });
                }
            });
        },
        onTouchScroll: function (event) {
            this.$emit('scroll', event.detail);
        },
        onTouchStart: function (event) {
            if (!this.data.swipeable)
                return;
            this.swiping = true;
            this.touchStart(event);
        },
        onTouchMove: function (event) {
            if (!this.data.swipeable || !this.swiping)
                return;
            this.touchMove(event);
        },
        // watch swipe touch end
        onTouchEnd: function () {
            if (!this.data.swipeable || !this.swiping)
                return;
            var _a = this, direction = _a.direction, deltaX = _a.deltaX, offsetX = _a.offsetX;
            var minSwipeDistance = 50;
            if (direction === 'horizontal' && offsetX >= minSwipeDistance) {
                var index = this.getAvaiableTab(deltaX);
                if (index !== -1) {
                    this.setCurrentIndex(index);
                }
            }
            this.swiping = false;
        },
        getAvaiableTab: function (direction) {
            var _a = this.data, tabs = _a.tabs, currentIndex = _a.currentIndex;
            var step = direction > 0 ? -1 : 1;
            for (var i = step; currentIndex + i < tabs.length && currentIndex + i >= 0; i += step) {
                var index = currentIndex + i;
                if (index >= 0 &&
                    index < tabs.length &&
                    tabs[index] &&
                    !tabs[index].disabled) {
                    return index;
                }
            }
            return -1;
        },
    },
});
