# 微信小程序商城

微信小程序商城，微信小程序微店，长期维护版本，欢迎大家踊跃提交贡献代码；

使用说明和常见问题，可参阅下面的说明，如还有疑问，可访问工厂官网 [https://www.it120.cc/](https://www.it120.cc/) 寻求帮助！

新增直播带货支持，具体详见使用说明

# 版本说明

master 主线版本（8.x）为主力开发版本，激进的朋友可以选择使用该版本，可体验最新的尝鲜功能；

7.x 分支为目前稳定版本，保守的用户可使用非主线分支：

[https://github.com/EastWorld/wechat-app-mall/tree/7.x](https://github.com/EastWorld/wechat-app-mall/tree/7.x)

# 今日头条/抖音小程序版本

本项目的今日头条/抖音小程序版本，请移步至下面的地址：

[https://github.com/EastWorld/tt-app-mall](https://github.com/EastWorld/tt-app-mall)

## 扫码体验

<img src="https://cdn.it120.cc/apifactory/2019/06/28/a8304003-3218-4a47-95cf-84d82ebdc07b.jpg" width="200px">

## 详细配置/使用教程

[https://www.it120.cc/help/ikfe2k.html](https://www.it120.cc/help/ikfe2k.html)

**遇到使用问题？**

[点击这里找答案，可用关键词搜索](https://www.it120.cc/help.html)

## 其他开源模板

| 舔果果小铺（升级版） | 面馆风格小程序 | AI名片 |
| :------: | :------: | :------: |
| <img src="https://dcdn.it120.cc/2020/03/22/d4a4abd1-ea23-42e0-a5f1-210e737ed841.jpg" width="200px"> | <img src="https://cdn.it120.cc/apifactory/2019/03/29/9e30cfe31eabcd218eb9c434f17e9295.jpg" width="200px"> | <img src="https://cdn.it120.cc/apifactory/2018/12/18/c2324da4eea91602f385db5b523b13ca.jpg" width="200px"> | 
| [开源地址](https://github.com/gooking/TianguoguoXiaopu) | [开源地址](https://gitee.com/javazj/noodle_shop_procedures) | [开源地址](https://github.com/gooking/visitingCard) |

## 联系作者

| 微信好友 | 支付宝好友 |
| :------: | :------: |
| <img src="https://cdn.it120.cc/apifactory/2019/07/03/a86f7e46-1dbc-42fe-9495-65403659671e.jpeg" width="200px"> | <img src="https://cdn.it120.cc/apifactory/2019/07/03/fda59aeb-4943-4379-93bb-92856740bd6a.jpeg" width="200px"> |

## 本项目使用了下面的组件，在此鸣谢

- [接口 SDK](https://github.com/gooking/apifm-wxapi)

- [api工厂](https://admin.it120.cc)

- [WeUI](https://github.com/Tencent/weui-wxss/)

- [小程序富文本插件（html 渲染）](https://github.com/jin-yufeng/Parser)

- [小程序海报组件-生成朋友圈分享海报并生成图片](https://github.com/jasondu/wxa-plugin-canvas)

- [每日签到日历控件 wx_calendar](https://github.com/treadpit/wx_calendar)

底部ICON图标使用：
https://www.iconfont.cn/collections/detail?spm=a313x.7781069.0.da5a778a4&cid=13163


## 初始化测试数据

登录后台，左侧菜单 “工厂设置” --> “数据克隆” --> “将别人的数据克隆给我”

对方商户ID填写  951

点击 “立即克隆” ，然后退出后台重新登录

你将立即享有初始化测试数据，方便你进行测试

## 编译说明

本项目使用基于 ES7 的语法，所以请在开发工具中开启 “增强编译”， 否则会提示以下错误：

```
thirdScriptError 
 sdk uncaught third Error 
 regeneratorRuntime is not defined 
 ReferenceError: regeneratorRuntime is not defined
```

<img src="https://dcdn.it120.cc/2019/08/28/c5169c15-abda-4e5f-91d5-6dfcfe382fb2.png">

**如果你的开发工具没用看到“增强编译”的选项，请升级开发工具到最新版**

## 系统参数设置

*登录后台，左侧菜单“系统设置” --> “系统参数” 菜单；如果你找不到该菜单，那是因为你还没启用 “系统参数设置” 的模块，左侧菜单“系统设置” --> “模块管理”，启用 “系统参数设置” 模块，然后F5刷新网页即可*

- ROLE_FOR_SHOP （开关类型）
  
  **如果你有多店铺功能，改功能将开启店铺管理员功能，届时，每个店铺管理员将只能管理自己店铺下的商品和订单，而无法查看并管理其他店铺的订单**

- ALLOW_SELF_COLLECTION （开关类型）
  
  **是否开启到店自提功能（快递和到店自提客户自己可以选择）**

- WITHDRAW_FEE_PERCENT （文本参数）
  
  **提现手续费比例，填1为 1%**

- free_shipping_for_purchases （文本参数）
  
  **下单金额满多少后实现包邮**

- mallName （文本参数）
  
  **小程序名称（商城名称）**

- REGISTER_OPEN_SELLER （开关类型）
  
  **新注册用户是否自动成为分销商，如果不开启该参数，分销商需要自己申请，你进行审核**
  
  [《api工厂三级分销插件使用教程》](https://www.yuque.com/apifm/doc/pgfwvu)

## 常见问题

- 如何修改小程序商城的标题？

  请查看上面的系统设置中的 **mallName**

- 如何在后台管理小程序启动图和首页头部的轮播 banner 图片？

```
这两个功能都是使用后台 “系统设置” --> “banner” 管理功能来实现的；
后台发布banner的时候，自定义类型请分别填写  app  和  index
小程序会自动读取类型为 app 的banner图片作为启动展示图片；
小程序会自动读取类型为 index 的banner图片作为首页的轮播图；
```

- “无法登录” / Token 无效 ？

  1. config.js 里面的 subDomain 改成你自己的，保存；
  2. 登录你的小程序后台（MP 那个地址），Request 域名处增加 api.it120.cc
  3. 确保小程序后台（MP 那个地址） 的 appid，工厂后台填写的 appid ，开发工具右上角 “项目详情” 打开后显示的 appid ，这 3 个 appid 是一模一样的；
  4. 开发工具上点击 “清除缓存” —> “编译”

- 微信支付时候，提示 50000 错误，不能获取到预支付 id

  > 这个错误是无法获取到微信支付的预支付信息

  - 可能是你没有在后台配置您的微信支付商户号和秘钥，或者配置错误
  - 可能是你配置的微信支付不是当前小程序申请的（微信支付目前无法跨小程序调用）
  - 确保微信开发工具上面登录的 APPID 和你在后台配置的 APPID 是同一个

- 能否帮我免费添加功能？

  可以！


  1. 点击页面顶部的 Star ，关注后，项目有最新动态 github 会提醒您，不错过重要更新；
  2. 点击页面顶部的 Fork， 将您需要增加的功能完成 小程序 端界面的调整，然后在 github 上请求将您的代码合并到 EastWorld；
  3. 您的代码合并请求审核通过后，我们将会为您完善配套的后台功能；
  4. 开源项目离不开您的支持和代码共享，我们一起把 EastWorld 项目长期维护下去；

- 下单的时候没有地方填写收货地址？

  1. 添加一个“物流模板”，只有需要快递的商品才会提示用户填写收货地址
  2. 发布商品的时候，选择刚才添加的“物流模板”
  3. 重新下单，将会需要用户输入收货地址

- 后台设置 appid 和 secret 的时候提示不正确？

  1. 请确认您填写的 appid 和 secret 是否正确
  2. 输入的时候确保没有空格（复制的时候可能会多复制了空格）
  3. 在微信后台设置服务器 IP 地址白名单（106.14.43.122）

- 如何使用退款功能？

  1. 后台支持针对订单指定退款多少金额；
  2. 可选择退款至用户可用余额或者按照用户支付原路退还第三方或者银行卡；
  3. 如果选用原路退还，需要在商户号和秘钥设置的地方上传您的微信支付证书文件（PK12 格式文件）

- 如何设置满多少包邮？

  1. 后台系统设置 -- 系统参数，增加系统参数；
  2. 参数名 free_shipping_for_purchases （注意不要有空格）
  3. 参数值填写您希望的买满金额即可

- 如何修改或者关闭订单超过 30 分钟未付款自动关闭？

  1. 创建订单接口增加 expireMinutes 参数；
  2. 代表多少分钟未支付自动关闭本订单，传 0 不自动关闭订单；

- [更多问题？](https://www.yuque.com/apifm/doc)
  
## 如何升级到最新版

- 小程序程序的修改和您后台的数据是独立的，所以不用担心您会丢失数据
- 先把你开发工具下的现有版本程序备份
- 下载最新版的程序，直接覆盖您本地的程序
- 用开发工具修改域名 mall 为你自己的域名
- 开发工具里面上传代码提交微信审核
- 审核通过后，小程序后台去发布新版本即可
- 用户无需重新扫码，关闭小程序重新打开就是新版本了
