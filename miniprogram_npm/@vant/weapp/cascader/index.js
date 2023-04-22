"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
var component_1 = require("../common/component");
var FieldName;
(function (FieldName) {
    FieldName["TEXT"] = "text";
    FieldName["VALUE"] = "value";
    FieldName["CHILDREN"] = "children";
})(FieldName || (FieldName = {}));
var defaultFieldNames = {
    text: FieldName.TEXT,
    value: FieldName.VALUE,
    children: FieldName.CHILDREN,
};
(0, component_1.VantComponent)({
    props: {
        title: String,
        value: {
            type: String,
            observer: 'updateValue',
        },
        placeholder: {
            type: String,
            value: '请选择',
        },
        activeColor: {
            type: String,
            value: '#1989fa',
        },
        options: {
            type: Array,
            value: [],
            observer: 'updateOptions',
        },
        swipeable: {
            type: Boolean,
            value: false,
        },
        closeable: {
            type: Boolean,
            value: true,
        },
        showHeader: {
            type: Boolean,
            value: true,
        },
        closeIcon: {
            type: String,
            value: 'cross',
        },
        fieldNames: {
            type: Object,
            value: defaultFieldNames,
            observer: 'updateFieldNames',
        },
    },
    data: {
        tabs: [],
        activeTab: 0,
        textKey: FieldName.TEXT,
        valueKey: FieldName.VALUE,
        childrenKey: FieldName.CHILDREN,
    },
    created: function () {
        this.updateTabs();
    },
    methods: {
        updateOptions: function (val, oldVal) {
            var isAsync = !!(val.length && oldVal.length);
            this.updateTabs(isAsync);
        },
        updateValue: function (val) {
            var _this = this;
            if (val !== undefined) {
                var values = this.data.tabs.map(function (tab) { return tab.selected && tab.selected[_this.data.valueKey]; });
                if (values.indexOf(val) > -1) {
                    return;
                }
            }
            this.updateTabs();
        },
        updateFieldNames: function () {
            var _a = this.data.fieldNames || defaultFieldNames, _b = _a.text, text = _b === void 0 ? 'text' : _b, _c = _a.value, value = _c === void 0 ? 'value' : _c, _d = _a.children, children = _d === void 0 ? 'children' : _d;
            this.setData({
                textKey: text,
                valueKey: value,
                childrenKey: children,
            });
        },
        getSelectedOptionsByValue: function (options, value) {
            for (var i = 0; i < options.length; i++) {
                var option = options[i];
                if (option[this.data.valueKey] === value) {
                    return [option];
                }
                if (option[this.data.childrenKey]) {
                    var selectedOptions = this.getSelectedOptionsByValue(option[this.data.childrenKey], value);
                    if (selectedOptions) {
                        return __spreadArray([option], selectedOptions, true);
                    }
                }
            }
        },
        updateTabs: function (isAsync) {
            var _this = this;
            if (isAsync === void 0) { isAsync = false; }
            var _a = this.data, options = _a.options, value = _a.value;
            if (value !== undefined) {
                var selectedOptions = this.getSelectedOptionsByValue(options, value);
                if (selectedOptions) {
                    var optionsCursor_1 = options;
                    var tabs_1 = selectedOptions.map(function (option) {
                        var tab = {
                            options: optionsCursor_1,
                            selected: option,
                        };
                        var next = optionsCursor_1.find(function (item) { return item[_this.data.valueKey] === option[_this.data.valueKey]; });
                        if (next) {
                            optionsCursor_1 = next[_this.data.childrenKey];
                        }
                        return tab;
                    });
                    if (optionsCursor_1) {
                        tabs_1.push({
                            options: optionsCursor_1,
                            selected: null,
                        });
                    }
                    this.setData({
                        tabs: tabs_1,
                    });
                    wx.nextTick(function () {
                        _this.setData({
                            activeTab: tabs_1.length - 1,
                        });
                    });
                    return;
                }
            }
            // 异步更新
            if (isAsync) {
                var tabs = this.data.tabs;
                tabs[tabs.length - 1].options =
                    options[options.length - 1][this.data.childrenKey];
                this.setData({
                    tabs: tabs,
                });
                return;
            }
            this.setData({
                tabs: [
                    {
                        options: options,
                        selected: null,
                    },
                ],
            });
        },
        onClose: function () {
            this.$emit('close');
        },
        onClickTab: function (e) {
            var _a = e.detail, tabIndex = _a.index, title = _a.title;
            this.$emit('click-tab', { title: title, tabIndex: tabIndex });
            this.setData({
                activeTab: tabIndex,
            });
        },
        // 选中
        onSelect: function (e) {
            var _this = this;
            var _a = e.currentTarget.dataset, option = _a.option, tabIndex = _a.tabIndex;
            if (option && option.disabled) {
                return;
            }
            var _b = this.data, valueKey = _b.valueKey, childrenKey = _b.childrenKey;
            var tabs = this.data.tabs;
            tabs[tabIndex].selected = option;
            if (tabs.length > tabIndex + 1) {
                tabs = tabs.slice(0, tabIndex + 1);
            }
            if (option[childrenKey]) {
                var nextTab = {
                    options: option[childrenKey],
                    selected: null,
                };
                if (tabs[tabIndex + 1]) {
                    tabs[tabIndex + 1] = nextTab;
                }
                else {
                    tabs.push(nextTab);
                }
                wx.nextTick(function () {
                    _this.setData({
                        activeTab: tabIndex + 1,
                    });
                });
            }
            this.setData({
                tabs: tabs,
            });
            var selectedOptions = tabs.map(function (tab) { return tab.selected; }).filter(Boolean);
            var params = {
                value: option[valueKey],
                tabIndex: tabIndex,
                selectedOptions: selectedOptions,
            };
            this.$emit('change', params);
            if (!option[childrenKey]) {
                this.$emit('finish', params);
            }
        },
    },
});
