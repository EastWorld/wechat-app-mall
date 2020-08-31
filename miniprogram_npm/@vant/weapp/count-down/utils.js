'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.isSameSecond = exports.parseFormat = exports.parseTimeData = void 0;
function padZero(num, targetLength) {
  if (targetLength === void 0) {
    targetLength = 2;
  }
  var str = num + '';
  while (str.length < targetLength) {
    str = '0' + str;
  }
  return str;
}
var SECOND = 1000;
var MINUTE = 60 * SECOND;
var HOUR = 60 * MINUTE;
var DAY = 24 * HOUR;
function parseTimeData(time) {
  var days = Math.floor(time / DAY);
  var hours = Math.floor((time % DAY) / HOUR);
  var minutes = Math.floor((time % HOUR) / MINUTE);
  var seconds = Math.floor((time % MINUTE) / SECOND);
  var milliseconds = Math.floor(time % SECOND);
  return {
    days: days,
    hours: hours,
    minutes: minutes,
    seconds: seconds,
    milliseconds: milliseconds,
  };
}
exports.parseTimeData = parseTimeData;
function parseFormat(format, timeData) {
  var days = timeData.days;
  var hours = timeData.hours,
    minutes = timeData.minutes,
    seconds = timeData.seconds,
    milliseconds = timeData.milliseconds;
  if (format.indexOf('DD') === -1) {
    hours += days * 24;
  } else {
    format = format.replace('DD', padZero(days));
  }
  if (format.indexOf('HH') === -1) {
    minutes += hours * 60;
  } else {
    format = format.replace('HH', padZero(hours));
  }
  if (format.indexOf('mm') === -1) {
    seconds += minutes * 60;
  } else {
    format = format.replace('mm', padZero(minutes));
  }
  if (format.indexOf('ss') === -1) {
    milliseconds += seconds * 1000;
  } else {
    format = format.replace('ss', padZero(seconds));
  }
  return format.replace('SSS', padZero(milliseconds, 3));
}
exports.parseFormat = parseFormat;
function isSameSecond(time1, time2) {
  return Math.floor(time1 / 1000) === Math.floor(time2 / 1000);
}
exports.isSameSecond = isSameSecond;
