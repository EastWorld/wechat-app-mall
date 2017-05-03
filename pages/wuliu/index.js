//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    wuliu:[
      {
        date:'2016-12-25  15:00:22',
        info:'配送员开始配送，请您准备收货，配送员，罗启春手机号，13819935555'
      },
      {
        date:'2016-12-25  15:00:22',
        info:'货物已分配，等待配送'
      },
      {
        date:'2016-12-25  15:00:22',
        info:'货物已到达 上海千阳站'
      }
    ]
  },
  onLoad: function () {
    console.log('onLoad')
  }
})
