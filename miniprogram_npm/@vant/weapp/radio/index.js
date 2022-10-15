"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var version_1 = require("../common/version");
var component_1 = require("../common/component");
var relation_1 = require("../common/relation");
(0, component_1.VantComponent)({
    field: true,
    relation: (0, relation_1.useParent)('radio-group', function () {
        this.updateFromParent();
    }),
    classes: ['icon-class', 'label-class'],
    props: {
        name: null,
        value: null,
        disabled: Boolean,
        useIconSlot: Boolean,
        checkedColor: String,
        labelPosition: {
            type: String,
            value: 'right',
        },
        labelDisabled: Boolean,
        shape: {
            type: String,
            value: 'round',
        },
        iconSize: {
            type: null,
            value: 20,
        },
    },
    data: {
        direction: '',
        parentDisabled: false,
    },
    methods: {
        updateFromParent: function () {
            if (!this.parent) {
                return;
            }
            var _a = this.parent.data, value = _a.value, parentDisabled = _a.disabled, direction = _a.direction;
            this.setData({
                value: value,
                direction: direction,
                parentDisabled: parentDisabled,
            });
        },
        emitChange: function (value) {
            var instance = this.parent || this;
            instance.$emit('input', value);
            instance.$emit('change', value);
            if ((0, version_1.canIUseModel)()) {
                instance.setData({ value: value });
            }
        },
        onChange: function () {
            if (!this.data.disabled && !this.data.parentDisabled) {
                this.emitChange(this.data.name);
            }
        },
        onClickLabel: function () {
            var _a = this.data, disabled = _a.disabled, parentDisabled = _a.parentDisabled, labelDisabled = _a.labelDisabled, name = _a.name;
            if (!(disabled || parentDisabled) && !labelDisabled) {
                this.emitChange(name);
            }
        },
    },
});
