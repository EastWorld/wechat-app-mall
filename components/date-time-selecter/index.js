const dayjs = require("dayjs")
const weekStr = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
Component({
  options: {
    addGlobalClass: true,
  },
  /**
   * 组件的对外属性，是属性名到属性设置的映射表
   */
  properties: {
    maxDays: Number,
    title: String,
    alarmText: String,
    show: Boolean,
  },

  /**
   * 组件的内部数据，和 properties 一同用于组件的模板渲染
   */
  data: {
    activeKey: 0,
    days: undefined, // 左侧的日期列表
    day: undefined, // 选中的日期 YYYY-MM-DD
    times: undefined, // 右侧选中的时间列表
    timeSelectIndex: 0, // 选中的索引
    timeSelected: undefined, // 用于自动滚到到这个位置
  },
  // 组件数据字段监听器，用于监听 properties 和 data 的变化
  observers: {
  },
  lifetimes: {
    attached() {
      const days = []
      for (let index = 0; index < this.data.maxDays; index++) {
        const d = dayjs().add(index, 'day')
        days.push({
          d,
          isToday: index == 0,
          day: d.format('YYYY-MM-DD'),
          display: d.format('MM月DD日') + ' ' + weekStr[d.day()]
        })
      }
      this.setData({
        days,
        day: days[0].day
      })
      this.initTimes()
    },
    detached() {
      // 在组件实例被从页面节点树移除时执行
    },
  },
  /**
   * 组件的方法列表
   */
  methods: {
    initTimes() {
      const dayItem = this.data.days[this.data.activeKey]
      const times = []
      let curHour = dayItem.isToday ? dayjs().hour() : 0 // 当前时间
      for (let index = 0; index < 12; index++) {
        let beginHour = index*2
        if (beginHour < curHour) {
          continue
        }
        let endHour = index*2 + 2
        if (beginHour < 10) {
          beginHour = '0' + beginHour
        }
        if (endHour < 10) {
          endHour = '0' + endHour
        }
        times.push(beginHour + ':00-' + endHour + ':00')
      }
      this.setData({
        timeSelectIndex: 0,
        times,
        timeSelected: times[0]
      })
    },
    dayClick(e) {
      const activeKey = e.currentTarget.dataset.idx
      const dayItem = this.data.days[activeKey]
      this.setData({
        activeKey,
        day: dayItem.day,
      })
      this.initTimes()
    },
    timeClick(e) {
      const idx = e.currentTarget.dataset.idx
      const timeSelected = this.data.times[idx]
      this.setData({
        timeSelectIndex: idx,
        timeSelected,
      })
    },
    closeSku() {
      this.triggerEvent('cancel')
    },
    submit() {
      this.triggerEvent('ok', this.data)
    },
  }
})