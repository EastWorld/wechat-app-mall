"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var component_1 = require("../common/component");
var button_1 = require("../mixins/button");
var link_1 = require("../mixins/link");
(0, component_1.VantComponent)({
    classes: ['icon-class', 'text-class'],
    mixins: [link_1.link, button_1.button],
    props: {
        text: String,
        dot: Boolean,
        info: String,
        icon: String,
        classPrefix: {
            type: String,
            value: 'van-icon',
        },
        disabled: Boolean,
        loading: Boolean,
    },
    methods: {
        onClick: function (event) {
            this.$emit('click', event.detail);
            this.jumpLink();
        },
    },
});
