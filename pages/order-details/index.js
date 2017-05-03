var app = getApp();
Page({
    data:{
        status:0,
        haveWuliu:true,
        goodsList:[
            {
                pic:'/images/goods02.png',
                name:'爱马仕（HERMES）大地男士最多两行文字超出就这样显…',
                price:'300.00',
                label:'大地50ml',
                number:2
            },
            {
                pic:'/images/goods02.png',
                name:'爱马仕（HERMES）大地男士最多两行文字超出就这样显…',
                price:'300.00',
                label:'大地50ml',
                number:2
            }
        ],
        yunPrice:"10.00"
    },
    onLoad:function(e){
        var yunPrice = parseFloat(this.data.yunPrice);
        var allprice = 0;
        var goodsList = this.data.goodsList;
        for(var i =0 ;i < goodsList.length;i++){
            allprice += parseFloat(goodsList[0].price)*goodsList[0].number;
        }
        this.setData({
            allGoodsPrice:allprice,
            yunPrice:yunPrice
       });
    },
    wuliuDetailsTap:function(){
        wx.navigateTo({
                url:"/pages/wuliu/index"
        })
    },
    confirmBtnTap:function(e){
        wx.showModal({
            title: '确认您已收到商品？',
            content: '',
            success: function(res) {
                if (res.confirm) {
                console.log('用户点击确定')
                } else if (res.cancel) {
                console.log('用户点击取消')
                }
            }
        })
    }
})