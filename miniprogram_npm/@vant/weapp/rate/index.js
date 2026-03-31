"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("../common/utils");
var component_1 = require("../common/component");
var version_1 = require("../common/version");
(0, component_1.VantComponent)({
    field: true,
    classes: ['icon-class'],
    props: {
        value: {
            type: Number,
            observer: function (value) {
                if (value !== this.data.innerValue) {
                    this.setData({ innerValue: value });
                }
            },
        },
        readonly: Boolean,
        disabled: Boolean,
        allowHalf: Boolean,
        size: null,
        icon: {
            type: String,
            value: 'star',
        },
        voidIcon: {
            type: String,
            value: 'star-o',
        },
        color: String,
        voidColor: String,
        disabledColor: String,
        count: {
            type: Number,
            value: 5,
            observer: function (value) {
                this.setData({ innerCountArray: Array.from({ length: value }) });
            },
        },
        gutter: null,
        touchable: {
            type: Boolean,
            value: true,
        },
    },
    data: {
        innerValue: 0,
        innerCountArray: Array.from({ length: 5 }),
    },
    methods: {
        onSelect: function (event) {
            var _this = this;
            var data = this.data;
            var score = event.currentTarget.dataset.score;
            if (!data.disabled && !data.readonly) {
                this.setData({ innerValue: score + 1 });
                if ((0, version_1.canIUseModel)()) {
                    this.setData({ value: score + 1 });
                }
                wx.nextTick(function () {
                    _this.$emit('input', score + 1);
                    _this.$emit('change', score + 1);
                });
            }
        },
        onTouchMove: function (event) {
            var _this = this;
            var touchable = this.data.touchable;
            if (!touchable)
                return;
            var clientX = event.touches[0].clientX;
            (0, utils_1.getAllRect)(this, '.van-rate__icon').then(function (list) {
                var target = list
                    .sort(function (cur, next) { return cur.dataset.score - next.dataset.score; })
                    .find(function (item) { return clientX >= item.left && clientX <= item.right; });
                if (target != null) {
                    _this.onSelect(__assign(__assign({}, event), { currentTarget: target }));
                }
            });
        },
    },
});
