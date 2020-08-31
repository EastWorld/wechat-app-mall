'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
var component_1 = require('../../../common/component');
var utils_1 = require('../../utils');
component_1.VantComponent({
  props: {
    date: {
      type: null,
      observer: 'setDays',
    },
    type: {
      type: String,
      observer: 'setDays',
    },
    color: String,
    minDate: {
      type: null,
      observer: 'setDays',
    },
    maxDate: {
      type: null,
      observer: 'setDays',
    },
    showMark: Boolean,
    rowHeight: [Number, String],
    formatter: {
      type: null,
      observer: 'setDays',
    },
    currentDate: {
      type: [null, Array],
      observer: 'setDays',
    },
    allowSameDay: Boolean,
    showSubtitle: Boolean,
    showMonthTitle: Boolean,
  },
  data: {
    visible: true,
    days: [],
  },
  methods: {
    onClick: function (event) {
      var index = event.currentTarget.dataset.index;
      var item = this.data.days[index];
      if (item.type !== 'disabled') {
        this.$emit('click', item);
      }
    },
    setDays: function () {
      var days = [];
      var startDate = new Date(this.data.date);
      var year = startDate.getFullYear();
      var month = startDate.getMonth();
      var totalDay = utils_1.getMonthEndDay(
        startDate.getFullYear(),
        startDate.getMonth() + 1
      );
      for (var day = 1; day <= totalDay; day++) {
        var date = new Date(year, month, day);
        var type = this.getDayType(date);
        var config = {
          date: date,
          type: type,
          text: day,
          bottomInfo: this.getBottomInfo(type),
        };
        if (this.data.formatter) {
          config = this.data.formatter(config);
        }
        days.push(config);
      }
      this.setData({ days: days });
    },
    getMultipleDayType: function (day) {
      var currentDate = this.data.currentDate;
      if (!Array.isArray(currentDate)) {
        return '';
      }
      var isSelected = function (date) {
        return currentDate.some(function (item) {
          return utils_1.compareDay(item, date) === 0;
        });
      };
      if (isSelected(day)) {
        var prevDay = utils_1.getPrevDay(day);
        var nextDay = utils_1.getNextDay(day);
        var prevSelected = isSelected(prevDay);
        var nextSelected = isSelected(nextDay);
        if (prevSelected && nextSelected) {
          return 'multiple-middle';
        }
        if (prevSelected) {
          return 'end';
        }
        return nextSelected ? 'start' : 'multiple-selected';
      }
      return '';
    },
    getRangeDayType: function (day) {
      var _a = this.data,
        currentDate = _a.currentDate,
        allowSameDay = _a.allowSameDay;
      if (!Array.isArray(currentDate)) {
        return;
      }
      var startDay = currentDate[0],
        endDay = currentDate[1];
      if (!startDay) {
        return;
      }
      var compareToStart = utils_1.compareDay(day, startDay);
      if (!endDay) {
        return compareToStart === 0 ? 'start' : '';
      }
      var compareToEnd = utils_1.compareDay(day, endDay);
      if (compareToStart === 0 && compareToEnd === 0 && allowSameDay) {
        return 'start-end';
      }
      if (compareToStart === 0) {
        return 'start';
      }
      if (compareToEnd === 0) {
        return 'end';
      }
      if (compareToStart > 0 && compareToEnd < 0) {
        return 'middle';
      }
    },
    getDayType: function (day) {
      var _a = this.data,
        type = _a.type,
        minDate = _a.minDate,
        maxDate = _a.maxDate,
        currentDate = _a.currentDate;
      if (
        utils_1.compareDay(day, minDate) < 0 ||
        utils_1.compareDay(day, maxDate) > 0
      ) {
        return 'disabled';
      }
      if (type === 'single') {
        return utils_1.compareDay(day, currentDate) === 0 ? 'selected' : '';
      }
      if (type === 'multiple') {
        return this.getMultipleDayType(day);
      }
      /* istanbul ignore else */
      if (type === 'range') {
        return this.getRangeDayType(day);
      }
    },
    getBottomInfo: function (type) {
      if (this.data.type === 'range') {
        if (type === 'start') {
          return '开始';
        }
        if (type === 'end') {
          return '结束';
        }
        if (type === 'start-end') {
          return '开始/结束';
        }
      }
    },
  },
});
