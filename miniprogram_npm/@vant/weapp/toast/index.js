"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var component_1 = require("../common/component");
(0, component_1.VantComponent)({
    props: {
        show: Boolean,
        mask: Boolean,
        message: String,
        forbidClick: Boolean,
        zIndex: {
            type: Number,
            value: 1000,
        },
        type: {
            type: String,
            value: 'text',
        },
        loadingType: {
            type: String,
            value: 'circular',
        },
        position: {
            type: String,
            value: 'middle',
        },
    },
    methods: {
        // for prevent touchmove
        noop: function () { },
    },
});
