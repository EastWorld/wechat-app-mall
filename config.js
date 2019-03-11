module.exports = {
  version: "6.3.1",
  note: '优化转发逻辑，商品分享页面增加返回首页图标',
  subDomain: "tz", // 如果你的域名是： https://api.it120.cc/abcd 那么这里只要填写 abcd
  appid: "wxa46b09d413fbcaff", // 您的小程序的appid，购物单功能需要使用
  shareProfile: '百款精品商品，总有一款适合您' // 首页转发的时候话术
}
/*
根据自己需要修改下单时候的模板消息内容设置，可增加关闭订单、收货时候模板消息提醒；
1、/pages/to-pay-order/index.js 中已添加关闭订单、商家发货后提醒消费者；
2、/pages/order-details/index.js 中已添加用户确认收货后提供用户参与评价；评价后提醒消费者好评奖励积分已到账；
3、请自行修改上面几处的模板消息ID，参数为您自己的变量设置即可。  
*/