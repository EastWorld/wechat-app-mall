const app = getApp()
const CONFIG = require('../../../config.js')
const WXAPI = require('apifm-wxapi')

// websocket 第一步
let socketOpen = false
let socketMsgQueue = []

let that;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    beauty: 0, // 美颜，取值范围 0-9 ，0 表示关闭
    onlineNumber: 1, // 在线人数
    barrageList: [], // 用户聊天记录
    focus: false,
    firstTap: false,
    goodsList: [],
    pageIndex: 1,
    pageSize: 10,
    hasMore: true,
    showGoodsInfo: false,
    showEmpty: false, // 是否展示缺省提示
    ids: '', // 已经选中的商品id
    online_people: '', // 观看人数
    pusherUrl: "",
    roomId: undefined,
    showSetInfo: false,
  },
  // 某人加入房间、离开房间
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
    var query = wx.createSelectorQuery(),
      e = that;
    wx.createSelectorQuery().in(e).select('.barrage').boundingClientRect(function (res) {
      console.log(res)
      e.setData({
        chatbottom: res.bottom,
      })
    }).exec()

    query.in(e).select('.item-outer').boundingClientRect(function (res) {
      if (res.bottom > e.data.chatbottom) {
        let temp = Math.ceil(parseInt(res.bottom) - parseInt(e.data.chatbottom))
        e.setData({
          scrollTop: temp // 如此保证scrollTop的值 让滚动条一直滚动到最后 9999 开发工具可以设置为辞职 苹果真机不行
        })
      }
    }).exec()
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // options.id = 13
    this.data.id = options.id
    // 读取自定义头高度
    const systemInfo = wx.getSystemInfoSync()
    const custom = wx.getMenuButtonBoundingClientRect()
    this.setData({
      systemInfo,
      customBarHeight: custom.bottom + custom.top - systemInfo.statusBarHeight
    })
    this.getUserInfo()
    this.myLiveRoomsInfo()
    this.initWebSocket()
    // 设置屏幕常亮 兼容ios
    wx.setKeepScreenOn({
      keepScreenOn: true
    })
    // 设置屏幕亮度 0-1范围 设置了 用户自己去设置调节屏幕的亮度
    // wx.setScreenBrightness({ value: .6 }) 

    this.ctx = wx.createLivePusherContext('pusher')

    let query = wx.createSelectorQuery()
    query.select('.barrage').boundingClientRect(function (rect) {
      // console.log(rect)
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
    } else if (res.data.basicInfo.supplyType == 'cps_pdd') {
      wx.navigateTo({
        url: `/packageCps/pages/goods-details/cps-pdd?id=${id}`,
      })
    } else if (res.data.basicInfo.supplyType == 'cps_taobao') {
      wx.navigateTo({
        url: `/packageCps/pages/goods-details/cps-taobao?id=${id}`,
      })
    } else if (res.data.basicInfo.supplyType == 'vop_jd') {
      wx.navigateTo({
        url: `/pages/goods-details/vop?id=${res.data.basicInfo.yyId}&goodsId=${res.data.basicInfo.id}`,
      })
    } else {
      wx.navigateTo({
        url: `/pages/goods-details/index?id=${id}`,
      })
    }
  },

  preventDefault() {
    return;
  },

  bindInput(e) {
    this.setData({
      inputVal: e.detail.value
    })
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

  handleInteractionTap() {
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

  navCart() {
    let url = `/pages/cart/cart`
    wx.navigateTo({
      url
    })
  },
  // 设置为主推商品
  async navPurchase(e) {
    const mainlyGoods = this.data.liveRoomsInfo.goodsList[e.currentTarget.dataset.idx]
    this.sendSocketMessage('act:mainlyGoods:' + mainlyGoods.id)
    const res = await WXAPI.liveRoomGoodsMainly({
      token: wx.getStorageSync('token'),
      roomId: this.data.id,
      goodsId: mainlyGoods.id
    })
  },

  hideGoods() {
    this.setData({
      showGoodsInfo: false,
      showInput: false
    })
  },
  hidePeoples() { //隐藏人员信息
    console.log(1);
    this.hideGoods();
    this.setData({
      showPeopleInfo: false
    })
  },
  hideSet() {
    this.setData({
      showSetInfo: false
    })
  },
  async showPeoples() { //显示直播间人员
    wx.showLoading({
      title: '',
    })
    const res = await WXAPI.liveRoomOnlineUsers(wx.getStorageSync('token'), this.data.id)
    wx.hideLoading()
    if (res.code != 0) {
      wx.showToast({
        title: res.msg,
        icon: 'none'
      })
      this.setData({
        showPeopleInfo: false,
        peoplelist: null
      })
    } else {
      this.setData({
        showPeopleInfo: true,
        peoplelist: res.data
      })
    }
  },
  lahei(e) { //拉黑用户 
    let uid = e.currentTarget.dataset.uid
    const that = this
    wx.showModal({
      title: '确认拉黑',
      content: '拉黑会强制该用户退出直播间',
      success(res) {
        if (res.confirm) {
          //console.log('用户点击确定')
          wx.showLoading({
            title: '加载中',
          })
          WXAPI.liveRoomKickOutUser(wx.getStorageSync('token'), that.data.id, uid).then(res => {
            that.showPeoples();
          })
        } else if (res.cancel) {
          //console.log('用户点击取消')
        }
      }
    })
  },
  showGoods() {
    let data = this.data
    if (!data.firstTap) {
      this.setData({
        firstTap: true
      })
    }
    this.setData({
      showGoodsInfo: true,
      showEmpty: true,
    })
  },
  onReady(res) {
    this.ctx = wx.createLivePusherContext('pusher')
  },

  // 旋转相机
  rotateTap() {
    this.ctx.switchCamera({
      success: res => {
        console.log('switchCamera success')
      },
      fail: res => {
        console.log('switchCamera fail')
      }
    })
  },

  backTap() {
    this.ctx.pause()
    wx.navigateBack()
  },
  exit() {
    wx.showModal({
      title: '提示',
      content: '确定结束本场直播吗？',
      success: res => {
        if (res.confirm) {
          this.ctx.stop({
            success: res => {
              console.log('stop success')
            },
            fail: res => {
              console.log('stop fail')
            }
          })
          wx.navigateBack({
            delta: 2
          })
          app.closeSocket()
        }
      }
    })
  },
  onUnload() {
    wx.onSocketClose(res => {
      console.log('WebSocket 已关闭！')
    })
  },
  onShow() { //进入页面链接
    console.log("app.globalData.socketStatus", app.globalData.socketStatus);
    if (app.globalData.socketStatus == 'closed') {
      // websocket方式
      app.openSocket(this.data.roomId, this, "author")
    }
  },
  // 主播分享自己的直播间
  onShareAppMessage: function () {
    return {
      title: '快来我的直播间看看吧~',
      imageUrl: this.data.liveRoomsInfo.roomInfo.coverImage,
      path: `/packageStreamMedia/pages/live-client/client?id=${this.data.id}`
    }
  },
  async getUserInfo() {
    const res = await WXAPI.userDetail(wx.getStorageSync('token'))
    if (res.code == 0) {
      this.setData({
        apiUserInfoMap: res.data
      })
    }
  },
  showBeautySelect() {
    this.setData({
      showSelect09: true
    })
  },
  select09(e) {
    const num = e.currentTarget.dataset.num
    this.setData({
      beauty: num,
      showSelect09: false
    })
  },
  async myLiveRoomsInfo() {
    const res = await WXAPI.myLiveRoomsInfo(wx.getStorageSync('token'), this.data.id)
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
      mainlyGoods
    })
  },
  bindstatechange(e) {
    console.log(e);
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