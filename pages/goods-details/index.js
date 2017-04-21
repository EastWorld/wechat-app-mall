//index.js
//获取应用实例
var app = getApp();
var WxParse = require('../../wxParse/wxParse.js');

Page({
  data: {
    indicatorDots: true,
    autoplay: true,
    interval: 3000,
    duration: 1000,
    loadingHidden: false , // loading
    userInfo: {},
    goodsDetail:{},
    images:[],
    swiperCurrent: 0,  
    selectCurrent:0,
    hasMoreSelect:false,
    selectSize:"选择：",
    shopNum:0,
    guigeSelectIndex:null,
    hideShopPopup:true,
    goodsThumbnail:"../../images/goods-details/banner01.png",
    goodsGuiGe:['大地50ml','大地淡200ml','大地淡500ml','大地淡套装500ml'],
    buyNumber:1,
    buyNumMin:1,
    buyNumMax:10,

    shopCarInfo:{}
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
    // 获取购物车数据
    wx.getStorage({
      key: 'shopCarInfo',
      success: function(res) {
        console.log(res.data)
        that.setData({
          shopCarInfo:res.data,
          shopNum:res.data.shopNum
        });
      } 
    })

    wx.request({
      url: 'https://api.it120.cc/'+ app.globalData.subDomain +'/shop/goods/detail',
      data: {
        id: e.id
      },
      success: function(res) {
        console.log(res.data.data);
        var selectSizeTemp = "";
        if (res.data.data.properties) {
          for(var i=0;i<res.data.data.properties.length;i++){
            selectSizeTemp = selectSizeTemp + " " + res.data.data.properties[i].name;
          }
          console.log(selectSizeTemp)
          that.setData({
            hasMoreSelect:true,
            selectSize:that.data.selectSize + selectSizeTemp
          });
        }
        that.setData({
          goodsDetail:res.data.data,
        });
        WxParse.wxParse('article', 'html', res.data.data.content, that, 5);
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
  },
  addShopCar:function(){
    // 加入购物车
    var shopCarMap = {};
    shopCarMap.goodsId=this.data.goodsDetail.basicInfo.id;
    shopCarMap.pic=this.data.goodsDetail.basicInfo.pic;
    shopCarMap.name=this.data.goodsDetail.basicInfo.name;
    // shopCarMap.label=this.data.goodsDetail.basicInfo.id; 规格尺寸 
    shopCarMap.propertyChildIds="";
    shopCarMap.price=this.data.goodsDetail.basicInfo.minPrice;
    shopCarMap.left="";
    shopCarMap.active=true;
    shopCarMap.number=1;
    shopCarMap.logisticsType=0;

    var shopCarInfo = this.data.shopCarInfo;
    if (!shopCarInfo.shopNum){
      shopCarInfo.shopNum = 0;
    }
    if (!shopCarInfo.shopList){
      shopCarInfo.shopList = [];
    }
    var hasSameGoodsIndex = -1;
    for (var i = 0;i<shopCarInfo.shopList.length;i++) {
      var tmpShopCarMap = shopCarInfo.shopList[i];
      if (tmpShopCarMap.goodsId == shopCarMap.goodsId && tmpShopCarMap.propertyChildIds == shopCarMap.propertyChildIds) {
        hasSameGoodsIndex = i;
        shopCarMap.number=shopCarMap.number + tmpShopCarMap.number;
        break;
      }
    }

    shopCarInfo.shopNum = shopCarInfo.shopNum + 1;
    if (hasSameGoodsIndex > -1) {
      shopCarInfo.shopList.splice(hasSameGoodsIndex,1, shopCarMap);
    } else {
       shopCarInfo.shopList.push(shopCarMap);
    }

    this.setData({
      shopCarInfo:shopCarInfo,
      shopNum:shopCarInfo.shopNum
    });

    // 写入本地存储
    wx.setStorage({
      key:"shopCarInfo",
      data:shopCarInfo
    })

    //console.log(shopCarInfo);

    //shopCarInfo = {shopNum:12,shopList:[]}
  },
  goShopCar:function () {
    wx.switchTab({
      url: "/pages/shop-cart/index"
    });
  }
})
