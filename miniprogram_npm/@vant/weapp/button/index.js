"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var component_1 = require("../common/component");
var button_1 = require("../mixins/button");
var open_type_1 = require("../mixins/open-type");
component_1.VantComponent({
    mixins: [button_1.button, open_type_1.openType],
    classes: ['hover-class', 'loading-class'],
    data: {
        baseStyle: ''
    },
    props: {
        icon: String,
        plain: Boolean,
        block: Boolean,
        round: Boolean,
        square: Boolean,
        loading: Boolean,
        hairline: Boolean,
        disabled: Boolean,
        loadingText: String,
        customStyle: String,
        loadingType: {
            type: String,
            value: 'circular'
        },
        type: {
            type: String,
            value: 'default'
        },
        size: {
            type: String,
            value: 'normal'
        },
        loadingSize: {
            type: String,
            value: '20px'
        },
        color: {
            type: String,
            observer: function (color) {
                var style = '';
                if (color) {
                    style += "color: " + (this.data.plain ? color : 'white') + ";";
                    if (!this.data.plain) {
                        // Use background instead of backgroundColor to make linear-gradient work
                        style += "background: " + color + ";";
                    }
                    // hide border when color is linear-gradient
                    if (color.indexOf('gradient') !== -1) {
                        style += 'border: 0;';
                    }
                    else {
                        style += "border-color: " + color + ";";
                    }
                }
                if (style !== this.data.baseStyle) {
                    this.setData({ baseStyle: style });
                }
            }
        }
    },
    methods: {
        onClick: function () {
            if (!this.data.loading) {
                this.$emit('click');
            }
        },
        noop: function () { }
    }
});
