const App = getApp();

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
    isClose: true
  },
  // 组件数据字段监听器，用于监听 properties 和 data 的变化
  observers: {

  },
  lifetimes: {
    attached: function () {
      this.setData({
        
      })
    },
    detached: function () {
      // 在组件实例被从页面节点树移除时执行
    },
  },
  /**
   * 组件的方法列表
   */
  methods: {
    //回退
    open(){
      this.setData({
        isClose: false
      })
    },
    close(){
      this.setData({
        isClose: true
      })
    },
    navBack: function () {
      wx.navigateBack({
        delta: 1
      })
    },
    //回主页
    toIndex: function () {
      wx.navigateTo({
        url: '/pages/admin/home/index/index'
      })
    },
  }
})