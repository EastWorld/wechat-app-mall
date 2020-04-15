"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var link_1 = require("../mixins/link");
var component_1 = require("../common/component");
var utils_1 = require("../common/utils");
component_1.VantComponent({
    relation: {
        name: 'grid',
        type: 'ancestor',
        current: 'grid-item',
    },
    classes: ['content-class', 'icon-class', 'text-class'],
    mixins: [link_1.link],
    props: {
        icon: String,
        dot: Boolean,
        info: null,
        text: String,
        useSlot: Boolean
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
            var columnNum = data.columnNum, border = data.border, square = data.square, gutter = data.gutter, clickable = data.clickable, center = data.center;
            var width = 100 / columnNum + "%";
            var styleWrapper = [];
            styleWrapper.push("width: " + width);
            if (square) {
                styleWrapper.push("padding-top: " + width);
            }
            if (gutter) {
                var gutterValue = utils_1.addUnit(gutter);
                styleWrapper.push("padding-right: " + gutterValue);
                var index = children.indexOf(this);
                if (index >= columnNum) {
                    styleWrapper.push("margin-top: " + gutterValue);
                }
            }
            var contentStyle = '';
            if (square && gutter) {
                var gutterValue = utils_1.addUnit(gutter);
                contentStyle = "\n          right: " + gutterValue + ";\n          bottom: " + gutterValue + ";\n          height: auto;\n        ";
            }
            this.setData({
                viewStyle: styleWrapper.join('; '),
                contentStyle: contentStyle,
                center: center,
                border: border,
                square: square,
                gutter: gutter,
                clickable: clickable
            });
        },
        onClick: function () {
            this.$emit('click');
            this.jumpLink();
        }
    }
});
