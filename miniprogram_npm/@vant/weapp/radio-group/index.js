"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var component_1 = require("../common/component");
var relation_1 = require("../common/relation");
(0, component_1.VantComponent)({
    field: true,
    relation: (0, relation_1.useChildren)('radio'),
    props: {
        value: {
            type: null,
            observer: 'updateChildren',
        },
        direction: String,
        disabled: {
            type: Boolean,
            observer: 'updateChildren',
        },
    },
    methods: {
        updateChildren: function () {
            this.children.forEach(function (child) { return child.updateFromParent(); });
        },
    },
});
