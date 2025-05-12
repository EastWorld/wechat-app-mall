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