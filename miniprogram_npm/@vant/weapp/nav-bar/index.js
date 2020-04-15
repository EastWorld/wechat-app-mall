"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var component_1 = require("../common/component");
component_1.VantComponent({
    classes: ['title-class'],
    props: {
        title: String,
        fixed: {
            type: Boolean,
            observer: 'setHeight'
        },
        placeholder: {
            type: Boolean,
            observer: 'setHeight'
        },
        leftText: String,
        rightText: String,
        leftArrow: Boolean,
        border: {
            type: Boolean,
            value: true
        },
        zIndex: {
            type: Number,
            value: 1
        },
        safeAreaInsetTop: {
            type: Boolean,
            value: true
        }
    },
    data: {
        statusBarHeight: 0,
        height: 44
    },
    created: function () {
        var statusBarHeight = wx.getSystemInfoSync().statusBarHeight;
        this.setData({
            statusBarHeight: statusBarHeight,
            height: 44 + statusBarHeight
        });
    },
    mounted: function () {
        this.setHeight();
    },
    methods: {
        onClickLeft: function () {
            this.$emit('click-left');
        },
        onClickRight: function () {
            this.$emit('click-right');
        },
        setHeight: function () {
            var _this = this;
            if (!this.data.fixed || !this.data.placeholder) {
                return;
            }
            wx.nextTick(function () {
                _this.getRect('.van-nav-bar').then(function (res) {
                    _this.setData({ height: res.height });
                });
            });
        }
    }
});
