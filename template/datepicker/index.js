/**
 * 上滑
 * @param {object} e 事件对象
 * @returns {boolean} 布尔值
 */
export function isUpSlide(e) {
  const { startX, startY } = this.data.gesture;
  if (this.slideLock) {
    const t = e.touches[0];
    const deltaX = t.clientX - startX;
    const deltaY = t.clientY - startY;
    if (deltaY < -60 && deltaX < 20 && deltaX > -20) {
      this.slideLock = false;
      return true;
    } else {
      return false;
    }
  }
}
/**
 * 下滑
 * @param {object} e 事件对象
 * @returns {boolean} 布尔值
 */
export function isDownSlide(e) {
  const { startX, startY } = this.data.gesture;
  if (this.slideLock) {
    const t = e.touches[0];
    const deltaX = t.clientX - startX;
    const deltaY = t.clientY - startY;
    if (deltaY > 60 && deltaX < 20 && deltaX > -20) {
      this.slideLock = false;
      return true;
    } else {
      return false;
    }
  }
}
/**
 * 左滑
 * @param {object} e 事件对象
 * @returns {boolean} 布尔值
 */
export function isLeftSlide(e) {
  const { startX, startY } = this.data.gesture;
  if (this.slideLock) {
    const t = e.touches[0];
    const deltaX = t.clientX - startX;
    const deltaY = t.clientY - startY;
    if (deltaX < -60 && deltaY < 20 && deltaY > -20) {
      this.slideLock = false;
      return true;
    } else {
      return false;
    }
  }
}
/**
 * 右滑
 * @param {object} e 事件对象
 * @returns {boolean} 布尔值
 */
export function isRightSlide(e) {
  const { startX, startY } = this.data.gesture;
  if (this.slideLock) {
    const t = e.touches[0];
    const deltaX = t.clientX - startX;
    const deltaY = t.clientY - startY;

    if (deltaX > 60 && deltaY < 20 && deltaY > -20) {
      this.slideLock = false;
      return true;
    } else {
      return false;
    }
  }
}

