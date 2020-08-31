'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
var component_1 = require('../common/component');
var utils_1 = require('./utils');
function simpleTick(fn) {
  return setTimeout(fn, 30);
}
component_1.VantComponent({
  props: {
    useSlot: Boolean,
    millisecond: Boolean,
    time: {
      type: Number,
      observer: 'reset',
    },
    format: {
      type: String,
      value: 'HH:mm:ss',
    },
    autoStart: {
      type: Boolean,
      value: true,
    },
  },
  data: {
    timeData: utils_1.parseTimeData(0),
    formattedTime: '0',
  },
  destroyed: function () {
    clearTimeout(this.tid);
    this.tid = null;
  },
  methods: {
    // 开始
    start: function () {
      if (this.counting) {
        return;
      }
      this.counting = true;
      this.endTime = Date.now() + this.remain;
      this.tick();
    },
    // 暂停
    pause: function () {
      this.counting = false;
      clearTimeout(this.tid);
    },
    // 重置
    reset: function () {
      this.pause();
      this.remain = this.data.time;
      this.setRemain(this.remain);
      if (this.data.autoStart) {
        this.start();
      }
    },
    tick: function () {
      if (this.data.millisecond) {
        this.microTick();
      } else {
        this.macroTick();
      }
    },
    microTick: function () {
      var _this = this;
      this.tid = simpleTick(function () {
        _this.setRemain(_this.getRemain());
        if (_this.remain !== 0) {
          _this.microTick();
        }
      });
    },
    macroTick: function () {
      var _this = this;
      this.tid = simpleTick(function () {
        var remain = _this.getRemain();
        if (!utils_1.isSameSecond(remain, _this.remain) || remain === 0) {
          _this.setRemain(remain);
        }
        if (_this.remain !== 0) {
          _this.macroTick();
        }
      });
    },
    getRemain: function () {
      return Math.max(this.endTime - Date.now(), 0);
    },
    setRemain: function (remain) {
      this.remain = remain;
      var timeData = utils_1.parseTimeData(remain);
      if (this.data.useSlot) {
        this.$emit('change', timeData);
      }
      this.setData({
        formattedTime: utils_1.parseFormat(this.data.format, timeData),
      });
      if (remain === 0) {
        this.pause();
        this.$emit('finish');
      }
    },
  },
});
