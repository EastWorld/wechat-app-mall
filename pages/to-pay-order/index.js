//index.js
//获取应用实例
var app = getApp()

Page({
  data: {
    mallName:wx.getStorageSync('mallName'),
    goodsList:[],
    isNeedLogistics:0, // 是否需要物流信息
    allGoodsPrice:0,
    yunPrice:0,

    goodsJsonStr:""
  },

 
  onLoad: function (e) {
    var that = this;
    var shopList = [];
    var shopCarInfoMem = wx.getStorageSync('shopCarInfo');
    if (shopCarInfoMem && shopCarInfoMem.shopList) {
      shopList = shopCarInfoMem.shopList
    }
    var isNeedLogistics = 0;
    var allGoodsPrice = 0;

    var goodsJsonStr = "[";
    for (var i =0; i < shopList.length; i++) {
      var carShopBean = shopList[i];
      if (carShopBean.logisticsType > 0) {
        isNeedLogistics = 1;
      }
      allGoodsPrice += carShopBean.price * carShopBean.number

      var goodsJsonStrTmp = '';
      if (i > 0){
        goodsJsonStrTmp = ",";
      }
      goodsJsonStrTmp += '{"goodsId":'+ carShopBean.goodsId +',"number":'+ carShopBean.number +',"propertyChildIds":"'+ carShopBean.propertyChildIds +'","logisticsType":'+ carShopBean.logisticsType +'}';
      goodsJsonStr += goodsJsonStrTmp;
    }
    goodsJsonStr += "]";
    that.setData({
      goodsList:shopList,
      isNeedLogistics:isNeedLogistics,
      allGoodsPrice:allGoodsPrice,
      goodsJsonStr:goodsJsonStr
    });



  },
  createOrder:function (e) {
    wx.showLoading();
    var that = this;
    var loginToken;
    // 登录
    wx.login({
      success: function (res) {
        wx.request({
          url: 'https://api.it120.cc/'+ app.globalData.subDomain +'/user/wxapp/login',
          data: {
            code: res.code
          },
          success: function(res) {
            if (res.data.code == 10000) {
              // 去注册
              that.registerUser(e);
              return;
            }
            if (res.data.code != 0) {
              // 登录错误 
              wx.hideLoading();
              wx.showModal({
                title: '提示',
                content: '无法登录，请重试',
                showCancel:false
              })
              return;
            }
            loginToken = res.data.data.token // 用户登录 token
            var remark = e.detail.value.remark; // 备注信息
            wx.request({
              url: 'https://api.it120.cc/'+ app.globalData.subDomain +'/order/create',
              method:'POST',
              header: {
                'content-type': 'application/x-www-form-urlencoded'
              },
              data: {
                token:loginToken,
                goodsJsonStr:that.data.goodsJsonStr,
                remark:remark
              }, // 设置请求的 参数
              success: (res) =>{
                wx.hideLoading();
                console.log(res.data);
              }
            })

          }
        })
      }
    })
  },
  registerUser: function (e) {
    var that = this;
    wx.login({
      success: function (res) {
        var code = res.code; // 微信登录接口返回的 code 参数，下面注册接口需要用到
        wx.getUserInfo({
          success: function (res) {
            var iv = res.iv;
            var encryptedData = res.encryptedData;
            // 下面开始调用注册接口
            wx.request({
              url: 'https://api.it120.cc/'+ app.globalData.subDomain +'/user/wxapp/register/complex',
              data: {code:code,encryptedData:encryptedData,iv:iv}, // 设置请求的 参数
              success: (res) =>{
                wx.hideLoading();
                that.createOrder(e);
              }
            })
          }
        })
      }
    })
  }
})
