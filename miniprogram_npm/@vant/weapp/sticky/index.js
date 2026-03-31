"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("../common/utils");
var component_1 = require("../common/component");
var validator_1 = require("../common/validator");
var page_scroll_1 = require("../mixins/page-scroll");
var ROOT_ELEMENT = '.van-sticky';
(0, component_1.VantComponent)({
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
        (0, page_scroll_1.pageScrollMixin)(function (event) {
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
            var _b = _a === void 0 ? {} : _a, scrollTop = _b.scrollTop;
            var _c = this.data, container = _c.container, offsetTop = _c.offsetTop, disabled = _c.disabled;
            if (disabled) {
                this.setDataAfterDiff({
                    fixed: false,
                    transform: 0,
                });
                return;
            }
            this.scrollTop = scrollTop || this.scrollTop;
            if (typeof container === 'function') {
                Promise.all([(0, utils_1.getRect)(this, ROOT_ELEMENT), this.getContainerRect()])
                    .then(function (_a) {
                    var root = _a[0], container = _a[1];
                    if (offsetTop + root.height > container.height + container.top) {
                        _this.setDataAfterDiff({
                            fixed: false,
                            transform: container.height - root.height,
                        });
                    }
                    else if (offsetTop >= root.top) {
                        _this.setDataAfterDiff({
                            fixed: true,
                            height: root.height,
                            transform: 0,
                        });
                    }
                    else {
                        _this.setDataAfterDiff({ fixed: false, transform: 0 });
                    }
                })
                    .catch(function () { });
                return;
            }
            (0, utils_1.getRect)(this, ROOT_ELEMENT).then(function (root) {
                if (!(0, validator_1.isDef)(root) || (!root.width && !root.height)) {
                    return;
                }
                if (offsetTop >= root.top) {
                    _this.setDataAfterDiff({ fixed: true, height: root.height });
                    _this.transform = 0;
                }
                else {
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
            if (!nodesRef) {
                return Promise.reject(new Error('not found container'));
            }
            return new Promise(function (resolve) { return nodesRef.boundingClientRect(resolve).exec(); });
        },
    },
});
