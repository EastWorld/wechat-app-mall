//index.js
//获取应用实例
var app = getApp()

Page({
  data: {
    goodsList:[
      {
        id:"aa",
        pic:"/images/goods01.png",
        name:"爱马仕（HERMES）大地男士最多两行文字超出就这样显…",
        label:"大地50ml",
        price:"400.00",
        goodNum:2
      },
      {
        id:"aa",
        pic:"/images/goods01.png",
        name:"爱马仕（HERMES）大地男士最多两行文字超出就这样显…",
        label:"大地50ml",
        price:"400.00",
        goodNum:2
      },
    ],
    allGoodsPrice:"",
    yunPrice:10.00
  },

 
  onLoad: function (e) {
    console.log('onLoad');
    var list = this.data.goodsList;
    var allPrice = 0;
    for(var i = 0;i<list.length;i++){
      allPrice+= parseFloat(list[i].price)*list[i].goodNum;
    }
     this.setData({
        allGoodsPrice:allPrice
      });
  }
})
