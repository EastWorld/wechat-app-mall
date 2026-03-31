Component({
  options: {
    addGlobalClass: true,
  },
  
  properties: {
    show: {
      type: Boolean,
      value: false
    },
    levelName: {
      type: String,
      value: ''
    },
    benefits: {
      type: Array,
      value: []
    }
  },

  data: {
    
  },

  methods: {
    handleMaskClick() {
      // 点击遮罩层不关闭，必须点击确定按钮
    },

    stopPropagation() {
      // 阻止事件冒泡
    },

    handleConfirm() {
      this.triggerEvent('confirm')
    }
  }
})
