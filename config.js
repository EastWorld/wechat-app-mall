module.exports = {
  version: '26.11.12',
  note: '修复编译 const 类型错误，改为 let', // 这个为版本描述，无需修改
  subDomain: 'tz', // 此处改成你自己的专属域名。什么是专属域名？请看教程 https://www.it120.cc/help/qr6l4m.html
  merchantId: 951, // 商户ID，可在后台工厂设置-->商户信息查看
  sdkAppID: 1400450467, // 腾讯实时音视频应用编号，请看教程 https://www.it120.cc/help/nxoqsl.html
  bindSeller: false, // true 开启三级分销抢客； false 为不开启
  customerServiceType: 'QW', // 客服类型，QW为企业微信，需要在后台系统参数配置企业ID和客服URL，XCX 为小程序的默认客服
  openIdAutoRegister: true, // 用户打开小程序的时候自动注册新用户【用户不存在的时候】
  categorySecondPos: 0, // 0 显示在右侧顶部； 1 左侧一级分类展开折叠展示二级分类
  couponUseMultiple: true, // 下单是否允许使用多张优惠券
  openNickAvatarUrlPOP: true, // 是否检测昵称头像，几秒后弹出完善弹出框
}