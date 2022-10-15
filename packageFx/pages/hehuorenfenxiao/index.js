const app = getApp()
const WXAPI = require('apifm-wxapi')
const AUTH = require('../../../utils/auth')
const wxpay = require('../../../utils/pay.js')
const ImageUtil = require('../../../utils/image')
const APP = getApp()
// fixed首次打开不显示标题的bug

var sliderWidth = 96; // 需要设置slider的宽度，用于计算中间位置

Date.prototype.format = function(format) {
  var date = {
        "M+": this.getMonth() + 1,
        "d+": this.getDate(),
        "h+": this.getHours(),
        "m+": this.getMinutes(),
        "s+": this.getSeconds(),
        "q+": Math.floor((this.getMonth() + 3) / 3),
        "S+": this.getMilliseconds()
  };
  if (/(y+)/i.test(format)) {
        format = format.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length));
  }
  for (var k in date) {
        if (new RegExp("(" + k + ")").test(format)) {
                format = format.replace(RegExp.$1, RegExp.$1.length == 1
                      ? date[k] : ("00" + date[k]).substr(("" + date[k]).length));
        }
  }
  return format;
}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    wxlogin: true,
    balance: 0,
    freeze: 0,
    score: 0,
    score_sign_continuous: 0,
    cashlogs: undefined,

    tabs: ["资金明细", "提现记录", "押金记录"],
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0,

    withDrawlogs: undefined,
    depositlogs: undefined,

    rechargeOpen: false, // 是否开启充值[预存]功能
    TzCount: 0, //团长数
    TyCount: 0, //团员数
    commisionData: {
      today: 0,
      yesday: 0,
      thisMonth: 0,
      lastMonth: 0,
      todayXiaoshou: 0,
      yesdayXiaoshou: 0,
      thisMonthXiaoshou: 0,
      lastMonthXiaoshou: 0,
    },
    tzid:"",//团长id
    originShow:false,//显示固定得二维码 不带参数
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          sliderLeft: (res.windowWidth / that.data.tabs.length - sliderWidth) / 2,
          sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex
        });
      }
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

    this.setData({
      navHeight: APP.globalData.navHeight,
      navTop: APP.globalData.navTop,
      windowHeight: APP.globalData.windowHeight,
      menuButtonObject: APP.globalData.menuButtonObject //小程序胶囊信息
    })

    AUTH.checkHasLogined().then(isLogined => {
      this.setData({
        wxlogin: isLogined
      })
      if (isLogined) {
        this.doneShow();
        this.getUserApiInfo();
        this.getTz(1);
        this.getTy(2);
        this.getfxMoney();
        this.fxMembers();
        this.getMembersStatistics();
      }
    })
  },

  async commision() {
    const uid = this.data.apiUserInfoMap.base.id
    var commisionData = this.data.commisionData
    const nowDate = new Date()
    console.log('今天', nowDate.format('yyyyMMdd'))
    console.log('本月', nowDate.format('yyyyMM'))
    const yestoday = new Date(nowDate.getTime() - 24 * 60 * 60 * 1000)
    console.log('昨天', yestoday.format('yyyyMMdd'))
    // 上个月
    let year = nowDate.getFullYear()
    let month = nowDate.getMonth() + 1
    if (month == 1) {
      month = 12
      year--
    } else {
      month--
    }
    const lastMonth = year + "" + (month < 10 ? ('0' + month) : month)
    console.log('上个月', lastMonth)
    let res = await WXAPI.siteStatisticsSaleroom({
      dateBegin: nowDate.format('yyyyMMdd'),
      dateEnd: nowDate.format('yyyyMMdd'),
      uid: uid
    })
    if (res.code === 0) {
      commisionData.today = res.data[0].amount
      commisionData.todayXiaoshou = res.data[0].saleroom
    }
    res = await WXAPI.siteStatisticsSaleroom({
      dateBegin: yestoday.format('yyyyMMdd'),
      dateEnd: yestoday.format('yyyyMMdd'),
      uid: uid
    })
    if (res.code === 0) {
      commisionData.yesday = res.data[0].amount
      commisionData.yesdayXiaoshou = res.data[0].saleroom
    }
    res = await WXAPI.siteStatisticsSaleroom({
      dateBegin: nowDate.format('yyyyMM'),
      dateEnd: nowDate.format('yyyyMM'),
      uid: uid
    })
    if (res.code === 0) {
      commisionData.thisMonth = res.data[0].amount
      commisionData.thisMonthXiaoshou = res.data[0].saleroom
    }
    res = await WXAPI.siteStatisticsSaleroom({
      dateBegin: lastMonth,
      dateEnd: lastMonth,
      uid: uid
    })
    if (res.code === 0) {
      commisionData.lastMonth = res.data[0].amount
      commisionData.lastMonthXiaoshou = res.data[0].saleroom
    }
    this.setData({
      commisionData:commisionData
    })
  },


  backto() {
    wx.navigateBack()
  },
  getUserApiInfo: function () {
    var that = this;
    WXAPI.userDetail(wx.getStorageSync('token')).then(function (res) {
      if (res.code == 0) {
        let _data = {}
        _data.apiUserInfoMap = res.data
        if (res.data.base.mobile) {
          _data.userMobile = res.data.base.mobile
        }
        if (that.data.order_hx_uids && that.data.order_hx_uids.indexOf(res.data.base.id) != -1) {
          _data.canHX = true // 具有扫码核销的权限
        }
        const adminUserIds = wx.getStorageSync('adminUserIds')
        if (adminUserIds && adminUserIds.indexOf(res.data.base.id) != -1) {
          _data.isAdmin = true
        }
        if (res.data.peisongMember && res.data.peisongMember.status == 1) {
          _data.memberChecked = false
        } else {
          _data.memberChecked = true
        }
        that.setData(_data);
        that.commision();
        if(res.data.base.isTeamLeader || res.data.partnerInfo) {
          that.fetchQrcode(false)
        }
      }
    })
  },
  doneShow: function () {
    const _this = this
    const token = wx.getStorageSync('token')
    if (!token) {
      this.setData({
        wxlogin: false
      })
      return
    }
    WXAPI.userAmount(token).then(function (res) {
      if (res.code == 700) {
        wx.showToast({
          title: '当前账户存在异常',
          icon: 'none'
        })
        return
      }
      if (res.code == 2000) {
        this.setData({
          wxlogin: false
        })
        return
      }
      if (res.code == 0) {
        _this.setData({
          balance: res.data.balance.toFixed(2),
          freeze: res.data.freeze.toFixed(2),
          totleConsumed: res.data.totleConsumed.toFixed(2),
          score: res.data.score
        });
      }
    })
    this.fetchTabData(this.data.activeIndex)
  },


  async getfxMoney(){
    const res = await WXAPI.partnerSetting()
    console.log("getfxMoney",res)
    if(res.code==0){
      this.setData({
        fxData:res.data
      })
    }
  },

  async payFx(){
    var money = this.data.fxData.priceLeader;
    wxpay.wxpay('payTz', money, '', "/pages/packageA/pages/vip/index");
  },

  fetchTabData(activeIndex) {
    if (activeIndex == 0) {
      this.cashLogs()
    }
    if (activeIndex == 1) {
      this.withDrawlogs()
    }
    if (activeIndex == 2) {
      this.depositlogs()
    }
  },
  cashLogs() {
    const _this = this
    WXAPI.cashLogsV2({
      token: wx.getStorageSync('token'),
      page: 1,
      pageSize: 50
    }).then(res => {
      if (res.code == 0) {
        _this.setData({
          cashlogs: res.data.result
        })
      }
    })
  },
  withDrawlogs() {
    const _this = this
    WXAPI.withDrawLogs({
      token: wx.getStorageSync('token'),
      page: 1,
      pageSize: 50
    }).then(res => {
      if (res.code == 0) {
        _this.setData({
          withDrawlogs: res.data
        })
      }
    })
  },
  depositlogs() {
    const _this = this
    WXAPI.depositList({
      token: wx.getStorageSync('token'),
      page: 1,
      pageSize: 50
    }).then(res => {
      if (res.code == 0) {
        _this.setData({
          depositlogs: res.data.result
        })
      }
    })
  },

  recharge: function (e) {
    wx.navigateTo({
      url: "/pages/recharge/index"
    })
  },
  withdraw: function (e) {
    wx.navigateTo({
      url: "/pages/withdraw/index"
    })
  },
  payDeposit: function (e) {
    wx.navigateTo({
      url: "/pages/deposit/pay"
    })
  },
  tabClick: function (e) {
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    });
    this.fetchTabData(e.currentTarget.id)
  },
  cancelLogin() {
    wx.switchTab({
      url: '/pages/my/index'
    })
  },
  processLogin(e) {
    if (!e.detail.userInfo) {
      wx.showToast({
        title: '已取消',
        icon: 'none',
      })
      return;
    }
    AUTH.register(this);
  },

  async getcashLogJD() { //获取金豆
    const _this = this
    await WXAPI.cashLogsV2({
      token: wx.getStorageSync('token'),
      page: 1,
      pageSize: 50000,
      type: 7
    }).then(res => {
      if (res.code == 0) {
        _this.setData({
          cashLogJD: res.data
        })
        _this.setData({
          invite_count: res.data.totalRow,
          getJD: res.data.totalRow,
        })
      } else {
        _this.setData({
          invite_count: 0,
          getJD: 0,
        })
      }
    })
  },
  async getcashLogJDtx() { //获取金豆(已提现)
    const _this = this
    await WXAPI.cashLogsV2({
      token: wx.getStorageSync('token'),
      page: 1,
      pageSize: 50000,
      type: 1
    }).then(res => {
      if (res.code == 0) {
        _this.setData({
          txJD: res.data.totalRow,
        })
      } else {
        _this.setData({
          txJD: 0
        })
      }
    })
  },
  copyContent(e) {
    console.log("1")
    var data = e.currentTarget.dataset.id + ""
    wx.setClipboardData({
      data: data,
      success(res) {
        wx.getClipboardData({
          success(res) {
            console.log(res.data) // data
          }
        })
      }
    })
  },

  async getMembersStatistics() { //团队情况
    const res = await WXAPI.partnerMembersStatistics(wx.getStorageSync('token'))
    if (res.code == 0) {
      this.setData({
        membersStatistics: res.data
      })
    }
  },


  async getTz(name) { //团长
    const res = await WXAPI.fxMembers({
      token: wx.getStorageSync('token'),
      page: 1,
      pageSize: 50,
      level: name, // "不填全部，1为团队长，2为团员"
      statisticsDay: "2021"
    })
    if (res.code == 0) {
      this.setData({
        TzCount: res.data.result.length
      })
    }
  },
  async getTy(name) { //团员
    const res = await WXAPI.fxMembers({
      token: wx.getStorageSync('token'),
      page: 1,
      pageSize: 50,
      level: name, // "不填全部，1为团队长，2为团员"
      statisticsDay: "2021"
    })
    if (res.code == 0) {
      this.setData({
        TyCount: res.data.result.length
      })
    }
  },
  async fxMembers(){
    const res = await WXAPI.fxMembers({
      token:wx.getStorageSync('token')
    })
    console.log("fxmenber",res)
  },
  goFxmem(e){
    var level = e.currentTarget.dataset.level
    wx.navigateTo({
      url: 'fxmember?level='+level,
    })
  },

  goCommision(){
    wx.navigateTo({
      url: '../commisionLog/index',
    })
  },

  async partnerBindTeamLeader() {
    var uid = this.data.tzid;
    const res = await WXAPI.partnerBindTeamLeader(wx.getStorageSync('token'),uid)
    if (res.code != 0) {
      wx.showToast({
        title: res.msg,
        icon: 'none'
      })
    } else if (res.code == 0) {
      wx.showToast({
        title: '设置团长成功',
      })
      setTimeout(() => {
        this.onShow()
      }, 1000);
    }
  },
  onChange(e){
    this.setData({
      tzid:e.detail
    })
  },
  fetchQrcode(test){
    const _this = this
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    WXAPI.wxaQrcode({
      scene: 'inviter_id=' + wx.getStorageSync('uid'),
      page: 'pages/index/index',
      is_hyaline: true,
      autoColor: true,
      expireHours: 1,
      check_path: test ? false : true
    }).then(res => {
      wx.hideLoading()
      if (res.code ==  41030) {
        _this.fetchQrcode(true)
        return
      }
      if (res.code == 0) {
        _this.showCanvas(res.data)
      }
    })
  },
  showCanvas(qrcode){
    const _this = this
    let ctx
    wx.getImageInfo({
      src: qrcode,
      success: (res) => {
        const imageSize = ImageUtil.imageUtil(res.width, res.height)
        const qrcodeWidth = 160
        console.log("imageSize",imageSize)
        _this.setData({
          canvasHeight: qrcodeWidth
        })
        ctx = wx.createCanvasContext('firstCanvas')
        ctx.setFillStyle('#fff')
        ctx.fillRect(0, 0, imageSize.windowWidth, imageSize.imageHeight + qrcodeWidth)
        ctx.drawImage(res.path, 0, 0, qrcodeWidth, qrcodeWidth)
        setTimeout(function () {
          wx.hideLoading()
          ctx.draw()
        }, 1000)
      }
    })
  },
  // =====================保存推荐二维码图片到手机==========================
  saveToMobile() { //下载二维码到手机
    wx.canvasToTempFilePath({
      canvasId: 'firstCanvas',
      success: function (res) {
        let tempFilePath = res.tempFilePath
        wx.saveImageToPhotosAlbum({
          filePath: tempFilePath,
          success: (res) => {
            wx.showModal({
              content: '二维码已保存到手机相册',
              showCancel: false,
              confirmText: '知道了',
              confirmColor: '#333'
            })
          },
          fail: (res) => {
            wx.showToast({
              title: res.errMsg,
              icon: 'none',
              duration: 2000
            })
          }
        })
      }
    })
  },

  // =====================保存固定二维码图片到手机==========================
  saveOri() {
    let that = this
    //若二维码未加载完毕，加个动画提高用户体验
    wx.showToast({
     icon: 'loading',
     title: '正在保存图片',
     duration: 1000
    })
    //判断用户是否授权"保存到相册"
    wx.getSetting({
     success (res) {
      //没有权限，发起授权
      if (!res.authSetting['scope.writePhotosAlbum']) {
       wx.authorize({
        scope: 'scope.writePhotosAlbum',
        success () {//用户允许授权，保存图片到相册
         that.savePhoto();
        },
        fail () {//用户点击拒绝授权，跳转到设置页，引导用户授权
         wx.openSetting({
          success () {
           wx.authorize({
            scope: 'scope.writePhotosAlbum',
            success() {
             that.savePhoto();
            }
           })
          }
         })
        }
       })
      } else {//用户已授权，保存到相册
       that.savePhoto()
      }
     }
    })
   },
  //保存图片到相册，提示保存成功
   savePhoto() {
    let that = this
    wx.downloadFile({
     url: 'https://dcdn.it120.cc/2021/01/24/928782d2-062c-4a45-9911-b331fdf38ed9.jpg',
     success: function (res) {
      wx.saveImageToPhotosAlbum({
       filePath: res.tempFilePath,
       success(res) {
        wx.showToast({
         title: '保存成功',
         icon: "success",
         duration: 1000
        })
       }
      })
     }
    })
   },
})