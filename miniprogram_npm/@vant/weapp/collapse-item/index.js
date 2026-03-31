"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var component_1 = require("../common/component");
var relation_1 = require("../common/relation");
var animate_1 = require("./animate");
(0, component_1.VantComponent)({
    classes: ['title-class', 'content-class'],
    relation: (0, relation_1.useParent)('collapse'),
    props: {
        size: String,
        name: null,
        title: null,
        value: null,
        icon: String,
        label: String,
        disabled: Boolean,
        clickable: Boolean,
        border: {
            type: Boolean,
            value: true,
        },
        isLink: {
            type: Boolean,
            value: true,
        },
    },
    data: {
        expanded: false,
        parentBorder: true,
    },
    mounted: function () {
        this.updateExpanded();
        this.mounted = true;
    },
    methods: {
        updateExpanded: function () {
            if (!this.parent) {
                return;
            }
            var _a = this.parent.data, value = _a.value, accordion = _a.accordion, border = _a.border;
            var _b = this.parent.children, children = _b === void 0 ? [] : _b;
            var name = this.data.name;
            var index = children.indexOf(this);
            var currentName = name == null ? index : name;
            var expanded = accordion
                ? value === currentName
                : (value || []).some(function (name) { return name === currentName; });
            if (expanded !== this.data.expanded) {
                (0, animate_1.setContentAnimate)(this, expanded, this.mounted);
            }
            this.setData({ index: index, expanded: expanded, parentBorder: border });
        },
        onClick: function () {
            if (this.data.disabled) {
                return;
            }
            var _a = this.data, name = _a.name, expanded = _a.expanded;
            var index = this.parent.children.indexOf(this);
            var currentName = name == null ? index : name;
            this.parent.switch(currentName, !expanded);
        },
    },
});
