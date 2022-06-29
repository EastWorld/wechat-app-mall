"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var component_1 = require("../common/component");
var relation_1 = require("../common/relation");
(0, component_1.VantComponent)({
    relation: (0, relation_1.useChildren)('col', function (target) {
        var gutter = this.data.gutter;
        if (gutter) {
            target.setData({ gutter: gutter });
        }
    }),
    props: {
        gutter: {
            type: Number,
            observer: 'setGutter',
        },
    },
    methods: {
        setGutter: function () {
            var _this = this;
            this.children.forEach(function (col) {
                col.setData(_this.data);
            });
        },
    },
});
