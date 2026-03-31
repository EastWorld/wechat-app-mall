const WXAPI = require('apifm-wxapi')

Page({
  data: {
    page: 1, // 读取第几页数据
    navIndex: 0,
    liveList: [],
    hasMore: true,
    reload: false,
    indicatorDots: false,
    vertical: false,
    autoplay: true,
    interval: 3000,
    duration: 500,
    circular: true,
    showEmpty: false,
    cateList: [ // 直播分类
      {
        id: 1,
        name: '精选'
      }, {
        id: 2,
        name: '全部'
      }
    ],
    cate_id: 1,
    navList: [{
        type: 1,
        iconPath: '../../images/live/nav01.png',
        title: '入驻主播'
      },
      {
        type: 2,
        iconPath: '../../images/live/nav02.png',
        title: '入驻经纪人'
      },
      {
        type: 3,
        iconPath: '../../images/live/nav03.png',
        title: '入驻服务商'
      },
      {
        type: 4,
        iconPath: '../../images/live/nav04.png',
        title: '入驻合伙人'
      }
    ],
    flashList: [], // 幻灯片
    swiperCurIndex: 1,
    left: 100,
    showjoo: 1,
    isCustom: true
  },
  async banners() {
		//获取轮播
		const bannerRes = await WXAPI.banners({
			type: 'livelist'
    })
    this.setData({
      flashList: bannerRes.data
    })
  },
  onLoad: function(option) {
    this.banners()
    this.queryLiveRoomInfo()
  },
  onShow() {
    
  },

  bindChange(e) {
    let current = e.detail.current
    this.setData({
      swiperCurIndex: current + 1
    })
  },

  /**
   * 首页导航
   */
  tapItem(e) {
    wx.showModal({
      title: '提示',
      content: '线上申请未开放，请联系客服申请入驻！',
      success (res) {
        if (res.confirm) {
        //console.log('用户点击确定')
        } else if (res.cancel) {
        //console.log('用户点击取消')
        }
      }
    })
    return
    let url = ''
    let {
      type
    } = e.currentTarget.dataset
    let {
      userType,
      live_status,
      reason
    } = app.globalData
    // console.log('用户当前身份类型' + userType)
    // console.log('想要申请类型' + type)
    // console.log('申请状态' + live_status)
    // console.log('如果被驳回的原因是' + reason)
    // 申请入驻的条件为 入驻身份不能低于或等于当前身份
    if (userType >= type) {
      $api.msg('入驻身份不能低于当前身份')
      return;
    }
    if (live_status == 1 || (live_status == 0 && reason)) { // 入驻主播正在申请中
      url = `/packageB/pages/apply-status/index?status=${live_status}&reason=${reason}`
    } else {
      url = `/packageB/pages/apply-live/apply-live?type=${type}`
    }
    wx.navigateTo({
      url
    })
  },

  // 点击幻灯片去直播间
  toLive(e) {
    return
    let {
      id
    } = e.currentTarget.dataset
    console.log(id)
    if (id == 0) return
    let like;
    let url;
    setTimeout(() => {
      wx.navigateTo({
        url: `/pages/live-detail/live-detail?number=${id}&url=${encodeURIComponent(url)}&like=${like}`,
      })
    }, 200)
  },
  navDetail(e) {
    let status = e.currentTarget.dataset.status;
    let id = e.currentTarget.dataset.id;
    if(status != 1){ 
      wx.showToast({
        title: '未开播，敬请期待',
        icon: 'none'
      })
      return
    }
    wx.navigateTo({
      url: '/pages/live-client/client?id=' + id
    })
  },
   /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {
    this.setData({
      reload: true,
      hasMore: true,
      page: 1
    })
    this.queryLiveRoomInfo()
    wx.stopPullDownRefresh()
  },

  // 导航切换
  navTap(e) {
   
    let temp = e.currentTarget.dataset
    let navIndex = temp.index
    let id = temp.id
    if (navIndex == this.data.navIndex) return
    let cate_id = ''
    if (id) {
      cate_id = id
    }
    
    this.setData({
      navIndex,
      reload: true,
      page: 1,
      hasMore: true,
      cate_id:cate_id,
      scrollLeft: navIndex * 50
    })
    this.queryLiveRoomInfo()
  },
  // 获取直播列表
  async queryLiveRoomInfo(){
    const res = await WXAPI.liveRooms({
      page: this.data.page
    })
    if (res.code == 700) {
      this.setData({
        loading: false,
        liveList: null,
        hasMore: false
      })
    }
    if (res.code == 0) {
      const anchorMap = res.data.anchorMap
      res.data.result.forEach(ele => {
        if (anchorMap) {
          ele.anchor = anchorMap[ele.uid]
        }
      })
      this.setData({
        loading: false,
        liveList:res.data.result,
        hasMore: res.data.totalPage > this.data.page ? true : false
      })
    }
	},
  getRandomNumber() {
    let number = Math.floor(Math.random() * 15000)
    return number
  },

  onReachBottom() {
    const hasMore = this.data.hasMore
    if(hasMore) {
      this.data.page++
      this.queryLiveRoomInfo()
    }
  },
})