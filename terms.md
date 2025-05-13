
=======
潘英明


1. 全局对象与 API
WXAPI：外部 API 模块，用于调用与小程序相关的后端服务（如购物车操作）
TOOLS：自定义工具库，可能包含通用工具函数
AUTH：自定义认证模块，处理用户登录和权限
app：小程序全局实例，通过getApp()获取
2. 页面状态与数据
wxlogin：登录状态标识（是否已登录）
saveHidden：保存按钮的显示控制
allSelect/noSelect：全选 / 未选状态标识
delBtnWidth：滑动删除按钮宽度（响应式处理单位 rpx）
shippingCarInfo：购物车数据（包含商品列表等信息）
3. 事件处理函数
touchS/touchM/touchE：触摸事件（开始 / 移动 / 结束），实现滑动删除效果
delItem：删除购物车商品
jiaBtnTap/jianBtnTap：增加 / 减少商品数量
changeCarNumber：手动修改商品数量
processLogin：处理登录流程
cancelLogin：取消登录操作
4. 生命周期函数
onLoad：页面加载时执行（初始化按钮宽度）
onShow：页面显示时执行（检查登录状态并刷新购物车）
5. 响应式处理
getEleWidth：计算元素实际宽度（将 rpx 转换为设备像素）
initEleWidth：初始化删除按钮宽度
6. 业务逻辑术语
shippingCarInfo：购物车信息（商品列表、数量、价格等）
token：用户认证令牌（存储在本地缓存中）
key：商品唯一标识（用于购物车操作）
number：商品数量
7. 微信小程序专有术语
Page：页面构造函数
setData：更新页面数据（触发视图更新）
wx.getSystemInfoSync：获取设备系统信息
wx.showToast：显示提示框
wx.getStorageSync：同步获取本地缓存数据
wx.switchTab：切换底部导航栏页面
8. 异步处理
async/await：异步编程语法（处理 Promise）
.then()：Promise 链式调用
9. 样式与布局
margin-left：CSS 布局属性（用于滑动动画）
rpx：微信小程序响应式单位（750rpx 为屏幕宽度）
10. 登录与权限
checkHasLogined：检查是否已登录
register：用户注册 / 登录流程



黎孔铭


1. 用户账户与资产相关
英文术语	中文对照	说明
Authorization Login	授权登录	通过第三方平台（如微信）授权身份验证
Balance	余额	用户账户可用现金
Frozen Amount	冻结金额	因交易审核等暂时不可用的资金
Points	积分	用户通过行为获得的虚拟奖励
Growth Value	成长值	衡量用户等级的数值
Transaction Records	资金明细	资金流动的历史记录

2. 订单与交易相关
英文术语	中文对照	说明
Pending Payment	待付款	订单未支付状态
Pending Shipment	待发货	订单已支付但未发货
Pending Delivery	待收货	商品运输中状态
After-Sales	售后	退货/退款等服务入口
Invoice Request	申请发票	用户申请开具发票
Coupon Center	领券中心	领取优惠券的入口

3. 功能与交互相关
英文术语	中文对照	说明
Daily Check-In	每日签到	连续登录奖励机制
Redeem Points	积分兑换	将积分转换为其他权益
Bind Phone Number	绑定手机	关联手机号增强安全性
Shipping Addresses	收货地址	用户管理的配送地址
Discount Checkout	优惠买单	使用优惠券快速支付

4. 导航与界面相关
英文术语	中文对照	说明
Bottom Navigation Bar	底部导航栏	固定显示的核心功能入口
Categories	分类	按商品类型筛选的页面
Shopping Cart	购物车	暂存待结算商品

5. 技术与系统相关
英文术语	中文对照	说明
E-Invoice	电子发票	数字化发票形式
Version Number	版本号	标识当前应用版本（如v7.20.1）
Privacy Policy	隐私政策	用户数据使用条款