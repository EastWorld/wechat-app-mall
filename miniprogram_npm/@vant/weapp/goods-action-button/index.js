"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var component_1 = require("../common/component");
var relation_1 = require("../common/relation");
var button_1 = require("../mixins/button");
var link_1 = require("../mixins/link");
(0, component_1.VantComponent)({
    mixins: [link_1.link, button_1.button],
    relation: (0, relation_1.useParent)('goods-action'),
    props: {
        text: String,
        color: String,
        size: {
            type: String,
            value: 'normal',
        },
        loading: Boolean,
        disabled: Boolean,
        plain: Boolean,
        type: {
            type: String,
            value: 'danger',
        },
    },
    methods: {
        onClick: function (event) {
            this.$emit('click', event.detail);
            this.jumpLink();
        },
        updateStyle: function () {
            if (this.parent == null) {
                return;
            }
            var index = this.index;
            var _a = this.parent.children, children = _a === void 0 ? [] : _a;
            this.setData({
                isFirst: index === 0,
                isLast: index === children.length - 1,
            });
        },
    },
});
