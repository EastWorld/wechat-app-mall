const app = getApp()
const CONFIG = require('../../config.js')
const WXAPI = require('apifm-wxapi')
const AUTH = require('../../utils/auth')
const wxpay = require('../../utils/pay.js')

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
  data: {
    totalScoreToPay: 0,
    goodsList: [],
    isNeedLogistics: 0, // 是否需要物流信息
    yunPrice: 0,
    allGoodsAndYunPrice: 0,
    goodsJsonStr: "",
    orderType: "", //订单类型，购物车下单或立即支付下单，默认是购物车， buyNow 说明是立即购买 
    pingtuanOpenId: undefined, //拼团的话记录团号

    hasNoCoupons: true,
    coupons: [],
    couponAmount: 0, //优惠券金额
    curCoupon: null, // 当前选择使用的优惠券
    curCouponShowText: '请选择使用优惠券', // 当前选择使用的优惠券
    peisongType: 'kd', // 配送方式 kd,zq 分别表示快递/到店自取
    remark: '',
    shopIndex: -1,
    pageIsEnd: false,


    bindMobileStatus: 0, // 0 未判断 1 已绑定手机号码 2 未绑定手机号码
    userScore: 0, // 用户可用积分
    deductionScore: '0', // 本次交易抵扣的积分数
    shopCarType: 0, //0自营购物车，1云货架购物车
    dyopen: 0, // 是否开启订阅
    dyunit: 0, // 按天
    dyduration: 1, // 订阅间隔
    dytimes: 1, // 订阅次数
    dateStart: undefined, // 订阅首次扣费时间
    minDate: new Date().getTime(),
    maxDate: new Date(2030, 10, 1).getTime(),
    currentDate: new Date().getTime(),
    formatter: (type, value) => {
      if (type === 'year') {
        return `${value}年`;
      } 
      if (type === 'month') {
        return `${value}月`;
      }
      if (type === 'day') {
        return `${value}日`;
      }
      if (type === 'hour') {
        return `${value}点`;
      }
      if (type === 'minute') {
        return `${value}分`;
      }
      return value;
    },
  },
  onShow() {
    if (this.data.pageIsEnd) {
      return
    }
    AUTH.checkHasLogined().then(isLogined => {
      if (isLogined) {
        this.doneShow()
      } else {
        AUTH.authorize().then(res => {
          AUTH.bindSeller()
          this.doneShow()
        })
      }
    })
    AUTH.wxaCode().then(code => {
      this.data.code = code
    })
  },
  async doneShow() {
    let goodsList = []
    let shopList = []
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
      if (this.data.shopCarType == 0) {//自营购物车
        var res = await WXAPI.shippingCarInfo(token)
        shopList = res.data.shopList
      } else if (this.data.shopCarType == 1) {//云货架购物车
        var res = await WXAPI.jdvopCartInfo(token)
      }
      if (res.code == 0) {
        goodsList = res.data.items.filter(ele => {
          return ele.selected
        })
        const shopIds = []
        goodsList.forEach(ele => {
          shopIds.push(ele.shopId)
        })
        shopList = shopList.filter(ele => {
          return shopIds.includes(ele.id)
        })
      }
    }
    this.setData({
      shopList,
      goodsList,
      peisongType: this.data.peisongType
    });
    this.initShippingAddress()
    this.userAmount()
  },

  onLoad(e) {
    const nowDate = new Date();
    let _data = {
      isNeedLogistics: 1,
      dateStart: nowDate.format('yyyy-MM-dd h:m:s'),
      orderPeriod_open: wx.getStorageSync('orderPeriod_open'),
      order_pay_user_balance: wx.getStorageSync('order_pay_user_balance')
    }
    if (e.orderType) {
      _data.orderType = e.orderType
    }
    if (e.pingtuanOpenId) {
      _data.pingtuanOpenId = e.pingtuanOpenId
    }
    if (e.shopCarType) {
      _data.shopCarType = e.shopCarType
    }
    this.setData(_data)
    this.getUserApiInfo()
  },
  async userAmount() {
    const res = await WXAPI.userAmount(wx.getStorageSync('token'))
    const order_pay_user_balance = wx.getStorageSync('order_pay_user_balance')
    if (res.code == 0) {
      this.setData({
        balance: order_pay_user_balance == '1' ? res.data.balance : 0,
        userScore: res.data.score
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
  remarkChange(e) {
    this.data.remark = e.detail.value
  },
  async goCreateOrder() {
    // 检测实名认证状态
    if (wx.getStorageSync('needIdCheck') == 1) {
      const res = await WXAPI.userDetail(wx.getStorageSync('token'))
      if (res.code == 0 && !res.data.base.isIdcardCheck) {
        wx.navigateTo({
          url: '/pages/idCheck/index',
        })
        return
      }
    }
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
  async createOrder(e) {
    // shopCarType: 0 //0自营购物车，1云货架购物车
    const loginToken = wx.getStorageSync('token') // 用户登录 token
    const postData = {
      token: loginToken,
      goodsJsonStr: this.data.goodsJsonStr,
      remark: this.data.remark,
      peisongType: this.data.peisongType,
      deductionScore: this.data.deductionScore,
      goodsType: this.data.shopCarType
    }
    if (this.data.dyopen == 1) {
      const orderPeriod = {
        unit: this.data.dyunit,
        duration: this.data.dyduration,
        dateStart: this.data.dateStart,
        times: this.data.dytimes,
        autoPay: true
      }
      postData.orderPeriod = JSON.stringify(orderPeriod)
    }
    if (this.data.kjId) {
      postData.kjid = this.data.kjId
    }
    if (this.data.pingtuanOpenId) {
      postData.pingtuanOpenId = this.data.pingtuanOpenId
    }
    if (postData.peisongType == 'kd' && this.data.curAddressData && this.data.curAddressData.provinceId) {
      postData.provinceId = this.data.curAddressData.provinceId;
    }
    if (postData.peisongType == 'kd' && this.data.curAddressData && this.data.curAddressData.cityId) {
      postData.cityId = this.data.curAddressData.cityId;
    }
    if (postData.peisongType == 'kd' && this.data.curAddressData && this.data.curAddressData.districtId) {
      postData.districtId = this.data.curAddressData.districtId;
    }
    if (postData.peisongType == 'kd' && this.data.curAddressData && this.data.curAddressData.streetId) {
      postData.streetId = this.data.curAddressData.streetId;
    }
    if (this.data.shopCarType == 1) {
      // vop 需要地址来计算运费
      postData.address = this.data.curAddressData.address;
      postData.linkMan = this.data.curAddressData.linkMan;
      postData.mobile = this.data.curAddressData.mobile;
      postData.code = this.data.curAddressData.code;
    }
    if (e && this.data.isNeedLogistics > 0 && postData.peisongType == 'kd') {
      if (!this.data.curAddressData) {
        wx.hideLoading();
        wx.showToast({
          title: '请设置收货地址',
          icon: 'none'
        })
        return;
      }
      if (postData.peisongType == 'kd') {
        postData.address = this.data.curAddressData.address;
        postData.linkMan = this.data.curAddressData.linkMan;
        postData.mobile = this.data.curAddressData.mobile;
        postData.code = this.data.curAddressData.code;
      }
    }
    if (this.data.curCoupon) {
      postData.couponId = this.data.curCoupon.id;
    }
    if (!e) {
      postData.calculate = "true";
    } else {
      if (postData.peisongType == 'zq' && this.data.shops && this.data.shopIndex == -1) {
        wx.showToast({
          title: '请选择自提门店',
          icon: 'none'
        })
        return;
      }
      const extJsonStr = {}
      if (postData.peisongType == 'zq') {
        if (!this.data.name) {
          wx.showToast({
            title: '请填写联系人',
            icon: 'none'
          })
          return;
        }
        if (!this.data.mobile) {
          wx.showToast({
            title: '请填写联系电话',
            icon: 'none'
          })
          return;
        }
        extJsonStr['联系人'] = this.data.name
        extJsonStr['联系电话'] = this.data.mobile
      }
      if (postData.peisongType == 'zq' && this.data.shops) {
        postData.shopIdZt = this.data.shops[this.data.shopIndex].id
        postData.shopNameZt = this.data.shops[this.data.shopIndex].name
      }
      postData.extJsonStr = JSON.stringify(extJsonStr)
    }
    const shopList = this.data.shopList
    let totalRes = {
      code: 0,
      msg: 'success',
      data: {
        score: 0,
        amountReal: 0,
        orderIds: []
      }
    }
    if (shopList && shopList.length > 1) {
      // 多门店的商品下单
      let totalScoreToPay = 0
      let isNeedLogistics = false
      let allGoodsAndYunPrice = 0
      let yunPrice = 0
      let deductionMoney = 0
      let couponAmount = 0
      for (let index = 0; index < shopList.length; index++) {
        const curShop = shopList[index]
        postData.filterShopId = curShop.id
        if (curShop.curCoupon) {
          postData.couponId = curShop.curCoupon.id
        } else {
          postData.couponId = ''
        }
        const res = await WXAPI.orderCreate(postData)
        this.data.pageIsEnd = true
        if (res.code != 0) {
          this.data.pageIsEnd = false
          wx.showModal({
            title: '错误',
            content: res.msg,
            showCancel: false
          })
          return;
        }
        totalRes.data.score += res.data.score
        totalRes.data.amountReal += res.data.amountReal
        totalRes.data.orderIds.push(res.data.id)
        if (!e) {
          curShop.hasNoCoupons = true
          if (res.data.couponUserList) {
            curShop.hasNoCoupons = false
            res.data.couponUserList.forEach(ele => {
              let moneyUnit = '元'
              if (ele.moneyType == 1) {
                moneyUnit = '%'
              }
              if (ele.moneyHreshold) {
                ele.nameExt = ele.name + ' [面值' + ele.money + moneyUnit + '，满' + ele.moneyHreshold + '元可用]'
              } else {
                ele.nameExt = ele.name + ' [面值' + ele.money + moneyUnit + ']'
              }
            })
            curShop.curCouponShowText = '请选择使用优惠券'
            curShop.coupons = res.data.couponUserList
            if (res.data.couponId && res.data.couponId.length > 0) {
              curShop.curCoupon = curShop.coupons.find(ele => { return ele.id == res.data.couponId[0] })
              curShop.curCouponShowText = curShop.curCoupon.nameExt
            }
          }
          shopList.splice(index, 1, curShop)
          // 计算积分抵扣规则 userScore
          let scoreDeductionRules = res.data.scoreDeductionRules
          if (scoreDeductionRules) {
            // 如果可叠加，计算可抵扣的最大积分数
            scoreDeductionRules.forEach(ele => {
              if (ele.loop) {
                let loopTimes = Math.floor(this.data.userScore / ele.score) // 按剩余积分取最大
                let loopTimesMax = Math.floor((res.data.amountTotle + res.data.deductionMoney) / ele.money) // 按金额取最大
                if (loopTimes > loopTimesMax) {
                  loopTimes = loopTimesMax
                }
                ele.score = ele.score * loopTimes
                ele.money = ele.money * loopTimes
              }
            })
            // 剔除积分数为0的情况
            scoreDeductionRules = scoreDeductionRules.filter(ele => {
              return ele.score > 0
            })
            curShop.scoreDeductionRules = scoreDeductionRules
            shopList.splice(index, 1, curShop)
          }
          totalScoreToPay += res.data.score
          if (res.data.isNeedLogistics) {
            isNeedLogistics = true
          }
          allGoodsAndYunPrice += res.data.amountReal
          yunPrice += res.data.amountLogistics
          deductionMoney += res.data.deductionMoney
          couponAmount += res.data.couponAmount
        }
      }
      this.setData({
        shopList,
        totalScoreToPay,
        isNeedLogistics,
        allGoodsAndYunPrice,
        yunPrice,
        hasNoCoupons: true,
        deductionMoney,
        couponAmount
      });
    } else {
      // 单门店单商品下单
      const res = await WXAPI.orderCreate(postData)
      this.data.pageIsEnd = true
      if (res.code != 0) {
        this.data.pageIsEnd = false
        wx.showModal({
          title: '错误',
          content: res.msg,
          showCancel: false
        })
        return;
      }
      totalRes = res
      if (!e) {
        let hasNoCoupons = true
        let coupons = null
        if (res.data.couponUserList) {
          hasNoCoupons = false
          res.data.couponUserList.forEach(ele => {
            let moneyUnit = '元'
            if (ele.moneyType == 1) {
              moneyUnit = '%'
            }
            if (ele.moneyHreshold) {
              ele.nameExt = ele.name + ' [面值' + ele.money + moneyUnit + '，满' + ele.moneyHreshold + '元可用]'
            } else {
              ele.nameExt = ele.name + ' [面值' + ele.money + moneyUnit + ']'
            }
          })
          coupons = res.data.couponUserList
        }
        // 计算积分抵扣规则 userScore
        let scoreDeductionRules = res.data.scoreDeductionRules
        if (scoreDeductionRules) {
          // 如果可叠加，计算可抵扣的最大积分数
          scoreDeductionRules.forEach(ele => {
            if (ele.loop) {
              let loopTimes = Math.floor(this.data.userScore / ele.score) // 按剩余积分取最大
              let loopTimesMax = Math.floor((res.data.amountTotle + res.data.deductionMoney) / ele.money) // 按金额取最大
              if (loopTimes > loopTimesMax) {
                loopTimes = loopTimesMax
              }
              ele.score = ele.score * loopTimes
              ele.money = ele.money * loopTimes
            }
          })
          // 剔除积分数为0的情况
          scoreDeductionRules = scoreDeductionRules.filter(ele => {
            return ele.score > 0
          })
        }
        this.setData({
          totalScoreToPay: res.data.score,
          isNeedLogistics: res.data.isNeedLogistics,
          allGoodsAndYunPrice: res.data.amountReal,
          yunPrice: res.data.amountLogistics,
          hasNoCoupons,
          coupons,
          deductionMoney: res.data.deductionMoney,
          couponAmount: res.data.couponAmount,
          scoreDeductionRules
        })
      }
    }
    if (!e) {
      this.data.pageIsEnd = false
      return
    }
    if (e && "buyNow" != this.data.orderType) {
      // 清空购物车数据
      const keyArrays = []
      this.data.goodsList.forEach(ele => {
        keyArrays.push(ele.key)
      })
      if (this.data.shopCarType == 0) { //自营购物车
        WXAPI.shippingCarInfoRemoveItem(loginToken, keyArrays.join())
      } else if (this.data.shopCarType == 1) {//云货架购物车
        WXAPI.jdvopCartRemove(loginToken, keyArrays.join())
      }
    }
    this.processAfterCreateOrder(totalRes)
  },
  async processAfterCreateOrder(res) {
    let orderId = ''
    if (res.data.orderIds && res.data.orderIds.length > 0) {
      orderId = res.data.orderIds.join()
    } else {
      orderId = res.data.id
    }
    // 直接弹出支付，取消支付的话，去订单列表
    const balance = this.data.balance
    const userScore = this.data.userScore
    if (userScore < res.data.score) {
      wx.showModal({
        title: '提示',
        content: '您当前可用积分不足，请稍后前往订单管理进行支付',
        showCancel: false,
        success: res2 => {
          wx.redirectTo({
            url: "/pages/order-list/index"
          })
        }
      })
      return
    }
    if (balance || res.data.amountReal * 1 == 0) {
      // 有余额
      const money = (res.data.amountReal * 1 - balance * 1).toFixed(2)
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
              WXAPI.orderPay(wx.getStorageSync('token'), orderId).then(res3 => {
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
              wxpay.wxpay('order', money, orderId, "/pages/order-list/index");
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
      wxpay.wxpay('order', res.data.amountReal, orderId, "/pages/order-list/index");
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
    if (this.data.shopCarType == 1) {
      // vop 商品必须快递
      isNeedLogistics = 1
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
      curCoupon: this.data.coupons[selIndex],
      curCouponShowText: this.data.coupons[selIndex].nameExt
    });
    this.processYunfei()
  },
  bindChangeCouponShop: function (e) {
    const selIndex = e.detail.value;
    const shopIndex = e.currentTarget.dataset.sidx
    const shopList = this.data.shopList
    const curshop = shopList[shopIndex]
    curshop.curCoupon = curshop.coupons[selIndex]
    curshop.curCouponShowText = curshop.coupons[selIndex].nameExt
    shopList.splice(shopIndex, 1, curshop)
    this.setData({
      shopList
    });
    this.processYunfei()
  },
  radioChange(e) {
    this.setData({
      peisongType: e.detail.value
    })
    this.processYunfei()
    if (e.detail.value == 'zq') {
      this.fetchShops()
    }
  },
  dyChange(e) {
    this.setData({
      dyopen: e.detail.value
    })
  },
  dyunitChange(e) {
    this.setData({
      dyunit: e.detail.value
    })
  },
  cancelLogin() {
    wx.navigateBack()
  },
  async fetchShops() {
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
  async getUserApiInfo() {
    const res = await WXAPI.userDetail(wx.getStorageSync('token'))
    if (res.code == 0) {
      this.setData({
        bindMobileStatus: res.data.base.mobile ? 1 : 2, // 账户绑定的手机号码状态
        mobile: res.data.base.mobile,
      })
    }
  },
  async getPhoneNumber(e) {
    if (!e.detail.errMsg || e.detail.errMsg != "getPhoneNumber:ok") {
      wx.showToast({
        title: e.detail.errMsg,
        icon: 'none'
      })
      return;
    }
    let res
    const extConfigSync = wx.getExtConfigSync()
    if (extConfigSync.subDomain) {
      // 服务商模式
      res = await WXAPI.wxappServiceBindMobile({
        token: wx.getStorageSync('token'),
        code: this.data.code,
        encryptedData: e.detail.encryptedData,
        iv: e.detail.iv,
      })
    } else {
      res = await WXAPI.bindMobileWxapp(wx.getStorageSync('token'), this.data.code, e.detail.encryptedData, e.detail.iv)
    }
    AUTH.wxaCode().then(code => {
      this.data.code = code
    })
    if (res.code == 0) {
      wx.showToast({
        title: '读取成功',
        icon: 'success'
      })
      this.setData({
        mobile: res.data,
        bindMobileStatus: 1
      })
    } else {
      wx.showToast({
        title: res.msg,
        icon: 'none'
      })
    }
  },
  deductionScoreChange(event) {
    this.setData({
      deductionScore: event.detail,
    })
    this.processYunfei()
  },
  deductionScoreClick(event) {
    const {
      name
    } = event.currentTarget.dataset;
    this.setData({
      deductionScore: name,
    })
    this.processYunfei()
  },
  dateStartclick(e) {
    this.setData({
      dateStartpop: true
    })
  },
  dateStartconfirm(e) {
    const d = new Date(e.detail)
    this.setData({
      dateStart: d.format('yyyy-MM-dd h:m:s'),
      dateStartpop: false
    })
    console.log(e);
  },
  dateStartcancel(e) {
    this.setData({
      dateStartpop: false
    })
  }
})