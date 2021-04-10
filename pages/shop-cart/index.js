const WXAPI = require('apifm-wxapi')
const TOOLS = require('../../utils/tools.js')
const AUTH = require('../../utils/auth')

const app = getApp()

Page({
  data: {
    shopCarType: 0, //0自营 1云货架
    saveHidden: true,
    allSelect: true,
    delBtnWidth: 120, //删除按钮宽度单位（rpx）
  },

  //获取元素自适应后的实际宽度
  getEleWidth: function (w) {
    var real = 0;
    try {
      var res = wx.getSystemInfoSync().windowWidth
      var scale = (750 / 2) / (w / 2)
      // console.log(scale);
      real = Math.floor(res / scale);
      return real;
    } catch (e) {
      return false;
      // Do something when catch error
    }
  },
  initEleWidth: function () {
    var delBtnWidth = this.getEleWidth(this.data.delBtnWidth);
    this.setData({
      delBtnWidth: delBtnWidth
    });
  },
  onLoad: function () {
    this.initEleWidth();
    this.onShow();
    this.setData({
      shopping_cart_vop_open: wx.getStorageSync('shopping_cart_vop_open')
    })
  },
  onShow: function () {
    this.shippingCarInfo()
  },
  async shippingCarInfo() {
    const token = wx.getStorageSync('token')
    if (!token) {
      return
    }
    if (this.data.shopCarType == 0) { //自营购物车
      var res = await WXAPI.shippingCarInfo(token)
    } else if (this.data.shopCarType == 1) { //云货架购物车
      var res = await WXAPI.jdvopCartInfo(token)
    }
    if (res.code == 0) {
      if (this.data.shopCarType == 0) //自营商品
      {
        res.data.items.forEach(ele => {
          if (!ele.stores || ele.status == 1) {
            ele.selected = false
          }
        })
      }
      this.setData({
        shippingCarInfo: res.data
      })
    } else {
      this.setData({
        shippingCarInfo: null
      })
    }
  },
  toIndexPage: function () {
    wx.switchTab({
      url: "/pages/index/index"
    });
  },

  touchS: function (e) {
    if (e.touches.length == 1) {
      this.setData({
        startX: e.touches[0].clientX
      });
    }
  },
  touchM: function (e) {
    const index = e.currentTarget.dataset.index;
    if (e.touches.length == 1) {
      var moveX = e.touches[0].clientX;
      var disX = this.data.startX - moveX;
      var delBtnWidth = this.data.delBtnWidth;
      var left = "";
      if (disX == 0 || disX < 0) { //如果移动距离小于等于0，container位置不变
        left = "margin-left:0px";
      } else if (disX > 0) { //移动距离大于0，container left值等于手指移动距离
        left = "margin-left:-" + disX + "px";
        if (disX >= delBtnWidth) {
          left = "left:-" + delBtnWidth + "px";
        }
      }
      this.data.shippingCarInfo.items[index].left = left
      this.setData({
        shippingCarInfo: this.data.shippingCarInfo
      })
    }
  },

  touchE: function (e) {
    var index = e.currentTarget.dataset.index;
    if (e.changedTouches.length == 1) {
      var endX = e.changedTouches[0].clientX;
      var disX = this.data.startX - endX;
      var delBtnWidth = this.data.delBtnWidth;
      //如果距离小于删除按钮的1/2，不显示删除按钮
      var left = disX > delBtnWidth / 2 ? "margin-left:-" + delBtnWidth + "px" : "margin-left:0px";
      this.data.shippingCarInfo.items[index].left = left
      this.setData({
        shippingCarInfo: this.data.shippingCarInfo
      })
    }
  },
  async delItem(e) {
    const key = e.currentTarget.dataset.key
    this.delItemDone(key)
  },
  async delItemDone(key) {
    const token = wx.getStorageSync('token')
    if(this.data.shopCarType == 0){
      var res = await WXAPI.shippingCarInfoRemoveItem(token, key)
    }
    if(this.data.shopCarType == 1){
      var res = await WXAPI.jdvopCartRemove(token, key)
    }
    if (res.code != 0 && res.code != 700) {
      wx.showToast({
        title: res.msg,
        icon: 'none'
      })
    } else {
      this.shippingCarInfo()
      TOOLS.showTabBarBadge()
    }
  },
  async jiaBtnTap(e) {
    const index = e.currentTarget.dataset.index;
    const item = this.data.shippingCarInfo.items[index]
    const number = item.number + 1
    const token = wx.getStorageSync('token')
    if(this.data.shopCarType == 0){
      var res = await WXAPI.shippingCarInfoModifyNumber(token, item.key, number)
    }
    else if(this.data.shopCarType == 1){
      var res = await WXAPI.jdvopCartModifyNumber(token, item.key, number)
    }    
    this.shippingCarInfo()
  },
  async jianBtnTap(e) {
    const index = e.currentTarget.dataset.index;
    const item = this.data.shippingCarInfo.items[index]
    const number = item.number - 1
    if (number <= 0) {
      // 弹出删除确认
      wx.showModal({
        content: '确定要删除该商品吗？',
        success: (res) => {
          if (res.confirm) {
            this.delItemDone(item.key)
          }
        }
      })
      return
    }
    const token = wx.getStorageSync('token')
    if(this.data.shopCarType == 0)
    {
      var res = await WXAPI.shippingCarInfoModifyNumber(token, item.key, number)  
    }
    if(this.data.shopCarType == 1)
    {
      var res = await WXAPI.jdvopCartModifyNumber(token, item.key, number)  
    }
    this.shippingCarInfo()
  },
  changeCarNumber(e) {
    const key = e.currentTarget.dataset.key
    const num = e.detail.value
    const token = wx.getStorageSync('token')
    if(this.data.shopCarType == 0){
    WXAPI.shippingCarInfoModifyNumber(token, key, num).then(res => {
      this.shippingCarInfo()
    })}
    else if(this.data.shopCarType == 1){
      WXAPI.jdvopCartModifyNumber(token, key, num).then(res => {
        this.shippingCarInfo()
      })
    }
  },
  async radioClick(e) {
    var index = e.currentTarget.dataset.index;
    var item = this.data.shippingCarInfo.items[index]
    const token = wx.getStorageSync('token')
    if (this.data.shopCarType == 0) { //自营购物车
      if (!item.stores || item.status == 1) {
        return
      }
      var res = await WXAPI.shippingCartSelected(token, item.key, !item.selected)
    } else if (this.data.shopCarType == 1) { //云货架购物车
      var res = await WXAPI.jdvopCartSelect(token, item.key, !item.selected)
    }
    this.shippingCarInfo()
  },
  onChange(event) {
    this.setData({
      shopCarType: event.detail.name
    })
    this.shippingCarInfo()
  }
})