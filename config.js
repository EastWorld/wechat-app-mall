module.exports = {
  version: "7.18.0",
  note: '自动获取用户地址；点击结算直接跳到付款界面；订单商品可点击；购物车可修改数量；首页分类类目跳转到分类相对应的类目；', // 这个为版本描述，无需修改
  subDomain: "tz", // 根据教程 https://www.yuque.com/apifm/doc/qr6l4m 查看你自己的 subDomain
  shareProfile: '百款精品商品，总有一款适合您', // 首页转发的时候话术
  goodsDetailSkuShowType: 0, // 0 为点击立即购买按钮后出现规格尺寸、数量的选择； 1为直接在商品详情页面显示规格尺寸、数量的选择，而不弹框
  shopMod: 0, // 0为单店铺版本 ； 1为多店铺版本
}