const app = getApp()
const CONFIG = require('../../../config.js')
const WXAPI = require('apifm-wxapi')

let that;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    beauty: 0, // 美颜，取值范围 0-9 ，0 表示关闭
    focus: false,
    firstTap: false,
    goodsList: [],
    pageIndex: 1,
    pageSize: 10,
    hasMore: true,
    showGoodsInfo: false,
    showEmpty: false, // 是否展示缺省提示
    ids: '', // 已经选中的商品id
    showTips: false, // 是否显示某个人加入进入直播间
    online_people: '', // 观看人数
    pusherUrl: "",
    roomId: undefined,
    showSetInfo: false,
  },
  // 某人加入房间
  showTips(opts) {
    let nickname = opts.nickname;
    let message = opts.message;
    let avatarurl = opts.avatarurl;
    let adj = app.getRandomString();
    that.setData({
      showTips: true,
      avatar_url: avatarurl,
      coming_tips: nickname + " " + adj + message
    })
    if (!that.data.focus) {
      that.setScrollTop();
    }
    setTimeout(function () {
      that.setData({
        showTips: false,
      })
    }, 3000);
  },
  closeOrOpenLiveRoom(roomid, status) { //停止直播
    var that = this
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: CONFIG.HTTP_REQUEST_URL + "closeOrOpenLiveRoom",
      data: {
        roomId: roomid,
        roomStatus: status
      },
      method: "GET",
      header: {
        'Content-Type': 'application/json;charset=utf-8 '
      },
      success: function (res2) {
        // console.log("selectRoomDetailById",res2);
        if (res2.data.code == 500) {
          wx.showToast({
            title: res2.data.message,
            duration: 1500,
            icon: 'none',
            mask: true,
          })
          return
        }
      },
      complete: function (c) {
        wx.hideLoading()
      }
    })
  },
  // 发送或者显示弹幕
  showBarrage(opts) {
    let temp = {}
    temp.nickname = opts.nickname
    temp.words = opts.message
    temp.color = app.getRandomFontColor()
    let barrageList = [...that.data.barrageList, temp]
    if (barrageList.length > 30) {
      barrageList = barrageList.splice(10)
    }
    that.setData({
      barrageList
    });
    if (that.data.focus) {
      return
    }
    that.setScrollTop();
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


    this.getPushInfo(options.roomid) //获取直播信息
    this.closeOrOpenLiveRoom(options.roomid, 1) //修改直播状态
    // wx.showLoading({
    //   title: '加载中...',
    // })
    that = this;
    // 设置屏幕常亮 兼容ios
    wx.setKeepScreenOn({
      keepScreenOn: true
    })
    // 设置屏幕亮度 0-1范围 设置了 用户自己去设置调节屏幕的亮度
    // wx.setScreenBrightness({ value: .6 }) 

    this.ctx = wx.createLivePusherContext('pusher')

    // if (options.object) { // 开启直播传递过来直播间的名称和封面图
    //   let parse = JSON.parse(options.object)
    //   let { name, cover, ids, category_id } = parse
    //   this.setData({
    //     live_name: name,
    //     cover,
    //     ids,
    //     category_id
    //   })
    //   this.getPushInfo()
    // }
    let query = wx.createSelectorQuery()
    query.select('.barrage').boundingClientRect(function (rect) {
      // console.log(rect)
    }).exec();
  },

  // 主推商品详情
  toDetail(e) {
    let {
      id
    } = e.currentTarget.dataset
    let url = `/pages/product-detail/index?id=${id}`
    wx.navigateTo({
      url,
    })
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
    let {
      inputVal
    } = this.data
    if (!inputVal) {
      wx.showToast({
        title: '发送内容不能为空',
        duration: 1500,
        icon: 'none',
        mask: true
      })
      return;
    }

    app.sendMessage(inputVal)
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

  // 前往商品详情
  navPurchase(e) {
    wx.navigateTo({
      url: "/pages/goods-details/index?id=" + e.currentTarget.dataset.id
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
  showPeoples() { //显示直播间人员
    var that = this
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: CONFIG.HTTP_REQUEST_URL + "selectCurRoomUserByRid",
      data: {
        roomId: this.data.info.id,
        status: 1
      },
      method: "GET",
      header: {
        'Content-Type': 'application/json;charset=utf-8 '
      },
      success: function (res) {
        //console.log("live-author---selectCurRoomUserByRid",res);
        if (res.data.code == 500) {
          wx.showToast({
            title: res.data.message,
            duration: 1500,
            icon: 'none',
            mask: true,
          })
          return
        }
        let list = res.data.list;
        if (list.length == 0) {
          that.setData({
            showEmpty: true,
            online_people: ''
          });
        } else {
          that.setData({
            online_people: list.length + 1,
          });
        }
        that.setData({
          showPeopleInfo: true,
          peoplelist: list,
        });
      },
      complete: function (c) {
        wx.hideLoading()
      }
    })
  },
  lahei(e) { //拉黑用户 
    let userid = e.currentTarget.dataset.userid;
    let is_liver = e.currentTarget.dataset.is_liver;
    userid = parseInt(userid);
    if (is_liver) {
      wx.showToast({
        title: '权限不足，请联系客服处理！',
        icon: 'none',
        duration: 2000
      })
      return
    }
    var that = this
    wx.showModal({
      title: '确认拉黑',
      content: '拉黑会强制该用户退出直播间',
      success(res) {
        if (res.confirm) {
          //console.log('用户点击确定')
          wx.showLoading({
            title: '加载中',
          })
          wx.request({
            url: CONFIG.HTTP_REQUEST_URL + "lahei",
            data: {
              userid: userid
            },
            method: "GET",
            header: {
              'Content-Type': 'application/json;charset=utf-8 '
            },
            success: function (res) {
              //console.log("live-author---lahei",res);
              if (res.data.code == 500) {
                wx.showToast({
                  title: res.data.message,
                  duration: 1500,
                  icon: 'none',
                  mask: true,
                })
                return
              }
              wx.showToast({
                title: '成功',
                icon: 'success',
                duration: 2000
              })
              that.showPeoples();
            },
            complete: function (c) {
              wx.hideLoading()
            }
          })
        } else if (res.cancel) {
          //console.log('用户点击取消')
        }
      }
    })
    //let openid = e.currentTarget.dataset.user_open_id;


  },
  showGoods() {
    let data = this.data
    if (!data.firstTap) {
      this.getGoodsList()
      this.setData({
        firstTap: true
      })
    }
    this.setData({
      showGoodsInfo: true,
      showEmpty: true,
    })
  },

  async getGoodsList() {
    wx.showLoading({
      title: '加载中',
    })
    const res = await WXAPI.goods()
    //    console.log(res.data);
    wx.hideLoading()
    if (res.code == 0) {
      this.setData({
        goodsList: res.data,
        showEmpty: false
      })
    }

  },

  // 获取推流信息
  getPushInfo(roomid) {
    var that = this
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: CONFIG.HTTP_REQUEST_URL + "selectRoomDetailById",
      data: {
        roomid: roomid,
        userOpenId: wx.getStorageSync('openid')
      },
      method: "GET",
      header: {
        'Content-Type': 'application/json;charset=utf-8 '
      },
      success: function (res2) {
        //console.log("live-author---selectRoomDetailById",res2);
        if (res2.data.code == 500) {
          wx.showToast({
            title: res2.data.message,
            duration: 1500,
            icon: 'none',
            mask: true,
          })
          return
        }
        let info = res2.data.map;
        that.setData({
          info: info,
          roomId: info.id
        });
        if (app.globalData.socketStatus == 'closedinit') {
          // websocket方式
          app.openSocket(info.id, that, "author")
        }

      },
      complete: function (c) {
        wx.hideLoading()
      }
    })
    // let data = this.data
    // console.log(wx.getStorageSync('token'))
    // console.log(data.live_name)
    // console.log(data.ids)
    // console.log(data.category_id)
    // wx.uploadFile({
    //   url: Config.HTTP_REQUEST_URL + '/wxsmall/Live/push',
    //   filePath: data.cover,
    //   name: 'cover', // 后端需要通过此字段来获取
    //   header: {
    //     "Content-Type": "multipart/form-data",
    //     "Charset": "utf-8"
    //   },
    //   formData: {
    //     token: wx.getStorageSync('token'),
    //     title: data.live_name,
    //     goods_ids: data.ids,
    //     live_category_id: data.category_id,
    //     v: 2, // 1 腾讯IM 2 websocket
    //   },
    //   success: function(res) {
    //     res = JSON.parse(res.data)
    //     if (res.code == 0) { // 推流信息
    //       that.setData({
    //         info: res.data,
    //         main_goods: res.data.main_goods,
    //         online: res.online
    //       })
    //       // websocket starts
    //       app.openSocket(res.data.number, that)
    //       // websocket ends
    //     } else {
    //       app.msg(res.message)
    //       setTimeout(() => {
    //         wx.navigateBack({ delta: 1 })
    //       }, 2000)
    //     }
    //   },
    //   fail: function(res) {
    //     console.log(res)
    //   },
    //   complete: function() {
    //     wx.hideLoading()
    //   }
    // })
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
          this.closeOrOpenLiveRoom(this.data.info.id, 0);
          wx.navigateBack({
            delta: 2
          })
          app.closeSocket()
        }
      }
    })
  },
  onUnload() {
    //app.sendMessageLeave('livelogout');
    this.closeOrOpenLiveRoom(this.data.info.id, 0);
  },
  onHide() { //隐藏页面断开
    app.closeSocket();
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
    let {
      number
    } = this.data.info
    return {
      title: '直播间分享啦！',
      imageUrl: this.data.cover,
      path: `/pages/index/index`,
      success: function (res) {
        console.log("转发成功:");
      },
      fail: function (res) {
        console.log("转发失败:");
      }
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
    this.setData({
      liveRoomsInfo: res.data
    })
  },
  bindstatechange(e) {
    console.log(e);
  }
})