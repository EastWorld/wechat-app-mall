"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
        ariaLabel: String
    }
});
