//index.js
//获取应用实例
var app = getApp()

Page({
  data: {
    goodsList:[],
    isNeedLogistics:0, // 是否需要物流信息
    allGoodsPrice:0,
    yunPrice:0,
    allGoodsAndYunPrice:0,
    goodsJsonStr:"",
    orderType:"", //订单类型，购物车下单或立即支付下单，默认是购物车，

    hasNoCoupons: true,
    coupons: [],
    youhuijine:0, //优惠券金额
    curCoupon:null // 当前选择使用的优惠券
  },
  onShow : function () {
    var that = this;
    var shopList = [];   
    //立即购买下单
    if ("buyNow"==that.data.orderType){
      var buyNowInfoMem = wx.getStorageSync('buyNowInfo');
      if (buyNowInfoMem && buyNowInfoMem.shopList) {
        shopList = buyNowInfoMem.shopList
      }
    }else{
      //购物车下单
      var shopCarInfoMem = wx.getStorageSync('shopCarInfo');
      if (shopCarInfoMem && shopCarInfoMem.shopList) {
        // shopList = shopCarInfoMem.shopList
        shopList = shopCarInfoMem.shopList.filter(entity => {
          return entity.active;
        });
      }
    }
    that.setData({
      goodsList: shopList,
    });
    that.initShippingAddress();    
  },
  
  onLoad: function (e) {
    var that = this;
    //显示收货地址标识
    that.setData({
      isNeedLogistics: 1,
      orderType: e.orderType
    });  
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
          content: '请先设置您的收货地址！',
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
    if (that.data.curCoupon) {
      postData.couponId = that.data.curCoupon.id;
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
        
        if ("buyNow" != that.data.orderType) {
          // 清空购物车数据
          wx.removeStorageSync('shopCarInfo');
        }

        // 下单成功，跳转到订单管理界面
        wx.redirectTo({
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
        if (res.data.code == 0) {
          that.setData({
            curAddressData:res.data.data
          });
        }else{
          that.setData({
            curAddressData: null
          });          
        }
        that.processYunfei();
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
      allGoodsPrice += carShopBean.price * carShopBean.number;

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
                that.data.yunPrice = that.data.yunPrice + amountLogistics;
                that.setData({
                  yunPrice: parseFloat((that.data.yunPrice).toFixed(2))
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
                that.data.yunPrice = that.data.yunPrice + amountLogistics;
                that.setData({
                  yunPrice: parseFloat((that.data.yunPrice).toFixed(2))
                });
              }
            }
          })
        // 计算运费结束    
      }
      
    }
    goodsJsonStr += "]";
    console.log("isNeedLogistics:" + isNeedLogistics);
    console.log("allGoodsPrice:" + parseFloat(allGoodsPrice.toFixed(2)));
    console.log("goodsJsonStr:" + goodsJsonStr);
    console.log("yunPrice:" + that.data.yunPrice);
    that.setData({
      isNeedLogistics: isNeedLogistics,
      allGoodsPrice: parseFloat(allGoodsPrice.toFixed(2)),
      allGoodsAndYunPrice: parseFloat((allGoodsPrice + that.data.yunPrice).toFixed(2)),
      yunPrice: that.data.yunPrice,
      goodsJsonStr: goodsJsonStr
    });
    that.getMyCoupons();
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
  },
  getMyCoupons: function () {
    var that = this;
    wx.request({
      url: 'https://api.it120.cc/' + app.globalData.subDomain + '/discounts/my',
      data: {
        token: app.globalData.token,
        status:0
      },
      success: function (res) {
        if (res.data.code == 0) {
          var coupons = res.data.data.filter(entity => {
            return entity.moneyHreshold <= that.data.allGoodsAndYunPrice;
          });
          if (coupons.length > 0) {
            that.setData({
              hasNoCoupons: false,
              coupons: coupons
            });
          }
        }
      }
    })
  },
  bindChangeCoupon: function (e) {
    const selIndex = e.detail.value[0] - 1;
    if (selIndex == -1) {
      this.setData({
        youhuijine: 0,
        curCoupon:null
      });
      return;
    }
    console.log("selIndex:" + selIndex);
    this.setData({
      youhuijine: this.data.coupons[selIndex].money,
      curCoupon: this.data.coupons[selIndex]
    });
  }
})
