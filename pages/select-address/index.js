//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    addressList:[
        {
            name:"刘先生1",
            tel:"13633224455",
            text:"上塘路97号新华小区10幢2单元702室上塘97号新华小区10幢2单元702室",
            active:true
        },
        {
            name:"刘先生2",
            tel:"13633224455",
            text:"上塘路97号新华小区10幢2单元702室上塘97号新华小区10幢2单元702室",
            active:false
        },
        {
            name:"刘先生3",
            tel:"13633224455",
            text:"上塘路97号新华小区10幢2单元702室上塘97号新华小区10幢2单元702室",
            active:false
        }
    ]
  },

  selectTap: function (e) {
    var index = e.currentTarget.dataset.index;
    var list = this.data.addressList;
     if(index!=="" && index != null){
        var isActive  = list[parseInt(index)].active;
        if(!isActive){
          for(var i = 0 ; i < list.length ; i++){
              var curItem = list[i];
              if(i ==parseInt(index)){
                curItem.active = true;
              }else{
                curItem.active = false
              }
          }
        }
        this.setData({
          addressList: list
        });
      }
  },

  toDetailsTap:function(e){
    
  },
  
  onLoad: function () {
    console.log('onLoad')

   
  },

})
