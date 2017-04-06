//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    indicatorDots: true,
    autoplay: true,
    interval: 3000,
    duration: 1000,
    loadingHidden: false , // loading
    motto: 'coming soon! ',
    userInfo: {},
    images:[
      'http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg',
      'http://img06.tooopen.com/images/20160818/tooopen_sy_175866434296.jpg',
      'http://img06.tooopen.com/images/20160818/tooopen_sy_175833047715.jpg'
    ],
    swiperCurrent: 0,  
    selectCurrent:0,
    tabs: [ "全部", "选项一", "选项二", "选项三", "选项四", "选项五"],
    activeIndex: "0",
    goods:[
      {"img":"http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg","title":"修护水洗发露丝质柔滑型质柔滑型","price":"288.00"},
      {"img":"../../images/goods01.png","title":"修护水洗发露丝质柔滑型质柔滑型","price":"288.00"},
      {"img":"../../images/goods01.png","title":"修护水洗发露丝质柔滑型质柔滑型","price":"288.00"},
      {"img":"../../images/goods01.png","title":"修护水洗发露丝质柔滑型质柔滑型","price":"288.00"},
    ],
    scrollTop:"0"
  },

  tabClick: function (e) {
    this.setData({
      activeIndex: e.currentTarget.id
    });
  },
  //事件处理函数
  swiperchange: function(e) {
      //console.log(e.detail.current)
       this.setData({  
        swiperCurrent: e.detail.current  
    })  
  },
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  bindTypeTap: function(e) {
     this.setData({  
        selectCurrent: e.index  
    })  
  },
  scroll: function (e) {
    //  console.log(e) ;
    var that = this,scrollTop=that.data.scrollTop;
    that.setData({
      scrollTop:e.detail.scrollTop
    })
    // console.log('e.detail.scrollTop:'+e.detail.scrollTop) ;
    // console.log('scrollTop:'+scrollTop)
  },
  onLoad: function () {
    console.log('onLoad')
    var that = this
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function(userInfo){
      //更新数据
      that.setData({
        userInfo:userInfo
      })
    })
  }
})
