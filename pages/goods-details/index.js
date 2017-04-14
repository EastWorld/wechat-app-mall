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
      '../../images/goods-details/banner01.png',
      'http://img06.tooopen.com/images/20160818/tooopen_sy_175866434296.jpg',
      'http://img06.tooopen.com/images/20160818/tooopen_sy_175833047715.jpg'
    ],
    swiperCurrent: 0,  
    selectCurrent:0,
    goodsTitle:"爱马仕（HERMES）大地男士香水 50ml超出两行样式",
    goodsPrice:" 288.00 - 300.00",
    selectSize:"选择：规格",
    goodsText:'Hermes爱马仕大地男士香水 50ml\n前 调 ／ 葡萄柚、橙\n中 调 ／ 玫瑰、广藿香、天竺葵\n后 调 ／ 香根、甜椒、安息香、西洋杉',
    desImgs:[
        '../../images/goods-details/des-img01.png',
        '../../images/goods-details/des-img02.png',
        '../../images/goods-details/des-img03.png'
    ],
    shopNum:0,
    guigeSelectIndex:null,
    hideShopPopup:true,
    goodsThumbnail:"../../images/goods-details/banner01.png",
    goodsGuiGe:['大地50ml','大地淡200ml','大地淡500ml','大地淡套装500ml'],
    buyNumber:1,
    buyNumMin:1,
    buyNumMax:10,
    resall:[]
  },

  //事件处理函数
  swiperchange: function(e) {
      //console.log(e.detail.current)
       this.setData({  
        swiperCurrent: e.detail.current  
    })  
  },
  onLoad: function (e) {
    console.log('onLoad');
    var that = this;
    // //调用应用实例的方法获取全局数据
    // app.getUserInfo(function(userInfo){
    //   //更新数据
    //   that.setData({
    //     userInfo:userInfo
    //   })
    // })

    wx.request({
      url: 'https://api.it120.cc/'+ app.globalData.subDomain +'/shop/goods/detail',
      data: {
        id: e.id
      },
      success: function(res) {
        console.log(res+"xxxx");
        var  images = [];
        for(var i=0;i<res.data.data.pics.length;i++){
          images.push(res.data.data.pics[i].pic);
        }
        that.setData({
          images:images,
          goodsText : res.data.data.basicInfo.characteristic,
          goodsTitle: res.data.data.basicInfo.name,
          goodsPrice: res.data.data.basicInfo.originalPrice
        });
        

         that.setData({
          resall:res
        });
      }
    })


  },
  bindGuiGeTap: function() {
     this.setData({  
        hideShopPopup: false 
    })  
  },
  closePopupTap: function() {
     this.setData({  
        hideShopPopup: true 
    })  
  },
  numJianTap: function() {
     if(this.data.buyNumber > this.data.buyNumMin){
        var currentNum = this.data.buyNumber;
        currentNum--; 
        this.setData({  
            buyNumber: currentNum
        })  
     }
  },
  numJiaTap: function() {
     if(this.data.buyNumber < this.data.buyNumMax){
        var currentNum = this.data.buyNumber;
        currentNum++ ;
        this.setData({  
            buyNumber: currentNum
        })  
     }
  },
  labelItemTap: function(e) {
      this.setData({  
          guigeSelectIndex: e.currentTarget.dataset.index
      })  
    
  }
})
