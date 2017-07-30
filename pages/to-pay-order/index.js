//index.js
//获取应用实例
var app = getApp()

Page({
  data: {
    goodsList:[],
    isNeedLogistics:0, // 是否需要物流信息
    allGoodsPrice:0,
    yunPrice:0,
    goodsJsonStr:""
  },
  onShow : function () {
    var shopList = [];
    var shopCarInfoMem = wx.getStorageSync('shopCarInfo');
    if (shopCarInfoMem && shopCarInfoMem.shopList) {
      shopList = shopCarInfoMem.shopList
    }
    this.setData({
      goodsList: shopList,
    });
    this.initShippingAddress();
  },
  onLoad: function (e) {
    
  },

  getDistrictId : function (obj, aaa){
    if (!obj) {
      return "";
    }
    if (!aaa) {
      return "";
    }
    return aaa;
  },

  createOrder:function (e) {
    wx.showLoading();
    var that = this;
    var loginToken = app.globalData.token // 用户登录 token
    var remark = e.detail.value.remark; // 备注信息

    var postData = {
      token: loginToken,
      goodsJsonStr: that.data.goodsJsonStr,
      remark: remark
    };
    if (that.data.isNeedLogistics > 0) {
      if (!that.data.curAddressData) {
        wx.hideLoading();
        wx.showModal({
          title: '错误',
          content: '请选择您的收货地址',
          showCancel: false
        })
        return;
      }
      postData.provinceId = that.data.curAddressData.provinceId;
      postData.cityId = that.data.curAddressData.cityId;
      if (that.data.curAddressData.districtId) {
        postData.districtId = that.data.curAddressData.districtId;
      }
      postData.address = that.data.curAddressData.address;
      postData.linkMan = that.data.curAddressData.linkMan;
      postData.mobile = that.data.curAddressData.mobile;
      postData.code = that.data.curAddressData.code;
    }


    wx.request({
      url: 'https://api.it120.cc/'+ app.globalData.subDomain +'/order/create',
      method:'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: postData, // 设置请求的 参数
      success: (res) =>{
        wx.hideLoading();
        console.log(res.data);
        if (res.data.code != 0) {
          wx.showModal({
            title: '错误',
            content: res.data.msg,
            showCancel: false
          })
          return;
        }
        // 清空购物车数据
        wx.removeStorageSync('shopCarInfo');
        // 下单成功，跳转到订单管理界面
        wx.reLaunch({
          url: "/pages/order-list/index"
        });
      }
    })
  },
  initShippingAddress: function () {
    var that = this;
    wx.request({
      url: 'https://api.it120.cc/'+ app.globalData.subDomain +'/user/shipping-address/default',
      data: {
        token:app.globalData.token
      },
      success: (res) =>{
        console.log(res.data)
        if (res.data.code == 0) {
          that.setData({
            curAddressData:res.data.data
          });
          that.processYunfei();
        }
      }
    })
  },
  processYunfei: function () {
    var that = this;
    var goodsList = this.data.goodsList;
    var goodsJsonStr = "[";
    var isNeedLogistics = 0;
    var allGoodsPrice = 0;
    for (let i = 0; i < goodsList.length; i++) {
      let carShopBean = goodsList[i];
      if (carShopBean.logistics) {
        isNeedLogistics = 1;
      }
      allGoodsPrice += carShopBean.price * carShopBean.number

      var goodsJsonStrTmp = '';
      if (i > 0) {
        goodsJsonStrTmp = ",";
      }
      goodsJsonStrTmp += '{"goodsId":' + carShopBean.goodsId + ',"number":' + carShopBean.number + ',"propertyChildIds":"' + carShopBean.propertyChildIds + '","logisticsType":0}';
      goodsJsonStr += goodsJsonStrTmp;
      
      if (carShopBean.logistics && !carShopBean.logistics.isFree) {
        // 计算应付运费金额
        let districtId = that.getDistrictId(that.data.curAddressData, that.data.curAddressData.districtId);
        wx.request({
          url: 'https://api.it120.cc/' + app.globalData.subDomain + '/shop/goods/price/freight',
          method: 'POST',
          header: {
            'content-type': 'application/x-www-form-urlencoded'
          },
          data: {
            templateId: carShopBean.logisticsType,
            type: 0,
            provinceId: this.data.curAddressData.provinceId,
            cityId: this.data.curAddressData.cityId,
            districtId: districtId
          }, // 设置请求的 参数
          success: (res) => {
            wx.hideLoading();
            if (res.data.code != 0) {
              wx.showModal({
                title: '错误',
                content: res.data.msg,
                showCancel: false
              })
              return;
            }
            let firstNumber = res.data.data.firstNumber;
            let addAmount = res.data.data.addAmount;
            let firstAmount = res.data.data.firstAmount;
            let addNumber = res.data.data.addNumber;
            if (carShopBean.logistics.feeType == 0) {
              // 按件数 
              let amountLogistics = firstAmount;
              let numberLeft = carShopBean.number - firstNumber;
              while (numberLeft > 0) {
                numberLeft = numberLeft - addNumber;
                amountLogistics = amountLogistics + addAmount;
              }
              that.setData({
                yunPrice: that.data.yunPrice + amountLogistics
              });
            }
            if (carShopBean.logistics.feeType == 1) {
              // 按重量
              let totleWeight = carShopBean.weight * carShopBean.number;
              let amountLogistics = firstAmount;
              let leftWeight = totleWeight- firstNumber;
              while (leftWeight > 0) {
                leftWeight = leftWeight - addNumber;
                amountLogistics = amountLogistics + addAmount;
              }
              that.setData({
                yunPrice: that.data.yunPrice + amountLogistics
              });
            }
          }
        })
        // 计算运费结束
      }
      
    }
    goodsJsonStr += "]";
    that.setData({
      isNeedLogistics: isNeedLogistics,
      allGoodsPrice: allGoodsPrice,
      goodsJsonStr: goodsJsonStr
    });
  },
  addAddress: function () {
    wx.navigateTo({
      url:"/pages/address-add/index"
    })
  },
  selectAddress: function () {
    wx.navigateTo({
      url:"/pages/select-address/index"
    })
  }
})
