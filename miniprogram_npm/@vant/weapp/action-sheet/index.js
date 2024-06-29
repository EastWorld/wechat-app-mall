"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var component_1 = require("../common/component");
var button_1 = require("../mixins/button");
(0, component_1.VantComponent)({
    classes: ['list-class'],
    mixins: [button_1.button],
    props: {
        show: Boolean,
        title: String,
        cancelText: String,
        description: String,
        round: {
            type: Boolean,
            value: true,
        },
        zIndex: {
            type: Number,
            value: 100,
        },
        actions: {
            type: Array,
            value: [],
        },
        overlay: {
            type: Boolean,
            value: true,
        },
        closeOnClickOverlay: {
            type: Boolean,
            value: true,
        },
        closeOnClickAction: {
            type: Boolean,
            value: true,
        },
        safeAreaInsetBottom: {
            type: Boolean,
            value: true,
        },
        rootPortal: {
            type: Boolean,
            value: false,
        },
    },
    methods: {
        onSelect: function (event) {
            var _this = this;
            var index = event.currentTarget.dataset.index;
            var _a = this.data, actions = _a.actions, closeOnClickAction = _a.closeOnClickAction, canIUseGetUserProfile = _a.canIUseGetUserProfile;
            var item = actions[index];
            if (item) {
                this.$emit('select', item);
                if (closeOnClickAction) {
                    this.onClose();
                }
                if (item.openType === 'getUserInfo' && canIUseGetUserProfile) {
                    wx.getUserProfile({
                        desc: item.getUserProfileDesc || '  ',
                        complete: function (userProfile) {
                            _this.$emit('getuserinfo', userProfile);
                        },
                    });
                }
            }
        },
        onCancel: function () {
            this.$emit('cancel');
        },
        onClose: function () {
            this.$emit('close');
        },
        onClickOverlay: function () {
            this.$emit('click-overlay');
            this.onClose();
        },
    },
});
