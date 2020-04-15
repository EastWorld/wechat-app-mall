"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var component_1 = require("../common/component");
var utils_1 = require("../common/utils");
var shared_1 = require("../picker/shared");
var currentYear = new Date().getFullYear();
function isValidDate(date) {
    return utils_1.isDef(date) && !isNaN(new Date(date).getTime());
}
function range(num, min, max) {
    return Math.min(Math.max(num, min), max);
}
function padZero(val) {
    return ("00" + val).slice(-2);
}
function times(n, iteratee) {
    var index = -1;
    var result = Array(n < 0 ? 0 : n);
    while (++index < n) {
        result[index] = iteratee(index);
    }
    return result;
}
function getTrueValue(formattedValue) {
    if (!formattedValue)
        return;
    while (isNaN(parseInt(formattedValue, 10))) {
        formattedValue = formattedValue.slice(1);
    }
    return parseInt(formattedValue, 10);
}
function getMonthEndDay(year, month) {
    return 32 - new Date(year, month - 1, 32).getDate();
}
var defaultFormatter = function (_, value) { return value; };
component_1.VantComponent({
    classes: ['active-class', 'toolbar-class', 'column-class'],
    props: __assign(__assign({}, shared_1.pickerProps), { value: {
            type: null,
            observer: 'updateValue'
        }, filter: null, type: {
            type: String,
            value: 'datetime',
            observer: 'updateValue'
        }, showToolbar: {
            type: Boolean,
            value: true
        }, formatter: {
            type: null,
            value: defaultFormatter
        }, minDate: {
            type: Number,
            value: new Date(currentYear - 10, 0, 1).getTime(),
            observer: 'updateValue'
        }, maxDate: {
            type: Number,
            value: new Date(currentYear + 10, 11, 31).getTime(),
            observer: 'updateValue'
        }, minHour: {
            type: Number,
            value: 0,
            observer: 'updateValue'
        }, maxHour: {
            type: Number,
            value: 23,
            observer: 'updateValue'
        }, minMinute: {
            type: Number,
            value: 0,
            observer: 'updateValue'
        }, maxMinute: {
            type: Number,
            value: 59,
            observer: 'updateValue'
        } }),
    data: {
        innerValue: Date.now(),
        columns: []
    },
    methods: {
        updateValue: function () {
            var _this = this;
            var data = this.data;
            var val = this.correctValue(this.data.value);
            var isEqual = val === data.innerValue;
            if (!isEqual) {
                this.updateColumnValue(val).then(function () {
                    _this.$emit('input', val);
                });
            }
            else {
                this.updateColumns();
            }
        },
        getPicker: function () {
            if (this.picker == null) {
                this.picker = this.selectComponent('.van-datetime-picker');
                var picker_1 = this.picker;
                var setColumnValues_1 = picker_1.setColumnValues;
                picker_1.setColumnValues = function () {
                    var args = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        args[_i] = arguments[_i];
                    }
                    return setColumnValues_1.apply(picker_1, __spreadArrays(args, [false]));
                };
            }
            return this.picker;
        },
        updateColumns: function () {
            var _a = this.data.formatter, formatter = _a === void 0 ? defaultFormatter : _a;
            var results = this.getOriginColumns().map(function (column) { return ({
                values: column.values.map(function (value) { return formatter(column.type, value); })
            }); });
            return this.set({ columns: results });
        },
        getOriginColumns: function () {
            var filter = this.data.filter;
            var results = this.getRanges().map(function (_a) {
                var type = _a.type, range = _a.range;
                var values = times(range[1] - range[0] + 1, function (index) {
                    var value = range[0] + index;
                    value = type === 'year' ? "" + value : padZero(value);
                    return value;
                });
                if (filter) {
                    values = filter(type, values);
                }
                return { type: type, values: values };
            });
            return results;
        },
        getRanges: function () {
            var data = this.data;
            if (data.type === 'time') {
                return [
                    {
                        type: 'hour',
                        range: [data.minHour, data.maxHour]
                    },
                    {
                        type: 'minute',
                        range: [data.minMinute, data.maxMinute]
                    }
                ];
            }
            var _a = this.getBoundary('max', data.innerValue), maxYear = _a.maxYear, maxDate = _a.maxDate, maxMonth = _a.maxMonth, maxHour = _a.maxHour, maxMinute = _a.maxMinute;
            var _b = this.getBoundary('min', data.innerValue), minYear = _b.minYear, minDate = _b.minDate, minMonth = _b.minMonth, minHour = _b.minHour, minMinute = _b.minMinute;
            var result = [
                {
                    type: 'year',
                    range: [minYear, maxYear]
                },
                {
                    type: 'month',
                    range: [minMonth, maxMonth]
                },
                {
                    type: 'day',
                    range: [minDate, maxDate]
                },
                {
                    type: 'hour',
                    range: [minHour, maxHour]
                },
                {
                    type: 'minute',
                    range: [minMinute, maxMinute]
                }
            ];
            if (data.type === 'date')
                result.splice(3, 2);
            if (data.type === 'year-month')
                result.splice(2, 3);
            return result;
        },
        correctValue: function (value) {
            var data = this.data;
            // validate value
            var isDateType = data.type !== 'time';
            if (isDateType && !isValidDate(value)) {
                value = data.minDate;
            }
            else if (!isDateType && !value) {
                var minHour = data.minHour;
                value = padZero(minHour) + ":00";
            }
            // time type
            if (!isDateType) {
                var _a = value.split(':'), hour = _a[0], minute = _a[1];
                hour = padZero(range(hour, data.minHour, data.maxHour));
                minute = padZero(range(minute, data.minMinute, data.maxMinute));
                return hour + ":" + minute;
            }
            // date type
            value = Math.max(value, data.minDate);
            value = Math.min(value, data.maxDate);
            return value;
        },
        getBoundary: function (type, innerValue) {
            var _a;
            var value = new Date(innerValue);
            var boundary = new Date(this.data[type + "Date"]);
            var year = boundary.getFullYear();
            var month = 1;
            var date = 1;
            var hour = 0;
            var minute = 0;
            if (type === 'max') {
                month = 12;
                date = getMonthEndDay(value.getFullYear(), value.getMonth() + 1);
                hour = 23;
                minute = 59;
            }
            if (value.getFullYear() === year) {
                month = boundary.getMonth() + 1;
                if (value.getMonth() + 1 === month) {
                    date = boundary.getDate();
                    if (value.getDate() === date) {
                        hour = boundary.getHours();
                        if (value.getHours() === hour) {
                            minute = boundary.getMinutes();
                        }
                    }
                }
            }
            return _a = {},
                _a[type + "Year"] = year,
                _a[type + "Month"] = month,
                _a[type + "Date"] = date,
                _a[type + "Hour"] = hour,
                _a[type + "Minute"] = minute,
                _a;
        },
        onCancel: function () {
            this.$emit('cancel');
        },
        onConfirm: function () {
            this.$emit('confirm', this.data.innerValue);
        },
        onChange: function () {
            var _this = this;
            var data = this.data;
            var value;
            var picker = this.getPicker();
            if (data.type === 'time') {
                var indexes = picker.getIndexes();
                value = +data.columns[0].values[indexes[0]] + ":" + +data.columns[1].values[indexes[1]];
            }
            else {
                var values = picker.getValues();
                var year = getTrueValue(values[0]);
                var month = getTrueValue(values[1]);
                var maxDate = getMonthEndDay(year, month);
                var date = getTrueValue(values[2]);
                if (data.type === 'year-month') {
                    date = 1;
                }
                date = date > maxDate ? maxDate : date;
                var hour = 0;
                var minute = 0;
                if (data.type === 'datetime') {
                    hour = getTrueValue(values[3]);
                    minute = getTrueValue(values[4]);
                }
                value = new Date(year, month - 1, date, hour, minute);
            }
            value = this.correctValue(value);
            this.updateColumnValue(value).then(function () {
                _this.$emit('input', value);
                _this.$emit('change', picker);
            });
        },
        updateColumnValue: function (value) {
            var _this = this;
            var values = [];
            var _a = this.data, type = _a.type, _b = _a.formatter, formatter = _b === void 0 ? defaultFormatter : _b;
            var picker = this.getPicker();
            if (type === 'time') {
                var pair = value.split(':');
                values = [
                    formatter('hour', pair[0]),
                    formatter('minute', pair[1])
                ];
            }
            else {
                var date = new Date(value);
                values = [
                    formatter('year', "" + date.getFullYear()),
                    formatter('month', padZero(date.getMonth() + 1))
                ];
                if (type === 'date') {
                    values.push(formatter('day', padZero(date.getDate())));
                }
                if (type === 'datetime') {
                    values.push(formatter('day', padZero(date.getDate())), formatter('hour', padZero(date.getHours())), formatter('minute', padZero(date.getMinutes())));
                }
            }
            return this.set({ innerValue: value })
                .then(function () { return _this.updateColumns(); })
                .then(function () { return picker.setValues(values); });
        }
    },
    created: function () {
        var _this = this;
        var innerValue = this.correctValue(this.data.value);
        this.updateColumnValue(innerValue).then(function () {
            _this.$emit('input', innerValue);
        });
    }
});
