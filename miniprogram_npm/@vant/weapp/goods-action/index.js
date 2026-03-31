"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var component_1 = require("../common/component");
var relation_1 = require("../common/relation");
(0, component_1.VantComponent)({
    relation: (0, relation_1.useChildren)('goods-action-button', function () {
        this.children.forEach(function (item) {
            item.updateStyle();
        });
    }),
    props: {
        safeAreaInsetBottom: {
            type: Boolean,
            value: true,
        },
    },
});
