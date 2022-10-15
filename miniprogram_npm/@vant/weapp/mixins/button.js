"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.button = void 0;
var version_1 = require("../common/version");
exports.button = Behavior({
    externalClasses: ['hover-class'],
    properties: {
        id: String,
        lang: String,
        businessId: Number,
        sessionFrom: String,
        sendMessageTitle: String,
        sendMessagePath: String,
        sendMessageImg: String,
        showMessageCard: Boolean,
        appParameter: String,
        ariaLabel: String,
        openType: String,
        getUserProfileDesc: String,
    },
    data: {
        canIUseGetUserProfile: (0, version_1.canIUseGetUserProfile)(),
    },
    methods: {
        onGetUserInfo: function (event) {
            this.triggerEvent('getuserinfo', event.detail);
        },
        onContact: function (event) {
            this.triggerEvent('contact', event.detail);
        },
        onGetPhoneNumber: function (event) {
            this.triggerEvent('getphonenumber', event.detail);
        },
        onError: function (event) {
            this.triggerEvent('error', event.detail);
        },
        onLaunchApp: function (event) {
            this.triggerEvent('launchapp', event.detail);
        },
        onOpenSetting: function (event) {
            this.triggerEvent('opensetting', event.detail);
        },
        onChooseAvatar: function (event) {
            this.triggerEvent('chooseavatar', event.detail);
        },
    },
});
