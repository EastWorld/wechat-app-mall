"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var component_1 = require("../common/component");
var color_1 = require("../common/color");
component_1.VantComponent({
    field: true,
    classes: ['node-class'],
    props: {
        checked: {
            type: null,
            observer: function (value) {
                var loadingColor = this.getLoadingColor(value);
                this.setData({ value: value, loadingColor: loadingColor });
            }
        },
        loading: Boolean,
        disabled: Boolean,
        activeColor: String,
        inactiveColor: String,
        size: {
            type: String,
            value: '30px'
        },
        activeValue: {
            type: null,
            value: true
        },
        inactiveValue: {
            type: null,
            value: false
        }
    },
    created: function () {
        var value = this.data.checked;
        var loadingColor = this.getLoadingColor(value);
        this.setData({ value: value, loadingColor: loadingColor });
    },
    methods: {
        getLoadingColor: function (checked) {
            var _a = this.data, activeColor = _a.activeColor, inactiveColor = _a.inactiveColor;
            return checked ? activeColor || color_1.BLUE : inactiveColor || color_1.GRAY_DARK;
        },
        onClick: function () {
            var _a = this.data, activeValue = _a.activeValue, inactiveValue = _a.inactiveValue;
            if (!this.data.disabled && !this.data.loading) {
                var checked = this.data.checked === activeValue;
                var value = checked ? inactiveValue : activeValue;
                this.$emit('input', value);
                this.$emit('change', value);
            }
        }
    }
});
