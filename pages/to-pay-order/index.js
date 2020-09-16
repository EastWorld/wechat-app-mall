const app = getApp()
const WXAPI = require('apifm-wxapi')
const AUTH = require('../../utils/auth')
const wxpay = require('../../utils/pay.js')

Page({
  data: {
    wxlogin: true,

    totalScoreToPay: 0,
    goodsList: [],
    isNeedLogistics: 0, // 是否需要物流信息
    allGoodsPrice: 0,
    yunPrice: 0,
    allGoodsAndYunPrice: 0,
    goodsJsonStr: "",
    orderType: "", //订单类型，购物车下单或立即支付下单，默认是购物车，
    pingtuanOpenId: undefined, //拼团的话记录团号

    hasNoCoupons: true,
    coupons: [],
    youhuijine: 0, //优惠券金额
    curCoupon: null, // 当前选择使用的优惠券
    curCouponShowText: '请选择使用优惠券', // 当前选择使用的优惠券
    peisongType: 'kd', // 配送方式 kd,zq 分别表示快递/到店自取
    remark: '',
    shopIndex: -1,
    pageIsEnd: false
  },
  onShow(){
    if (this.data.pageIsEnd) {
      return
    }
    AUTH.checkHasLogined().then(isLogined => {
      this.setData({
        wxlogin: isLogined
      })
      if (isLogined) {
        this.doneShow()
      }
    })
  },
  async doneShow() {
    let goodsList = [];
    const token = wx.getStorageSync('token')
    //立即购买下单
    if ("buyNow" == this.data.orderType) {
      var buyNowInfoMem = wx.getStorageSync('buyNowInfo');
      this.data.kjId = buyNowInfoMem.kjId;
      if (buyNowInfoMem && buyNowInfoMem.shopList) {
        goodsList = buyNowInfoMem.shopList
      }
    } else {
      //购物车下单
      const res = await WXAPI.shippingCarInfo(token)
      if (res.code == 0) {
        goodsList = res.data.items
      }
    }
    this.setData({
      goodsList,
      peisongType: this.data.peisongType
    });
    this.initShippingAddress()
    this.userAmount()
  },

  onLoad(e) {
    let _data = {
      isNeedLogistics: 1
    }
    if (e.orderType) {
      _data.orderType = e.orderType
    }
    if (e.pingtuanOpenId) {
      _data.pingtuanOpenId = e.pingtuanOpenId
    }
    this.setData(_data);
  },
  async userAmount() {
    const res = await WXAPI.userAmount(wx.getStorageSync('token'))
    if (res.code == 0) {
      this.setData({
        balance: res.data.balance
      })
    }
  },
  getDistrictId: function (obj, aaa) {
    if (!obj) {
      return "";
    }
    if (!aaa) {
      return "";
    }
    return aaa;
  },
  remarkChange(e){
    this.data.remark = e.detail.value
  },
  goCreateOrder(){
    const subscribe_ids = wx.getStorageSync('subscribe_ids')
    if (subscribe_ids) {
      wx.requestSubscribeMessage({
        tmplIds: subscribe_ids.split(','),
        success(res) {
          
        },
        fail(e) {
          console.error(e)
        },
        complete: (e) => {
          this.createOrder(true)
        },
      })
    } else {
      this.createOrder(true)
    }    
  },
  createOrder: function (e) {
    var that = this;
    var loginToken = wx.getStorageSync('token') // 用户登录 token
    var remark = this.data.remark; // 备注信息

    let postData = {
      token: loginToken,
      goodsJsonStr: that.data.goodsJsonStr,
      remark: remark,
      peisongType: that.data.peisongType
    };
    if (that.data.kjId) {
      postData.kjid = that.data.kjId
    }
    if (that.data.pingtuanOpenId) {
      postData.pingtuanOpenId = that.data.pingtuanOpenId
    }
    if (postData.peisongType == 'kd' && that.data.curAddressData && that.data.curAddressData.provinceId) {
      postData.provinceId = that.data.curAddressData.provinceId;
    }
    if (postData.peisongType == 'kd' && that.data.curAddressData && that.data.curAddressData.cityId) {
      postData.cityId = that.data.curAddressData.cityId;
    }
    if (postData.peisongType == 'kd' && that.data.curAddressData && that.data.curAddressData.districtId) {
      postData.districtId = that.data.curAddressData.districtId;
    }
    if (e && that.data.isNeedLogistics > 0 && postData.peisongType == 'kd') {
      if (!that.data.curAddressData) {
        wx.hideLoading();
        wx.showToast({
          title: '请设置收货地址',
          icon: 'none'
        })
        return;
      }
      if (postData.peisongType == 'kd') {
        postData.address = that.data.curAddressData.address;
        postData.linkMan = that.data.curAddressData.linkMan;
        postData.mobile = that.data.curAddressData.mobile;
        postData.code = that.data.curAddressData.code;
      }      
    }
    if (that.data.curCoupon) {
      postData.couponId = that.data.curCoupon.id;
    }
    if (!e) {
      postData.calculate = "true";
    } else {
      if(postData.peisongType == 'zq' && this.data.shops && this.data.shopIndex == -1) {
        wx.showToast({
          title: '请选择自提门店',
          icon: 'none'
        })
        return;
      }
      if(postData.peisongType == 'zq' && this.data.shops) {
        postData.shopIdZt = this.data.shops[this.data.shopIndex].id
        postData.shopNameZt = this.data.shops[this.data.shopIndex].name
      }
    }

    WXAPI.orderCreate(postData).then(function (res) {
      that.data.pageIsEnd = true
      if (res.code != 0) {
        that.data.pageIsEnd = false
        wx.showModal({
          title: '错误',
          content: res.msg,
          showCancel: false
        })
        return;
      }

      if (e && "buyNow" != that.data.orderType) {
        // 清空购物车数据
        WXAPI.shippingCarInfoRemoveAll(loginToken)
      }
      if (!e) {
        let hasNoCoupons = true
        let coupons = null
        if (res.data.couponUserList) {
          hasNoCoupons = false
          res.data.couponUserList.forEach(ele => {
            ele.nameExt = ele.name + ' [满' + ele.moneyHreshold + '元可减' + ele.money + '元]'
          })
          coupons = res.data.couponUserList
        }
        
        that.setData({
          totalScoreToPay: res.data.score,
          isNeedLogistics: res.data.isNeedLogistics,
          allGoodsPrice: res.data.amountTotle,
          allGoodsAndYunPrice: res.data.amountReal,
          yunPrice: res.data.amountLogistics,
          hasNoCoupons,
          coupons
        });
        that.data.pageIsEnd = false
        return;
      }
      that.processAfterCreateOrder(res)
    })
  },
  async processAfterCreateOrder(res) {
    // 直接弹出支付，取消支付的话，去订单列表
    const balance = this.data.balance
    if (balance || res.data.amountReal*1 == 0) {
      // 有余额
      const money = res.data.amountReal * 1 - balance*1
      if (money <= 0) {
        // 余额足够
        wx.showModal({
          title: '请确认支付',
          content: `您当前可用余额¥${balance}，使用余额支付¥${res.data.amountReal}？`,
          confirmText: "确认支付",
          cancelText: "暂不付款",
          success: res2 => {
            if (res2.confirm) {
              // 使用余额支付
              WXAPI.orderPay(wx.getStorageSync('token'), res.data.id).then(res3 => {
                if (res3.code != 0) {
                  wx.showToast({
                    title: res3.msg,
                    icon: 'none'
                  })
                  return
                }
                wx.redirectTo({
                  url: "/pages/order-list/index"
                })
              })
            } else {
              wx.redirectTo({
                url: "/pages/order-list/index"
              })
            }
          }
        })
      } else {
        // 余额不够
        wx.showModal({
          title: '请确认支付',
          content: `您当前可用余额¥${balance}，仍需支付¥${money}`,
          confirmText: "确认支付",
          cancelText: "暂不付款",
          success: res2 => {
            if (res2.confirm) {
              // 使用余额支付
              wxpay.wxpay('order', money, res.data.id, "/pages/order-list/index");
            } else {
              wx.redirectTo({
                url: "/pages/order-list/index"
              })
            }
          }
        })
      }
    } else {
      // 没余额
      wxpay.wxpay('order', res.data.amountReal, res.data.id, "/pages/order-list/index");
    }
  },
  async initShippingAddress() {
    const res = await WXAPI.defaultAddress(wx.getStorageSync('token'))
    if (res.code == 0) {
      this.setData({
        curAddressData: res.data.info
      });
    } else {
      this.setData({
        curAddressData: null
      });
    }
    this.processYunfei();
  },
  processYunfei() {
    var goodsList = this.data.goodsList
    if (goodsList.length == 0) {
      return
    }
    const goodsJsonStr = []
    var isNeedLogistics = 0;

    let inviter_id = 0;
    let inviter_id_storge = wx.getStorageSync('referrer');
    if (inviter_id_storge) {
      inviter_id = inviter_id_storge;
    }
    for (let i = 0; i < goodsList.length; i++) {
      let carShopBean = goodsList[i];
      if (carShopBean.logistics || carShopBean.logisticsId) {
        isNeedLogistics = 1;
      }

      const _goodsJsonStr = {
        propertyChildIds: carShopBean.propertyChildIds
      }
      if (carShopBean.sku && carShopBean.sku.length > 0) {
        let propertyChildIds = ''
        carShopBean.sku.forEach(option => {
          propertyChildIds = propertyChildIds + ',' + option.optionId + ':' + option.optionValueId
        })
        _goodsJsonStr.propertyChildIds = propertyChildIds
      }
      if (carShopBean.additions && carShopBean.additions.length > 0) {
        let goodsAdditionList = []
        carShopBean.additions.forEach(option => {
          goodsAdditionList.push({
            pid: option.pid,
            id: option.id
          })
        })
        _goodsJsonStr.goodsAdditionList = goodsAdditionList
      }
      _goodsJsonStr.goodsId = carShopBean.goodsId
      _goodsJsonStr.number = carShopBean.number
      _goodsJsonStr.logisticsType = 0
      _goodsJsonStr.inviter_id = inviter_id
      goodsJsonStr.push(_goodsJsonStr)

    }
    this.setData({
      isNeedLogistics: isNeedLogistics,
      goodsJsonStr: JSON.stringify(goodsJsonStr)
    });
    this.createOrder();
  },
  addAddress: function () {
    wx.navigateTo({
      url: "/pages/address-add/index"
    })
  },
  selectAddress: function () {
    wx.navigateTo({
      url: "/pages/select-address/index"
    })
  },
  bindChangeCoupon: function (e) {
    const selIndex = e.detail.value;
    this.setData({
      youhuijine: this.data.coupons[selIndex].money,
      curCoupon: this.data.coupons[selIndex],
      curCouponShowText: this.data.coupons[selIndex].nameExt
    });
  },
  radioChange (e) {
    this.setData({
      peisongType: e.detail.value
    })
    this.processYunfei()
    if (e.detail.value == 'zq') {
      this.fetchShops()
    }
  },
  cancelLogin() {
    wx.navigateBack()
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
  async fetchShops(){
    const res = await WXAPI.fetchShops()
    if (res.code == 0) {
      let shopIndex = this.data.shopIndex
      const shopInfo = wx.getStorageSync('shopInfo')
      if (shopInfo) {
        shopIndex = res.data.findIndex(ele => {
          return ele.id == shopInfo.id
        })
      }
      this.setData({
        shops: res.data,
        shopIndex
      })
    }
  },
  shopSelect(e) {
    this.setData({
      shopIndex: e.detail.value
    })
  },
  goMap() {
    const _this = this
    const shop = this.data.shops[this.data.shopIndex]
    const latitude = shop.latitude
    const longitude = shop.longitude
    wx.openLocation({
      latitude,
      longitude,
      scale: 18
    })
  },
  callMobile() {
    const shop = this.data.shops[this.data.shopIndex]
    wx.makePhoneCall({
      phoneNumber: shop.linkPhone,
    })
  },
})