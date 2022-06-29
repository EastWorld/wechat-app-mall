"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var component_1 = require("../common/component");
var relation_1 = require("../common/relation");
var link_1 = require("../mixins/link");
(0, component_1.VantComponent)({
    relation: (0, relation_1.useParent)('grid'),
    classes: ['content-class', 'icon-class', 'text-class'],
    mixins: [link_1.link],
    props: {
        icon: String,
        iconColor: String,
        iconPrefix: {
            type: String,
            value: 'van-icon',
        },
        dot: Boolean,
        info: null,
        badge: null,
        text: String,
        useSlot: Boolean,
    },
    data: {
        viewStyle: '',
    },
    mounted: function () {
        this.updateStyle();
    },
    methods: {
        updateStyle: function () {
            if (!this.parent) {
                return;
            }
            var _a = this.parent, data = _a.data, children = _a.children;
            var columnNum = data.columnNum, border = data.border, square = data.square, gutter = data.gutter, clickable = data.clickable, center = data.center, direction = data.direction, reverse = data.reverse, iconSize = data.iconSize;
            this.setData({
                center: center,
                border: border,
                square: square,
                gutter: gutter,
                clickable: clickable,
                direction: direction,
                reverse: reverse,
                iconSize: iconSize,
                index: children.indexOf(this),
                columnNum: columnNum,
            });
        },
        onClick: function () {
            this.$emit('click');
            this.jumpLink();
        },
    },
});
