var wxpay = require('../../utils/pay.js')
var app = getApp()
Page({
  data:{
    statusType:["全部","待付款","待发货","待收货","已完成"],
    currentTpye:0,
    tabClass: ["", "", "", "", ""],
    orderList:[
      {
        goodsImg:"/images/goods02.png",
        des:"爱马仕（HERMES）大地男士香水大地男士香水大地如果有两行就这样显示超出部分用省…超出部分用省…",
        pics:['/images/goods02.png','/images/goods02.png','/images/goods02.png','/images/goods02.png','/images/goods02.png','/images/goods02.png','/images/goods02.png','/images/goods02.png'],
        price:"300.00",
        orderDate:"2017.03.04 10:33:33",
        orderStatus:"已关闭"
      },
      {
        goodsImg:"/images/goods02.png",
        des:"爱马仕（HERMES）大地男士香水大地男士香水大地如果有两行就这样显示超出部分用省…超出部分用省…",
        pics:['/images/goods02.png','/images/goods02.png','/images/goods02.png','/images/goods02.png'],
        price:"400.00",
        orderDate:"2017.03.05 10:33:33",
        orderStatus:"待付款"
      },
    ]
  },
  statusTap:function(e){
     var curType =  e.currentTarget.dataset.index;
     this.data.currentTpye = curType
     this.setData({
      currentTpye:curType
     });
     this.onShow();
  },
  orderDetail : function (e) {
    var orderId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: "/pages/order-details/index?id=" + orderId
    })
  },
  cancelOrderTap:function(e){
    var that = this;
    var orderId = e.currentTarget.dataset.id;
     wx.showModal({
      title: '确定要取消该订单吗？',
      content: '',
      success: function(res) {
        if (res.confirm) {
          wx.showLoading();
          wx.request({
            url: 'https://api.it120.cc/' + app.globalData.subDomain + '/order/close',
            data: {
              token: app.globalData.token,
              orderId: orderId
            },
            success: (res) => {
              wx.hideLoading();
              if (res.data.code == 0) {
                that.onShow();
              }
            }
          })
        }
      }
    })
  },
  toPayTap:function(e){
    var orderId = e.currentTarget.dataset.id;
    var money = e.currentTarget.dataset.money;
    wxpay.wxpay(app, money, orderId, "/pages/order-list/index");
  },
  onLoad:function(options){
    // 生命周期函数--监听页面加载
   
  },
  onReady:function(){
    // 生命周期函数--监听页面初次渲染完成
 
  },
  onShow:function(){
    // 获取订单列表
    wx.showLoading();
    var that = this;
    var postData = {
      token: app.globalData.token
    };
    if (that.data.currentTpye == 1) {
      postData.status = 0
    }
    if (that.data.currentTpye == 2) {
      postData.status = 1
    }
    if (that.data.currentTpye == 3) {
      postData.status = 2
    }
    if (that.data.currentTpye == 4) {
      postData.status = 4
    }
    wx.request({
      url: 'https://api.it120.cc/' + app.globalData.subDomain + '/order/list',
      data: postData,
      success: (res) => {
        wx.hideLoading();
        if (res.data.code == 0) {
          var tabClass = that.data.tabClass;
          if (that.data.currentTpye == 0) {
            for (var i = 0; i < res.data.data.orderList.length; i++) {
              var order = res.data.data.orderList[i]
              if (order.status == 0) {
                tabClass[1] = "red-dot"
              }
              if (order.status == 1) {
                tabClass[2] = "red-dot"
              }
              if (order.status == 2) {
                tabClass[3] = "red-dot"
              }
              if (order.status == 4) {
                tabClass[4] = "red-dot"
              }
            }
          }
          that.setData({
            tabClass: tabClass,
            orderList: res.data.data.orderList,
            logisticsMap : res.data.data.logisticsMap,
            goodsMap : res.data.data.goodsMap
          });
        } else {
          this.setData({
            orderList: null,
            logisticsMap: {},
            goodsMap: {}
          });
        }
      }
    })
    
  },
  onHide:function(){
    // 生命周期函数--监听页面隐藏
 
  },
  onUnload:function(){
    // 生命周期函数--监听页面卸载
 
  },
  onPullDownRefresh: function() {
    // 页面相关事件处理函数--监听用户下拉动作
   
  },
  onReachBottom: function() {
    // 页面上拉触底事件的处理函数
  
  }
})