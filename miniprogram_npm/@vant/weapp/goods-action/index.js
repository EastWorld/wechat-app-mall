"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var component_1 = require("../common/component");
component_1.VantComponent({
    relation: {
        type: 'descendant',
        name: 'goods-action-button',
        current: 'goods-action',
    },
    props: {
        safeAreaInsetBottom: {
            type: Boolean,
            value: true
        }
    }
});
