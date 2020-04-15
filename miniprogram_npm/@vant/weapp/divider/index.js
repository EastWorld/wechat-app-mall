"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var component_1 = require("../common/component");
component_1.VantComponent({
    props: {
        dashed: {
            type: Boolean,
            value: false
        },
        hairline: {
            type: Boolean,
            value: false
        },
        contentPosition: {
            type: String,
            value: ''
        },
        fontSize: {
            type: Number,
            value: ''
        },
        borderColor: {
            type: String,
            value: ''
        },
        textColor: {
            type: String,
            value: ''
        },
        customStyle: {
            type: String,
            value: ''
        }
    }
});
