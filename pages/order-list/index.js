var app = getApp()
Page({
  data:{
    statusType:["全部","待付款","待发货","待收货","已完成"],
    currentTpye:0,
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
     this.setData({
      currentTpye:curType
    });
  },
  cancelOrderTap:function(){
     wx.showModal({
      title: '确定要取消该订单吗？',
      content: '',
      success: function(res) {
        if (res.confirm) {
          console.log('用户点击确定')
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  toPayTap:function(){
    console.log("去支付");
  },
  onLoad:function(options){
    // 生命周期函数--监听页面加载
   
  },
  onReady:function(){
    // 生命周期函数--监听页面初次渲染完成
 
  },
  onShow:function(){
    // 生命周期函数--监听页面显示
    
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
  
  },
  onShareAppMessage: function() {
    // 用户点击右上角分享
    return {
      title: 'title', // 分享标题
      desc: 'desc', // 分享描述
      path: 'path' // 分享路径
    }
  }
})