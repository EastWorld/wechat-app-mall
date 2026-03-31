"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var component_1 = require("../common/component");
(0, component_1.VantComponent)({
    classes: ['info-class'],
    props: {
        dot: Boolean,
        info: null,
        size: null,
        color: String,
        customStyle: String,
        classPrefix: {
            type: String,
            value: 'van-icon',
        },
        name: String,
    },
    methods: {
        onClick: function () {
            this.$emit('click');
        },
    },
});
