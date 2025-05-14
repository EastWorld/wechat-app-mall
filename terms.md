
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




陈锋
首页界面所用到的词汇：
1. 框架与模块相关术语
WXAPI：微信小程序 API 封装库（可能是第三方库）
apifm-wxapi：API 服务模块，用于与后端交互
CONFIG：配置文件，存储全局配置信息
TOOLS：工具函数模块
getApp()：获取小程序实例的全局函数
Page()：小程序页面构造函数
2. 数据结构与变量术语
inputVal：搜索框输入值
goodsRecommend：推荐商品列表
kanjiaList：砍价商品列表
pingtuanList：拼团商品列表
categories：商品分类数据
activeCategoryId：当前选中的分类 ID
curPage / pageSize：分页参数（当前页 / 每页数量）
coupons：优惠券数据
shopInfo：店铺信息
scrollTop：页面滚动位置
3. 业务功能术语
banners：轮播图广告
indexAD：首页广告位
goodsCategory：商品分类
noticeList：公告列表
wxaMpLiveRooms：微信小程序直播房间
kanjia：砍价功能
pingtuan：拼团功能
referrer：推荐人 ID
shareProfile：分享文案
4. 页面交互术语
switchTab：切换底部 Tab 页
navigateTo：跳转到新页面
showLoading：显示加载提示
stopPullDownRefresh：停止下拉刷新
onReachBottom：页面触底事件
onPageScroll：页面滚动事件
TabBarBadge：底部 Tab 栏角标


#黄润军
微信功能中英对照词汇表
(WeChat Feature Glossary - Chinese-English Version)
1. 导航栏功能 (Navigation Bar Features)
中文	English
首页	Home
分类	Categories
优惠券	Coupons
购物车	Shopping Cart
我的	Me / Profile
2. 首页 (Home)
中文	English
聊天列表	Chat list
新消息	New messages
发起新聊天	Start new chat
3. 分类 (Categories)
中文	English
发现页	Discover Page
朋友圈	Moments
扫一扫	Scan
小程序	Mini Programs
搜索功能	Search function
4. 优惠券 (Coupons)
中文	English
微信支付	WeChat Pay
商家服务	Merchant services
折扣活动	Discounts
会员权益	Membership benefits
5. 购物车 (Shopping Cart)
中文	English
电商功能	E-commerce
小程序商城	Mini Program stores
订单管理	Order management
结算	Checkout
6. 我的 (Me/Profile)
中文	English
个人中心	Personal center
钱包	Wallet
收藏	Favorites
设置	Settings
7. 通用术语 (General Terms)
中文	English
导航栏	Navigation bar
用户界面	User interface
版本特定功能	Version-specific features
内容筛选	Content filtering


黄忠堂
1. 页面结构与生命周期
Page()：微信小程序的页面构造函数，用于定义页面逻辑。
生命周期函数：onLoad、onReady、onShow、onHide、onUnload、onPullDownRefresh、onReachBottom，这些函数在页面不同阶段自动触发。
2. 数据绑定与状态管理
data：页面初始数据对象，包含tabs（选项卡）、activeIndex（当前激活的选项卡索引）等。
setData()：微信小程序中用于更新视图数据的方法，触发页面重新渲染。
3. 事件处理
bindtap：微信小程序的点击事件绑定，如tabClick、getCounpon等方法。
自定义事件：如pwdCouponChange处理输入框内容变化。
4. UI 组件与交互
选项卡（Tabs）：实现了 "可领券"、"已领券"、"已失效" 三个选项卡切换功能。
模态框（Modal）：使用wx.showModal显示提示信息，如领取失败的错误提示。
提示框（Toast）：使用wx.showToast显示简短消息，如领取成功提示。
5. API 调用与异步处理
Promise：使用.then()处理异步 API 调用的结果，如WXAPI.coupons().then(...)。
API 封装：WXAPI是封装的接口调用库，包含coupons()（获取优惠券列表）、fetchCoupons()（领取优惠券）等方法。
6. 用户认证
AUTH 模块：自定义的认证模块，包含checkHasLogined()（检查是否登录）和login()（登录方法）。
token：用户身份令牌，存储在本地缓存中（wx.getStorageSync('token')）。
7. 优惠券业务逻辑
三种状态：可领取、已领取、已失效，通过选项卡和接口参数（status）区分。
领取流程：调用fetchCoupons接口，处理各种领取结果（成功、已领过、已过期等）。
口令券：支持需要输入口令才能领取的优惠券，通过showPwdPop控制弹窗显示。
8. 代码组织与优化
模块化：使用require引入外部模块（WXAPI、AUTH）。
变量命名：部分使用_this或that保存当前上下文引用（在回调函数中保持对页面实例的引用）。
9. 错误处理
针对不同的错误码（如 20001、20003 等）显示不同的提示信息，提升用户体验。
10. 性能优化
在页面显示（onShow）时根据当前选项卡加载数据，避免不必要的 API 调用。
