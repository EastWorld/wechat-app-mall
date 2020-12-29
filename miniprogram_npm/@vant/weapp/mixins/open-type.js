'use strict';
// @ts-nocheck
Object.defineProperty(exports, '__esModule', { value: true });
exports.openType = void 0;
exports.openType = Behavior({
  properties: {
    openType: String,
  },
  methods: {
    bindGetUserInfo: function (event) {
      this.$emit('getuserinfo', event.detail);
    },
    bindContact: function (event) {
      this.$emit('contact', event.detail);
    },
    bindGetPhoneNumber: function (event) {
      this.$emit('getphonenumber', event.detail);
    },
    bindError: function (event) {
      this.$emit('error', event.detail);
    },
    bindLaunchApp: function (event) {
      this.$emit('launchapp', event.detail);
    },
    bindOpenSetting: function (event) {
      this.$emit('opensetting', event.detail);
    },
  },
});
