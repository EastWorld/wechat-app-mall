const WXAPI = require('apifm-wxapi')

// websocket 第一步
let socketOpen = false
let socketMsgQueue = []

Page({
  /**
   * 页面的初始数据
   */
  data: {
    viewNumber: 0, // 观看人数
    likeNumber: 0, // 点赞数量
    follow: true,
    inputVal: '',
    userId: '', // 用户id
    groupId: null, // 群id
    playUrl: '', // 拉流地址
    barrageList: [], // 用户聊天记录
    showInput: false, // 是否显示输入框
    focus: false,
    goodsList: [],
    pageIndex: 1,
    pageSize: 10,
    hasMore: true,
    showGoodsInfo: false,
    firstTap: false,
    showEmpty: false, // 是否展示缺省提示
    nickname: '', // 当前用户昵称
    scrollTop: '', // 设置cover-view 设置顶部滚动的偏移量
    online: '',
    showTips: false, // 是否显示某个人加入进入直播间
    online_people: '', // 观看人数 
    anchor_cover: '', // 主播封面
    roomId:undefined,
    intoRoomStatus:true
  },

  // 通知主播已经下线
  showWarningOffAndExit() {
    wx.showModal({
      title: '提示',
      content: '主播已经离开了~，下次再见，拜拜!',
      showCancel: false,
      confirmText: '我知道了',
      confirmColor: '#FE6889',
      success: res => {
        if (res.confirm) {
          wx.navigateBack()
        }
      }
    })
  },
  // 通知被主播拉黑下线
  lahei() {
    wx.showToast({
      title: '系统异常，强制退出直播间',
      icon: 'none',
      duration: 2000
    })
    setTimeout(function(){
      wx.switchTab({
        url : "/pages/index/index"
      })
    },3000);
    
  },
  // 某人加入房间
  showTips(avatarurl, msg) {
    this.setData({
      showTips: true,
      showTipsAvatarUrl: avatarurl,
      showTipsMsg: msg
    })
    if (!this.data.focus) {
      this.setScrollTop();
    }
    setTimeout(() => {
      this.setData({
        showTips: false
      })
    }, 3000);
  },
  setScrollTop() {
    var query = wx.createSelectorQuery();
    wx.createSelectorQuery().in(this).select('.barrage').boundingClientRect(res => {
      console.log(res)
      this.setData({
        chatbottom: res.bottom,
      })
    }).exec()

    query.in(this).select('.item-outer').boundingClientRect(res => {
      if (res.bottom > this.data.chatbottom) {
        let temp = Math.ceil(parseInt(res.bottom) - parseInt(e.data.chatbottom))
        this.setData({
          scrollTop: temp // 如此保证scrollTop的值 让滚动条一直滚动到最后 9999 开发工具可以设置为辞职 苹果真机不行
        })
      }
    }).exec()
  },

  onLoad: function(options) {
    // options.id = 15
    this.data.id = options.id
    // 读取自定义头高度
    const systemInfo = wx.getSystemInfoSync()
    const custom = wx.getMenuButtonBoundingClientRect()
    this.setData({
      systemInfo,
      customBarHeight: custom.bottom + custom.top - systemInfo.statusBarHeight
    })
    //获取直播信息  主播信息
    this.getLiveInfo()
    this.initWebSocket()
    // 设置屏幕常亮  
    wx.setKeepScreenOn({ keepScreenOn: true })

    let query = wx.createSelectorQuery()
    query.select('.barrage').boundingClientRect(function(rect) {
      console.log(rect)
    }).exec();

  },
  // 主推商品详情
  async toDetail(e) {
    const id = e.currentTarget.dataset.id
    const res = await WXAPI.goodsDetail(id, wx.getStorageSync('token'))
    if (res.code != 0) {
      wx.showToast({
        title: res.msg,
        icon: 'none'
      })
      return
    }
    if (res.data.basicInfo.supplyType == 'cps_jd') {
      wx.navigateTo({
        url: `/packageCps/pages/goods-details/cps-jd?id=${id}`,
      })
    } else if (res.data.basicInfo.supplyType == 'vop_jd') {
      wx.navigateTo({
        url: `/pages/goods-details/vop?id=${res.data.basicInfo.yyId}&goodsId=${res.data.basicInfo.id}`,
      })
    } else if (res.data.basicInfo.supplyType == 'cps_pdd') {
      wx.navigateTo({
        url: `/packageCps/pages/goods-details/cps-pdd?id=${id}`,
      })
    } else if (res.data.basicInfo.supplyType == 'cps_taobao') {
      wx.navigateTo({
        url: `/packageCps/pages/goods-details/cps-taobao?id=${id}`,
      })
    } else {
      wx.navigateTo({
        url: `/pages/goods-details/index?id=${id}`,
      })
    }
  },
  async handleLikeClick() {
    await WXAPI.likeLiveRoom(wx.getStorageSync('token'), this.data.id)
    this.sendSocketMessage('act:like')
  },


  preventDefault(e) {
    return;
  },

  getUserInfo() {
    let token = wx.getStorageSync('token')
    return
    api.get({
      url: '/wxsmall/User/getUserInfo',
      data: {
        token,
      },
      success: res => {
        console.log(res)
        let {
          nickname,
          avatar
        } = res.data
        this.setData({
          nickname,
          avatar
        })
      }
    })
  },

  hideGoods() {
    // // 防止连续点击--开始
    // if (this.data.payButtonClicked) {
    //   wx.showToast({
    //     title: '休息一下~',
    //     icon: 'none'
    //   })
    //   return
    // }
    // this.data.payButtonClicked = true
    // setTimeout(() => {
    //   this.data.payButtonClicked = false
    // }, 1500)  // 可自行修改时间间隔（目前是3秒内只能点击一次支付按钮）
    // // 防止连续点击--结束
    this.setData({
      showGoodsInfo: false,
      showInput: false,
      focus:false
    })
  },


  showGoods() {
    let data = this.data
    if (!data.firstTap) {
      this.getGoodsList()
      this.setData({
        firstTap: true
      })
    }
    this.setData({ showGoodsInfo: true, showEmpty:true, })
  },

  async getGoodsList() {
    wx.showLoading({
      title: '加载中',
    })
    // https://www.yuque.com/apifm/nu0f75/wg5t98
    const res = await WXAPI.goodsv2()
  //  console.log(res.data);
    wx.hideLoading()
    if (res.code == 0) {
      if(res.data.length==0){
        this.setData({
          showEmpty: true
        })
      }else{
        this.setData({
          goodsList: res.data.result,
          showEmpty: false
        })
      }
     
    }
   
  },
  async getLiveInfo() {
    const res = await WXAPI.liveRoomsInfo(wx.getStorageSync('token'), this.data.id)
    if (res.code != 0) {
      wx.showToast({
        title: res.msg,
        icon: 'none'
      })
      wx.navigateBack()
      return
    }
    let mainlyGoods = null
    if (res.data.mainlyGoodsId) {
      mainlyGoods = res.data.goodsList.find(ele => {
        return ele.id == res.data.mainlyGoodsId
      })
    }
    this.setData({
      liveRoomsInfo: res.data,
      viewNumber: res.data.roomInfo.viewNumber,
      likeNumber: res.data.roomInfo.likeNumber,
      mainlyGoods,
      follow: true
    })
    // TODO follow true / false
  },


  /**
   * 发送弹幕问题
   */
  onComment() {
    const inputVal = this.data.inputVal
    if (!inputVal) {
      wx.showToast({
        title: '内容不能为空',
        icon: 'none'
      })
      return;
    }
    this.sendSocketMessage(inputVal)
    this.setData({
      inputVal: '',
      showInput: false
    })
  },
  bindInput(e) {
    this.setData({
      inputVal: e.detail.value
    })
  },

  handleInteractionTap() {
      // 防止连续点击--开始
      if (this.data.payButtonClicked) {
        wx.showToast({
          title: '慢点~',
          icon: 'none'
        })
        return
      }
      this.data.payButtonClicked = true
      setTimeout(() => {
        this.data.payButtonClicked = false
      }, 1500)  // 可自行修改时间间隔（目前是3秒内只能点击一次按钮）
      // 防止连续点击--结束
    let data = this.data
    let temp;
    if (!data.showInput) {
      temp = data.fullScreenHeight - 50
    } else {
      temp = app.globalData.screenH
    }
    this.setData({
      //showInput: !this.data.showInput,
       fullScreenHeight: temp,
      showInput: true,
      focus: true
    })
  },

  followTap() { 
    var that = this
    wx.request({
      url:  CONFIG.HTTP_REQUEST_URL+"customerConcern", 
      data: {
        roomId:that.data.info.id,
        userOpenId:wx.getStorageSync('openid'),
        status:1
      },
      method: "GET",
      header: {
        'Content-Type': 'application/json;charset=utf-8 '
      },
      success: function (res2) {
        console.log("followTap",res2);
        if(res2.data.code==500){
          wx.showToast({
            title: res2.data.message,
            duration: 1500,
            icon: 'none',
            mask: true,
          })
          return
        }
        wx.showToast({
          title: '已关注',
          icon: 'none'
        })
        that.setData({
          follow: true
        })
      },
    })
  },

  onReady(res) {
    this.ctx = wx.createLivePlayerContext('player')
  },
  statechange(e) {
    console.log('live-player code:', e.detail.code)
  },
  error(e) {
    console.error('live-player error:', e.detail.errMsg)
  },
  onShow() {//进入页面链接
    
  },
  backTap() { 
    wx.navigateBack()
  },
  /**
  * 用户点击右上角分享
  */
  onShareAppMessage: function () {
    return {
      title: '快来我的直播间看看吧~',
      imageUrl: this.data.liveRoomsInfo.roomInfo.coverImage,
      path: `/packageStreamMedia/pages/live-client/client?id=${this.data.id}`
    }
  },
  // webscoket 第二步， 增加下面方法
  connectSocket() {
    wx.connectSocket({
      url: 'wss://api.it120.cc/websocket/liveRoom/' + this.data.id + '/' + wx.getStorageSync('token')
    })
  },
  initWebSocket() {
    this.connectSocket()
    wx.onSocketOpen(res => {
      console.log(res);
      socketOpen = true
      for (let i = 0; i < socketMsgQueue.length; i++){
        sendSocketMessage(socketMsgQueue[i])
      }
      socketMsgQueue = []
    })
    wx.onSocketClose(res => {
      console.log(res);
      // 关闭，重连
      socketOpen = false
      if (res.code == 1004 && res.reason == 'kickOut') {
        wx.reLaunch({
          url: '/pages/index/index'
        })
        return
      }
      wx.showToast({
        title: res.code + ':' + res.reason,
        icon: 'none'
      })
      setTimeout(() => {
        this.connectSocket()
      }, 3000);
    })
    wx.onSocketMessage(res => {
      // 接收服务器推送的消息
      if (res.code != 0) {
        wx.showToast({
          title: resJson.msg,
          icon: 'none'
        })
        return
      }
      const resJson = JSON.parse(res.data)
      this.processSocketMessage(resJson.data)
    })
  },
  sendSocketMessage(msg) {
    // 向 websocket 发送消息
    if (socketOpen) {
      wx.sendSocketMessage({
        data: msg
      })
    } else {
      socketMsgQueue.push(msg)
    }  
  },
  processSocketMessage(res) {
    // 接收到服务器推送到消息
    console.log(res)
    if (res.act == 'onlineNumber') {
      this.setData({
        onlineNumber: res.data
      })
    }
    if (res.act == 'userComing') {
      this.setData({
        viewNumber: this.data.viewNumber + 1
      })
      this.showTips(res.avatarUrl, `${res.nick}进入直播间`)
    }
    if (res.act == 'msg') {
      if (res.msg.indexOf('act:mainlyGoods:') == 0) {
        const goodsId = res.msg.replace('act:mainlyGoods:', '')
        console.log(goodsId);
        const mainlyGoods = this.data.liveRoomsInfo.goodsList.find(ele => {
          return ele.id == goodsId
        })
        this.setData({
          mainlyGoods
        })
        return
      }
      if (res.msg == 'act:like') {
        this.setData({
          likeNumber: this.data.likeNumber + 1
        })
        return
      }
      const barrageList = this.data.barrageList
      barrageList.push({
        nick: res.nick,
        avatarUrl: res.avatarUrl,
        msg: res.msg,
        color: this.getRandomFontColor()
      })
      this.setData({
        barrageList: barrageList.length > 100 ? barrageList.slice(50) : barrageList
      })
      if (this.data.focus) {
        return
      }
      this.setScrollTop();
    }
  },
  getRandomFontColor() {
    // 随机颜色
		let red = Math.floor(Math.random() * 266);
		let green = Math.floor(Math.random() * 266);
		let blue = Math.floor(Math.random() * 266);
		return 'rgb(' + red + ',' + green + ' , ' + blue + ')'
	},
})