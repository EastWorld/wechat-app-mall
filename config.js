module.exports = {
  version: '26.5.21',
  note: '分类页面，config.js 中可控制二级类目的展现方式（右侧顶部/左侧树形）', // 这个为版本描述，无需修改
  subDomain: 'tz', // 此处改成你自己的专属域名。什么是专属域名？请看教程 https://www.it120.cc/help/qr6l4m.html
  merchantId: 951, // 商户ID，可在后台工厂设置-->商户信息查看
  sdkAppID: 1400450467, // 腾讯实时音视频应用编号，请看教程 https://www.it120.cc/help/nxoqsl.html
  bindSeller: false, // true 开启三级分销抢客； false 为不开启
  customerServiceType: 'QW', // 客服类型，QW为企业微信，需要在后台系统参数配置企业ID和客服URL，XCX 为小程序的默认客服
  openIdAutoRegister: true, // 用户打开小程序的时候自动注册新用户【用户不存在的时候】
  categorySecondPos: 0, // 0 显示在右侧顶部； 1 左侧一级分类展开折叠展示二级分类
}