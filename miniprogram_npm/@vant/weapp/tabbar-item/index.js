"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var component_1 = require("../common/component");
var relation_1 = require("../common/relation");
(0, component_1.VantComponent)({
    props: {
        info: null,
        name: null,
        icon: String,
        dot: Boolean,
        url: {
            type: String,
            value: '',
        },
        linkType: {
            type: String,
            value: 'redirectTo',
        },
        iconPrefix: {
            type: String,
            value: 'van-icon',
        },
    },
    relation: (0, relation_1.useParent)('tabbar'),
    data: {
        active: false,
        activeColor: '',
        inactiveColor: '',
    },
    methods: {
        onClick: function () {
            var parent = this.parent;
            if (parent) {
                var index = parent.children.indexOf(this);
                var active = this.data.name || index;
                if (active !== this.data.active) {
                    parent.$emit('change', active);
                }
            }
            var _a = this.data, url = _a.url, linkType = _a.linkType;
            if (url && wx[linkType]) {
                return wx[linkType]({ url: url });
            }
            this.$emit('click');
        },
        updateFromParent: function () {
            var parent = this.parent;
            if (!parent) {
                return;
            }
            var index = parent.children.indexOf(this);
            var parentData = parent.data;
            var data = this.data;
            var active = (data.name || index) === parentData.active;
            var patch = {};
            if (active !== data.active) {
                patch.active = active;
            }
            if (parentData.activeColor !== data.activeColor) {
                patch.activeColor = parentData.activeColor;
            }
            if (parentData.inactiveColor !== data.inactiveColor) {
                patch.inactiveColor = parentData.inactiveColor;
            }
            if (Object.keys(patch).length > 0) {
                this.setData(patch);
            }
        },
    },
});
