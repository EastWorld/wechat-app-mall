"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var component_1 = require("../common/component");
component_1.VantComponent({
    relation: {
        name: 'collapse-item',
        type: 'descendant',
        current: 'collapse',
    },
    props: {
        value: {
            type: null,
            observer: 'updateExpanded'
        },
        accordion: {
            type: Boolean,
            observer: 'updateExpanded'
        },
        border: {
            type: Boolean,
            value: true
        }
    },
    methods: {
        updateExpanded: function () {
            this.children.forEach(function (child) {
                child.updateExpanded();
            });
        },
        switch: function (name, expanded) {
            var _a = this.data, accordion = _a.accordion, value = _a.value;
            if (!accordion) {
                name = expanded
                    ? (value || []).concat(name)
                    : (value || []).filter(function (activeName) { return activeName !== name; });
            }
            else {
                name = expanded ? name : '';
            }
            this.$emit('change', name);
            this.$emit('input', name);
        }
    }
});
