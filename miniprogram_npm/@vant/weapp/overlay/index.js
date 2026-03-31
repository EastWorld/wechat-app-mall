"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var component_1 = require("../common/component");
(0, component_1.VantComponent)({
    props: {
        show: Boolean,
        customStyle: String,
        duration: {
            type: null,
            value: 300,
        },
        zIndex: {
            type: Number,
            value: 1,
        },
        lockScroll: {
            type: Boolean,
            value: true,
        },
        rootPortal: {
            type: Boolean,
            value: false,
        },
    },
    methods: {
        onClick: function () {
            this.$emit('click');
        },
        // for prevent touchmove
        noop: function () { },
    },
});
