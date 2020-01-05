const WXAPI = require('apifm-wxapi')

Component({
  options: {
    addGlobalClass: true,
  },
  /**
   * 组件的对外属性，是属性名到属性设置的映射表
   */
  properties: {
    activePos: String,    
  },

  /**
   * 组件的内部数据，和 properties 一同用于组件的模板渲染
   */
  data: {
    tabs: ['省', '市', '区/县', '街道/镇', '社区/村委会'],
    tabIndex: 0,
    selectRegion: [] // 已选择
  },
  // 组件数据字段监听器，用于监听 properties 和 data 的变化
  observers: {

  },
  lifetimes: {
    attached: function () {      
      this.provinces()
    },
    detached: function () {
      // 在组件实例被从页面节点树移除时执行
    },
  },
  /**
   * 组件的方法列表
   */
  methods: {
    async provinces (){
      const res = await WXAPI.province()
      if (res.code == 0) {
        this.setData({
          redionData: res.data
        })
      }
    },
    async _click(e){
      const index = e.currentTarget.dataset.index
      let redionData = this.data.redionData
      const _curEntity = redionData[index]
      redionData.forEach(ele => {
        ele.active = false
      })
      _curEntity.active = true
      this.data.selectRegion[this.data.tabIndex] = _curEntity
      let tabIndex = this.data.tabIndex
      const res = await WXAPI.nextRegion(_curEntity.id)
      if (res.code == 0) {
        tabIndex++
        redionData = res.data
      }
      this.setData({
        redionData: redionData,
        selectRegion: this.data.selectRegion,
        tabIndex
      })
      if (res.code != 0) {
        this.triggerEvent('selectAddress', this.data, {})
        this.close()
      }
    },
    async tabClick(e){
      const index = e.currentTarget.dataset.index
      if (index == this.data.tabIndex) {
        return
      }
      const selectRegion = this.data.selectRegion
      selectRegion.splice(index)
      let redionData = this.data.redionData
      if (index == 0) {
        const res = await await WXAPI.province()
        if (res.code == 0) {
          redionData = res.data
        }
      } else {
        const lastSelectEntity = selectRegion[selectRegion.length - 1]
        const res = await WXAPI.nextRegion(lastSelectEntity.id)
        if (res.code == 0) {
          redionData = res.data
        }
      }      
      this.setData({
        tabIndex: index,
        selectRegion,
        redionData
      })
    },
    close(){
      this.triggerEvent('closeAddress', {}, {})
    }
  }
})