const conf = {
  /**
   * 计算指定月份共多少天
   * @param {number} year 年份
   * @param {number} month  月份
   */
  getThisMonthDays(year, month) {
    return new Date(year, month, 0).getDate();
  },
  /**
   * 计算指定月份第一天星期几
   * @param {number} year 年份
   * @param {number} month  月份
   */
  getFirstDayOfWeek(year, month) {
    return new Date(Date.UTC(year, month - 1, 1)).getDay();
  },
  /**
   * 计算当前月份前后两月应占的格子
   * @param {number} year 年份
   * @param {number} month  月份
   */
  calculateEmptyGrids(year, month) {
    conf.calculatePrevMonthGrids.call(this, year, month);
    conf.calculateNextMonthGrids.call(this, year, month);
  },
  /**
   * 计算上月应占的格子
   * @param {number} year 年份
   * @param {number} month  月份
   */
  calculatePrevMonthGrids(year, month) {
    const prevMonthDays = conf.getThisMonthDays(year, month - 1);
    const firstDayOfWeek = conf.getFirstDayOfWeek(year, month);
    let empytGrids = [];
    if (firstDayOfWeek > 0) {
      const len = prevMonthDays - firstDayOfWeek;
      for (let i = prevMonthDays; i > len; i--) {
        empytGrids.push(i);
      }
      this.setData({
        'datepicker.empytGrids': empytGrids.reverse()
      });
    } else {
      this.setData({
        'datepicker.empytGrids': null
      });
    }
  },
  /**
   * 计算下月应占的格子
   * @param {number} year 年份
   * @param {number} month  月份
   */
  calculateNextMonthGrids(year, month) {
    const thisMonthDays = conf.getThisMonthDays(year, month);
    const lastDayWeek = new Date(`${year}-${month}-${thisMonthDays}`).getDay();
    let lastEmptyGrids = [];
    if (+lastDayWeek !== 6) {
      const len = 7 - (lastDayWeek + 1);
      for (let i = 1; i <= len; i++) {
        lastEmptyGrids.push(i);
      }
      this.setData({
        'datepicker.lastEmptyGrids': lastEmptyGrids
      });
    } else {
      this.setData({
        'datepicker.lastEmptyGrids': null
      });
    }
  },
  /**
   * 设置日历面板数据
   * @param {number} year 年份
   * @param {number} month  月份
   */
  calculateDays(year, month, curDate) {
    const { todayTimestamp } = this.data.datepicker;
    let days = [];
    let day;
    let selectMonth;
    let selectYear;
    const thisMonthDays = conf.getThisMonthDays(year, month);
    const selectedDay = this.data.datepicker.selectedDay;
    if (selectedDay && selectedDay.length) {
      day = selectedDay[0].day;
      selectMonth = selectedDay[0].month;
      selectYear = selectedDay[0].year;
    }
    for (let i = 1; i <= thisMonthDays; i++) {
      days.push({
        day: i,
        choosed: curDate
          ? i === curDate
          : year === selectYear && month === selectMonth && i === day,
        year,
        month
      });
    }
    days.map(item => {
      const timestamp = new Date(
        `${item.year}-${item.month}-${item.day}`
      ).getTime();
      if (this.config.disablePastDay && timestamp - todayTimestamp < 0) {
        item.disable = true;
      }
    });
    const tmp = {
      'datepicker.days': days
    };
    if (curDate) {
      tmp['datepicker.selectedDay'] = [
        {
          day: curDate,
          choosed: true,
          year,
          month
        }
      ];
    }
    this.setData(tmp);
  },
  /**
   * 跳转至今天
   */
  jumpToToday() {
    const date = new Date();
    const curYear = date.getFullYear();
    const curMonth = date.getMonth() + 1;
    const curDate = date.getDate();
    conf.renderCalendar.call(this, curYear, curMonth, curDate);
  },
  /**
   * 渲染日历
   * @param {number} year
   * @param {number} month
   * @param {number} day
   */
  renderCalendar(year, month, day) {
    const timestamp = new Date(`${year}-${month}-${day}`).getTime();
    this.setData({
      'datepicker.curYear': year,
      'datepicker.curMonth': month,
      'datepicker.todayTimestamp': timestamp
    });
    conf.calculateEmptyGrids.call(this, year, month);
    conf.calculateDays.call(this, year, month, day);
  },
  /**
   * 初始化日历选择器
   * @param {number} curYear
   * @param {number} curMonth
   * @param {number} curDate
   */
  init(curYear, curMonth, curDate) {
    const self = _getCurrentPage();
    const weeksCh = ['日', '一', '二', '三', '四', '五', '六'];
    self.setData({
      'datepicker.weeksCh': weeksCh,
      'datepicker.showDatePicker': true
    });
    if (!curYear && !curMonth && !curDate) return conf.jumpToToday.call(self);
    conf.renderCalendar.call(self, curYear, curMonth, curDate);
  },
  /**
   * 点击输入框调起日历选择器
   * @param {object} e  事件对象
   */
  showDatepicker(e) {
    const value = e.detail.value;
    if (value && typeof value === 'string') {
      const tmp = value.split('-');
      conf.init(+tmp[0], +tmp[1], +tmp[2]);
    } else {
      conf.init();
    }
  },
  /**
   * 当输入日期时
   * @param {object} e  事件对象
   */
  onInputDate(e) {
    const self = _getCurrentPage();
    this.inputTimer && clearTimeout(this.inputTimer);
    this.inputTimer = setTimeout(() => {
      const v = e.detail.value;
      const _v = (v && v.split('-')) || [];
      const RegExpYear = /^\d{4}$/;
      const RegExpMonth = /^(([0]?[1-9])|([1][0-2]))$/;
      const RegExpDay = /^(([0]?[1-9])|([1-2][0-9])|(3[0-1]))$/;
      if (_v && _v.length === 3) {
        if (
          RegExpYear.test(_v[0]) &&
          RegExpMonth.test(_v[1]) &&
          RegExpDay.test(_v[2])
        ) {
          conf.renderCalendar.call(self, +_v[0], +_v[1], +_v[2]);
        }
      }
    }, 500);
  },
  /**
   * 计算当前日历面板月份的前一月数据
   */
  choosePrevMonth() {
    const { curYear, curMonth } = this.data.datepicker;
    let newMonth = curMonth - 1;
    let newYear = curYear;
    if (newMonth < 1) {
      newYear = curYear - 1;
      newMonth = 12;
    }

    conf.calculateDays.call(this, newYear, newMonth);
    conf.calculateEmptyGrids.call(this, newYear, newMonth);

    this.setData({
      'datepicker.curYear': newYear,
      'datepicker.curMonth': newMonth
    });
  },
  /**
   * 计算当前日历面板月份的后一月数据
   */
  chooseNextMonth() {
    const { curYear, curMonth } = this.data.datepicker;
    let newMonth = curMonth + 1;
    let newYear = curYear;
    if (newMonth > 12) {
      newYear = curYear + 1;
      newMonth = 1;
    }
    conf.calculateDays.call(this, newYear, newMonth);
    conf.calculateEmptyGrids.call(this, newYear, newMonth);

    this.setData({
      'datepicker.curYear': newYear,
      'datepicker.curMonth': newMonth
    });
  },
  /**
   * 切换月份
   * @param {!object} e 事件对象
   */
  handleCalendar(e) {
    const handle = e.currentTarget.dataset.handle;
    if (handle === 'prev') {
      conf.choosePrevMonth.call(this);
    } else {
      conf.chooseNextMonth.call(this);
    }
  },
  /**
   * 选择具体日期
   * @param {!object} e  事件对象
   */
  tapDayItem(e) {
    const { idx, disable } = e.currentTarget.dataset;
    if (disable) return;
    const config = this.config;
    const { afterTapDay, onTapDay } = config;
    const { curYear, curMonth, days } = this.data.datepicker;
    const key = `datepicker.days[${idx}].choosed`;
    const selectedValue = `${curYear}-${curMonth}-${days[idx].day}`;
    if (this.config.type === 'timearea') {
      if (onTapDay && typeof onTapDay === 'function') {
        config.onTapDay(this.data.datepicker.days[idx], e);
        return;
      }
      this.setData({
        [key]: !days[idx].choosed
      });
    } else if (this.config.type === 'normal' && !days[idx].choosed) {
      const prev = days.filter(item => item.choosed)[0];
      const prevKey = prev && `datepicker.days[${prev.day - 1}].choosed`;
      if (onTapDay && typeof onTapDay === 'function') {
        config.onTapDay(days[idx], e);
        return;
      }
      const data = {
        [key]: true,
        'datepicker.selectedValue': selectedValue,
        'datepicker.selectedDay': [days[idx]]
      };
      if (prevKey) {
        data[prevKey] = false;
      }
      this.setData(data);
    }
    if (afterTapDay && typeof afterTapDay === 'function') {
      config.afterTapDay(days[idx]);
    }
  },
  /**
   * 关闭日历选择器
   */
  closeDatePicker() {
    this.setData({
      'datepicker.showDatePicker': false
    });
  },
  datepickerTouchstart(e) {
    const t = e.touches[0];
    const startX = t.clientX;
    const startY = t.clientY;
    this.slideLock = true; // 滑动事件加锁
    this.setData({
      'gesture.startX': startX,
      'gesture.startY': startY
    });
  },
  datepickerTouchmove(e) {
    if (isLeftSlide.call(this, e)) {
      conf.chooseNextMonth.call(this);
    }
    if (isRightSlide.call(this, e)) {
      conf.choosePrevMonth.call(this);
    }
  }
};

function _getCurrentPage() {
  const pages = getCurrentPages();
  const last = pages.length - 1;
  return pages[last];
}

/**
 * 跳转至今天
 */
export const jumpToToday = () => {
  const self = _getCurrentPage();
  conf.jumpToToday.call(self);
};

export default (config = {}) => {
  const self = _getCurrentPage();
  if (!config.type) config.type = 'normal';
  self.config = config;
  self.setData({
    datepicker: {
      showDatePicker: false,
      showInput: config.showInput === true || config.showInput === undefined,
      placeholder: config.placeholder || '请选择日期'
    }
  });
  self.datepickerTouchstart = conf.datepickerTouchstart.bind(self);
  self.datepickerTouchmove = conf.datepickerTouchmove.bind(self);
  self.showDatepicker = conf.showDatepicker.bind(self);
  self.onInputDate = conf.onInputDate.bind(self);
  self.closeDatePicker = conf.closeDatePicker.bind(self);
  self.tapDayItem = conf.tapDayItem.bind(self);
  self.handleCalendar = conf.handleCalendar.bind(self);
};

/**
 * 获取已选择的日期
 */
export const getSelectedDay = () => {
  const self = _getCurrentPage();
  return self.data.datepicker.selectedDay;
};
