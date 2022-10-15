"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var component_1 = require("../common/component");
var relation_1 = require("../common/relation");
(0, component_1.VantComponent)({
    classes: ['active-class', 'disabled-class'],
    relation: (0, relation_1.useParent)('sidebar'),
    props: {
        dot: Boolean,
        badge: null,
        info: null,
        title: String,
        disabled: Boolean,
    },
    methods: {
        onClick: function () {
            var _this = this;
            var parent = this.parent;
            if (!parent || this.data.disabled) {
                return;
            }
            var index = parent.children.indexOf(this);
            parent.setActive(index).then(function () {
                _this.$emit('click', index);
                parent.$emit('change', index);
            });
        },
        setActive: function (selected) {
            return this.setData({ selected: selected });
        },
    },
});
