"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var component_1 = require("../common/component");
var button_1 = require("../mixins/button");
var version_1 = require("../common/version");
var mixins = [button_1.button];
if ((0, version_1.canIUseFormFieldButton)()) {
    mixins.push('wx://form-field-button');
}
(0, component_1.VantComponent)({
    mixins: mixins,
    classes: ['hover-class', 'loading-class'],
    data: {
        baseStyle: '',
    },
    props: {
        formType: String,
        icon: String,
        classPrefix: {
            type: String,
            value: 'van-icon',
        },
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
            value: 'circular',
        },
        type: {
            type: String,
            value: 'default',
        },
        dataset: null,
        size: {
            type: String,
            value: 'normal',
        },
        loadingSize: {
            type: String,
            value: '20px',
        },
        color: String,
    },
    methods: {
        onClick: function (event) {
            var _this = this;
            this.$emit('click', event);
            var _a = this.data, canIUseGetUserProfile = _a.canIUseGetUserProfile, openType = _a.openType, getUserProfileDesc = _a.getUserProfileDesc, lang = _a.lang;
            if (openType === 'getUserInfo' && canIUseGetUserProfile) {
                wx.getUserProfile({
                    desc: getUserProfileDesc || '  ',
                    lang: lang || 'en',
                    complete: function (userProfile) {
                        _this.$emit('getuserinfo', userProfile);
                    },
                });
            }
        },
    },
});
