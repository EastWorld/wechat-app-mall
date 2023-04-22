"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var relation_1 = require("../common/relation");
var component_1 = require("../common/component");
(0, component_1.VantComponent)({
    classes: ['item-title-class'],
    field: true,
    relation: (0, relation_1.useParent)('dropdown-menu', function () {
        this.updateDataFromParent();
    }),
    props: {
        value: {
            type: null,
            observer: 'rerender',
        },
        title: {
            type: String,
            observer: 'rerender',
        },
        disabled: Boolean,
        titleClass: {
            type: String,
            observer: 'rerender',
        },
        options: {
            type: Array,
            value: [],
            observer: 'rerender',
        },
        popupStyle: String,
        useBeforeToggle: {
            type: Boolean,
            value: false,
        },
        rootPortal: {
            type: Boolean,
            value: false,
        },
    },
    data: {
        transition: true,
        showPopup: false,
        showWrapper: false,
        displayTitle: '',
        safeAreaTabBar: false,
    },
    methods: {
        rerender: function () {
            var _this = this;
            wx.nextTick(function () {
                var _a;
                (_a = _this.parent) === null || _a === void 0 ? void 0 : _a.updateItemListData();
            });
        },
        updateDataFromParent: function () {
            if (this.parent) {
                var _a = this.parent.data, overlay = _a.overlay, duration = _a.duration, activeColor = _a.activeColor, closeOnClickOverlay = _a.closeOnClickOverlay, direction = _a.direction, safeAreaTabBar = _a.safeAreaTabBar;
                this.setData({
                    overlay: overlay,
                    duration: duration,
                    activeColor: activeColor,
                    closeOnClickOverlay: closeOnClickOverlay,
                    direction: direction,
                    safeAreaTabBar: safeAreaTabBar,
                });
            }
        },
        onOpen: function () {
            this.$emit('open');
        },
        onOpened: function () {
            this.$emit('opened');
        },
        onClose: function () {
            this.$emit('close');
        },
        onClosed: function () {
            this.$emit('closed');
            this.setData({ showWrapper: false });
        },
        onOptionTap: function (event) {
            var option = event.currentTarget.dataset.option;
            var value = option.value;
            var shouldEmitChange = this.data.value !== value;
            this.setData({ showPopup: false, value: value });
            this.$emit('close');
            this.rerender();
            if (shouldEmitChange) {
                this.$emit('change', value);
            }
        },
        toggle: function (show, options) {
            var _this = this;
            if (options === void 0) { options = {}; }
            var showPopup = this.data.showPopup;
            if (typeof show !== 'boolean') {
                show = !showPopup;
            }
            if (show === showPopup) {
                return;
            }
            this.onBeforeToggle(show).then(function (status) {
                var _a;
                if (!status) {
                    return;
                }
                _this.setData({
                    transition: !options.immediate,
                    showPopup: show,
                });
                if (show) {
                    (_a = _this.parent) === null || _a === void 0 ? void 0 : _a.getChildWrapperStyle().then(function (wrapperStyle) {
                        _this.setData({ wrapperStyle: wrapperStyle, showWrapper: true });
                        _this.rerender();
                    });
                }
                else {
                    _this.rerender();
                }
            });
        },
        onBeforeToggle: function (status) {
            var _this = this;
            var useBeforeToggle = this.data.useBeforeToggle;
            if (!useBeforeToggle) {
                return Promise.resolve(true);
            }
            return new Promise(function (resolve) {
                _this.$emit('before-toggle', {
                    status: status,
                    callback: function (value) { return resolve(value); },
                });
            });
        },
    },
});
