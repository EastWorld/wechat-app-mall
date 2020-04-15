"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var component_1 = require("../common/component");
var nextTick = function () { return new Promise(function (resolve) { return setTimeout(resolve, 20); }); };
component_1.VantComponent({
    classes: ['title-class', 'content-class'],
    relation: {
        name: 'collapse',
        type: 'ancestor',
        current: 'collapse-item',
    },
    props: {
        name: null,
        title: null,
        value: null,
        icon: String,
        label: String,
        disabled: Boolean,
        clickable: Boolean,
        border: {
            type: Boolean,
            value: true
        },
        isLink: {
            type: Boolean,
            value: true
        }
    },
    data: {
        contentHeight: 0,
        expanded: false,
        transition: false
    },
    mounted: function () {
        var _this = this;
        this.updateExpanded()
            .then(nextTick)
            .then(function () {
            var data = { transition: true };
            if (_this.data.expanded) {
                data.contentHeight = 'auto';
            }
            _this.setData(data);
        });
    },
    methods: {
        updateExpanded: function () {
            if (!this.parent) {
                return Promise.resolve();
            }
            var _a = this.parent.data, value = _a.value, accordion = _a.accordion;
            var _b = this.parent.children, children = _b === void 0 ? [] : _b;
            var name = this.data.name;
            var index = children.indexOf(this);
            var currentName = name == null ? index : name;
            var expanded = accordion
                ? value === currentName
                : (value || []).some(function (name) { return name === currentName; });
            var stack = [];
            if (expanded !== this.data.expanded) {
                stack.push(this.updateStyle(expanded));
            }
            stack.push(this.set({ index: index, expanded: expanded }));
            return Promise.all(stack);
        },
        updateStyle: function (expanded) {
            var _this = this;
            return this.getRect('.van-collapse-item__content')
                .then(function (rect) { return rect.height; })
                .then(function (height) {
                if (expanded) {
                    return _this.set({
                        contentHeight: height ? height + "px" : 'auto'
                    });
                }
                return _this.set({ contentHeight: height + "px" })
                    .then(nextTick)
                    .then(function () { return _this.set({ contentHeight: 0 }); });
            });
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
        onTransitionEnd: function () {
            if (this.data.expanded) {
                this.setData({
                    contentHeight: 'auto'
                });
            }
        }
    }
});
