"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.link = void 0;
exports.link = Behavior({
    properties: {
        url: String,
        linkType: {
            type: String,
            value: 'navigateTo',
        },
    },
    methods: {
        jumpLink: function (urlKey) {
            if (urlKey === void 0) { urlKey = 'url'; }
            var url = this.data[urlKey];
            if (url) {
                if (this.data.linkType === 'navigateTo' &&
                    getCurrentPages().length > 9) {
                    wx.redirectTo({ url: url });
                }
                else {
                    wx[this.data.linkType]({ url: url });
                }
            }
        },
    },
});
