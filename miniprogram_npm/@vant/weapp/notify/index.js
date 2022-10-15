"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var component_1 = require("../common/component");
var color_1 = require("../common/color");
var utils_1 = require("../common/utils");
(0, component_1.VantComponent)({
    props: {
        message: String,
        background: String,
        type: {
            type: String,
            value: 'danger',
        },
        color: {
            type: String,
            value: color_1.WHITE,
        },
        duration: {
            type: Number,
            value: 3000,
        },
        zIndex: {
            type: Number,
            value: 110,
        },
        safeAreaInsetTop: {
            type: Boolean,
            value: false,
        },
        top: null,
    },
    data: {
        show: false,
        onOpened: null,
        onClose: null,
        onClick: null,
    },
    created: function () {
        var statusBarHeight = (0, utils_1.getSystemInfoSync)().statusBarHeight;
        this.setData({ statusBarHeight: statusBarHeight });
    },
    methods: {
        show: function () {
            var _this = this;
            var _a = this.data, duration = _a.duration, onOpened = _a.onOpened;
            clearTimeout(this.timer);
            this.setData({ show: true });
            wx.nextTick(onOpened);
            if (duration > 0 && duration !== Infinity) {
                this.timer = setTimeout(function () {
                    _this.hide();
                }, duration);
            }
        },
        hide: function () {
            var onClose = this.data.onClose;
            clearTimeout(this.timer);
            this.setData({ show: false });
            wx.nextTick(onClose);
        },
        onTap: function (event) {
            var onClick = this.data.onClick;
            if (onClick) {
                onClick(event.detail);
            }
        },
    },
});
