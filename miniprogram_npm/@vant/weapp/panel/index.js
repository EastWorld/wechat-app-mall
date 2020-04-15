"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var component_1 = require("../common/component");
component_1.VantComponent({
    classes: ['header-class', 'footer-class'],
    props: {
        desc: String,
        title: String,
        status: String,
        useFooterSlot: Boolean
    }
});
