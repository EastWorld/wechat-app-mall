//index.js
var app = getApp()
Page({
  data: {
    item:{
     
    },
    goodsList:{
      saveHidden:true,
      totalPrice:0,
      allSelect:true,
      noSelect:false,
      list:[
        {
            id:"aa",
            pic:"/images/goods01.png",
            name:"xxxxxxx名称1111",
            label:"尺寸2",
            price:"400.00",
            left: "",
            active:true,
            inputNumber:2
        },
        {
            id:"bb",
            pic:"/images/goods01.png",
            name:"xxxxxxx名称2222",
            label:"尺寸2",
            price:"400.00",
            left: "",
            active:true,
            inputNumber:2
        },
        {
            id:"cc",
            pic:"/images/goods01.png",
            name:"xxxxxxx名称3333",
            label:"尺寸2",
            price:"400.00",
            left: "",
            active:true,
            inputNumber:2
        },
        {
            id:"dd",
            pic:"/images/goods01.png",
            name:"xxxxxxx名称4444",
            label:"尺寸2",
            price:"400.00",
            left: "",
            active:true,
            inputNumber:2
        }
      
      ]
    },
    delBtnWidth:120,    //删除按钮宽度单位（rpx）
  },
 
 //获取元素自适应后的实际宽度
  getEleWidth:function(w){
    var real = 0;
    try {
      var res = wx.getSystemInfoSync().windowWidth;
      var scale = (750/2)/(w/2);  //以宽度750px设计稿做宽度的自适应
      // console.log(scale);
      real = Math.floor(res/scale);
      return real;
    } catch (e) {
      return false;
     // Do something when catch error
    }
  },
  initEleWidth:function(){
    var delBtnWidth = this.getEleWidth(this.data.delBtnWidth);
    this.setData({
      delBtnWidth:delBtnWidth
    });
  },
  onLoad: function () {
      this.initEleWidth();
      var list = this.data.goodsList.list;
      this.setGoodsList(this.getSaveHide(),this.totalPrice(),this.allSelect(),this.noSelect(),list);
  },
  toIndexPage:function(){
      wx.switchTab({
            url: "/pages/index/index"
      });
  },

  touchS:function(e){
    if(e.touches.length==1){
      this.setData({
        startX:e.touches[0].clientX
      });
    }
  },
  touchM:function(e){
  var index = e.currentTarget.dataset.index;

    if(e.touches.length==1){
      var moveX = e.touches[0].clientX;
      var disX = this.data.startX - moveX;
      var delBtnWidth = this.data.delBtnWidth;
      var left = "";
      if(disX == 0 || disX < 0){//如果移动距离小于等于0，container位置不变
        left = "margin-left:0px";
      }else if(disX > 0 ){//移动距离大于0，container left值等于手指移动距离
        left = "margin-left:-"+disX+"px";
        if(disX>=delBtnWidth){
          left = "left:-"+delBtnWidth+"px";
        }
      }
      var list = this.data.goodsList.list;
      if(index!="" && index !=null){
        list[parseInt(index)].left = left; 
        this.setGoodsList(this.getSaveHide(),this.totalPrice(),this.allSelect(),this.noSelect(),list);
      }
    }
  },

  touchE:function(e){
    var index = e.currentTarget.dataset.index;    
    if(e.changedTouches.length==1){
      var endX = e.changedTouches[0].clientX;
      var disX = this.data.startX - endX;
      var delBtnWidth = this.data.delBtnWidth;
      //如果距离小于删除按钮的1/2，不显示删除按钮
      var left = disX > delBtnWidth/2 ? "margin-left:-"+delBtnWidth+"px":"margin-left:0px";
      var list = this.data.goodsList.list;
     if(index!=="" && index != null){
        list[parseInt(index)].left = left; 
        this.setGoodsList(this.getSaveHide(),this.totalPrice(),this.allSelect(),this.noSelect(),list);

      }
    }
  },
  delItem:function(e){
    var index = e.currentTarget.dataset.index;
    var list = this.data.goodsList.list;
    list.splice(index,1);
    this.setGoodsList(this.getSaveHide(),this.totalPrice(),this.allSelect(),this.noSelect(),list);
  },
  selectTap:function(e){
    var index = e.currentTarget.dataset.index;
    var list = this.data.goodsList.list;
    if(index!=="" && index != null){
        list[parseInt(index)].active = !list[parseInt(index)].active ; 
        this.setGoodsList(this.getSaveHide(),this.totalPrice(),this.allSelect(),this.noSelect(),list);
      }
   },
   totalPrice:function(){
      var list = this.data.goodsList.list;
      var total = 0;
      for(var i = 0 ; i < list.length ; i++){
          var curItem = list[i];
          if(curItem.active){
            total+= parseFloat(curItem.price)*curItem.inputNumber;
          }
      }
      return total;
   },
   allSelect:function(){
      var list = this.data.goodsList.list;
      var allSelect = false;
      for(var i = 0 ; i < list.length ; i++){
          var curItem = list[i];
          if(curItem.active){
            allSelect = true;
          }else{
             allSelect = false;
             break;
          }
      }
      return allSelect;
   },
   noSelect:function(){
      var list = this.data.goodsList.list;
      var noSelect = 0;
      for(var i = 0 ; i < list.length ; i++){
          var curItem = list[i];
          if(!curItem.active){
            noSelect++;
          }
      }
      if(noSelect == list.length){
         return true;
      }else{
        return false;
      }
   },
   setGoodsList:function(saveHidden,total,allSelect,noSelect,list){
      this.setData({
          goodsList:{
            saveHidden:saveHidden,
            totalPrice:total,
            allSelect:allSelect,
            noSelect:noSelect,
            list:list
          }
        });
   },
   bindAllSelect:function(){
      var currentAllSelect = this.data.goodsList.allSelect;
      var list = this.data.goodsList.list;
      if(currentAllSelect){
        for(var i = 0 ; i < list.length ; i++){
            var curItem = list[i];
            curItem.active = false;
        }
      }else{
        for(var i = 0 ; i < list.length ; i++){
            var curItem = list[i];
            curItem.active = true;
        }
      }
     
      this.setGoodsList(this.getSaveHide(),this.totalPrice(),!currentAllSelect,this.noSelect(),list);
   },
   jiaBtnTap:function(e){
    var index = e.currentTarget.dataset.index;
    var list = this.data.goodsList.list;
    if(index!=="" && index != null){
      if(list[parseInt(index)].inputNumber<10){
        list[parseInt(index)].inputNumber++; 
        this.setGoodsList(this.getSaveHide(),this.totalPrice(),this.allSelect(),this.noSelect(),list);
      }
    }
   },
   jianBtnTap:function(e){
    var index = e.currentTarget.dataset.index;
    var list = this.data.goodsList.list;
    if(index!=="" && index != null){
      if(list[parseInt(index)].inputNumber>1){
        list[parseInt(index)].inputNumber-- ;
        this.setGoodsList(this.getSaveHide(),this.totalPrice(),this.allSelect(),this.noSelect(),list);
      }
    }
   },
   editTap:function(){
     var list = this.data.goodsList.list;
     for(var i = 0 ; i < list.length ; i++){
            var curItem = list[i];
            curItem.active = false;
     }
     this.setGoodsList(!this.getSaveHide(),this.totalPrice(),this.allSelect(),this.noSelect(),list);
   },
   saveTap:function(){
     var list = this.data.goodsList.list;
     for(var i = 0 ; i < list.length ; i++){
            var curItem = list[i];
            curItem.active = true;
     }
     this.setGoodsList(!this.getSaveHide(),this.totalPrice(),this.allSelect(),this.noSelect(),list);
   },
   getSaveHide:function(){
     var saveHidden = this.data.goodsList.saveHidden;
     return saveHidden;
   },
   deleteSelected:function(){
      var list = this.data.goodsList.list;
      for(var i = 0 ; i < list.length ; i++){
            var curItem = list[i];
            if(curItem.active){
              list.splice(i,1);
            }
      }
     this.setGoodsList(this.getSaveHide(),this.totalPrice(),this.allSelect(),this.noSelect(),list);
    }



})
