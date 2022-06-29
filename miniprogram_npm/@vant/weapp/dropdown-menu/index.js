"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var component_1 = require("../common/component");
var relation_1 = require("../common/relation");
var utils_1 = require("../common/utils");
var ARRAY = [];
(0, component_1.VantComponent)({
    field: true,
    relation: (0, relation_1.useChildren)('dropdown-item', function () {
        this.updateItemListData();
    }),
    props: {
        activeColor: {
            type: String,
            observer: 'updateChildrenData',
        },
        overlay: {
            type: Boolean,
            value: true,
            observer: 'updateChildrenData',
        },
        zIndex: {
            type: Number,
            value: 10,
        },
        duration: {
            type: Number,
            value: 200,
            observer: 'updateChildrenData',
        },
        direction: {
            type: String,
            value: 'down',
            observer: 'updateChildrenData',
        },
        closeOnClickOverlay: {
            type: Boolean,
            value: true,
            observer: 'updateChildrenData',
        },
        closeOnClickOutside: {
            type: Boolean,
            value: true,
        },
    },
    data: {
        itemListData: [],
    },
    beforeCreate: function () {
        var windowHeight = (0, utils_1.getSystemInfoSync)().windowHeight;
        this.windowHeight = windowHeight;
        ARRAY.push(this);
    },
    destroyed: function () {
        var _this = this;
        ARRAY = ARRAY.filter(function (item) { return item !== _this; });
    },
    methods: {
        updateItemListData: function () {
            this.setData({
                itemListData: this.children.map(function (child) { return child.data; }),
            });
        },
        updateChildrenData: function () {
            this.children.forEach(function (child) {
                child.updateDataFromParent();
            });
        },
        toggleItem: function (active) {
            this.children.forEach(function (item, index) {
                var showPopup = item.data.showPopup;
                if (index === active) {
                    item.toggle();
                }
                else if (showPopup) {
                    item.toggle(false, { immediate: true });
                }
            });
        },
        close: function () {
            this.children.forEach(function (child) {
                child.toggle(false, { immediate: true });
            });
        },
        getChildWrapperStyle: function () {
            var _this = this;
            var _a = this.data, zIndex = _a.zIndex, direction = _a.direction;
            return (0, utils_1.getRect)(this, '.van-dropdown-menu').then(function (rect) {
                var _a = rect.top, top = _a === void 0 ? 0 : _a, _b = rect.bottom, bottom = _b === void 0 ? 0 : _b;
                var offset = direction === 'down' ? bottom : _this.windowHeight - top;
                var wrapperStyle = "z-index: ".concat(zIndex, ";");
                if (direction === 'down') {
                    wrapperStyle += "top: ".concat((0, utils_1.addUnit)(offset), ";");
                }
                else {
                    wrapperStyle += "bottom: ".concat((0, utils_1.addUnit)(offset), ";");
                }
                return wrapperStyle;
            });
        },
        onTitleTap: function (event) {
            var _this = this;
            var index = event.currentTarget.dataset.index;
            var child = this.children[index];
            if (!child.data.disabled) {
                ARRAY.forEach(function (menuItem) {
                    if (menuItem &&
                        menuItem.data.closeOnClickOutside &&
                        menuItem !== _this) {
                        menuItem.close();
                    }
                });
                this.toggleItem(index);
            }
        },
    },
});
