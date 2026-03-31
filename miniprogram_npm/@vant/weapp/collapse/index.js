"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var component_1 = require("../common/component");
var relation_1 = require("../common/relation");
(0, component_1.VantComponent)({
    relation: (0, relation_1.useChildren)('collapse-item'),
    props: {
        value: {
            type: null,
            observer: 'updateExpanded',
        },
        accordion: {
            type: Boolean,
            observer: 'updateExpanded',
        },
        border: {
            type: Boolean,
            value: true,
        },
    },
    methods: {
        updateExpanded: function () {
            this.children.forEach(function (child) {
                child.updateExpanded();
            });
        },
        switch: function (name, expanded) {
            var _a = this.data, accordion = _a.accordion, value = _a.value;
            var changeItem = name;
            if (!accordion) {
                name = expanded
                    ? (value || []).concat(name)
                    : (value || []).filter(function (activeName) { return activeName !== name; });
            }
            else {
                name = expanded ? name : '';
            }
            if (expanded) {
                this.$emit('open', changeItem);
            }
            else {
                this.$emit('close', changeItem);
            }
            this.$emit('change', name);
            this.$emit('input', name);
        },
    },
});
