module.exports = {
  version: "7.17.0",
  note: '商品海报生成美化；商品详情有视频的话，不自动切换；规格尺寸图片不显示的bug', // 这个为版本描述，无需修改
  subDomain: "tz", // 根据教程 https://www.yuque.com/apifm/doc/qr6l4m 查看你自己的 subDomain
  shareProfile: '百款精品商品，总有一款适合您', // 首页转发的时候话术
  goodsDetailSkuShowType: 0, // 0 为点击立即购买按钮后出现规格尺寸、数量的选择； 1为直接在商品详情页面显示规格尺寸、数量的选择，而不弹框
  shopMod: 0, // 0为单店铺版本 ； 1为多店铺版本
}