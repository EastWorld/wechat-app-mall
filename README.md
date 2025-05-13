# 微信小程序商城

微信小程序商城，微信小程序微店，长期维护版本，欢迎大家踊跃提交贡献代码；

使用说明和常见问题，可参阅下面的说明，如还有疑问，可访问工厂官网 [https://www.it120.cc/](https://www.it120.cc/) 寻求帮助！

新增直播带货支持，具体详见使用说明

# 今日头条/抖音小程序版本

本项目的今日头条/抖音小程序版本，请移步至下面的地址：

[https://github.com/EastWorld/tt-app-mall](https://github.com/EastWorld/tt-app-mall)

## 扫码体验

<img src="https://dcdn.it120.cc/2022/12/31/0215c085-d4d1-43e4-bd7d-0e7336eaa661.jpeg" width="200px">

## 详细配置/使用教程

[https://www.it120.cc/help/ikfe2k.html](https://www.it120.cc/help/ikfe2k.html)

**遇到使用问题？**

[点击这里找答案，可用关键词搜索](https://www.it120.cc/help/index.html)

## 其他优秀开源模板推荐
- [天使童装](https://github.com/EastWorld/wechat-app-mall)   /  [码云镜像](https://gitee.com/javazj/wechat-app-mall)
- [天使童装（uni-app版本）](https://github.com/gooking/uni-app-mall)  /   [码云镜像](https://gitee.com/javazj/uni-app-mall)
- [简约精品商城（uni-app版本）](https://github.com/gooking/uni-app--mini-mall)  /   [码云镜像](https://gitee.com/javazj/uni-app--mini-mall)
- [舔果果小铺（升级版）](https://github.com/gooking/TianguoguoXiaopu)
- [面馆风格小程序](https://gitee.com/javazj/noodle_shop_procedures)
- [AI名片](https://github.com/gooking/visitingCard)  /   [码云镜像](https://gitee.com/javazj/visitingCard)
- [仿海底捞订座排队 (uni-app)](https://github.com/gooking/dingzuopaidui)  /   [码云镜像](https://gitee.com/javazj/dingzuopaidui)
- [H5版本商城/餐饮](https://github.com/gooking/vueMinishop)  /  [码云镜像](https://gitee.com/javazj/vueMinishop)
- [餐饮点餐](https://github.com/woniudiancang/bee)  / [码云镜像](https://gitee.com/woniudiancang/bee)
- [企业微展](https://github.com/gooking/qiyeweizan)  / [码云镜像](https://gitee.com/javazj/qiyeweizan)
- [无人棋牌室](https://github.com/gooking/wurenqipai)  / [码云镜像](https://gitee.com/javazj/wurenqipai)
- [酒店客房服务小程序](https://github.com/gooking/hotelRoomService)  / [码云镜像](https://gitee.com/javazj/hotelRoomService)
- [面包店风格小程序](https://github.com/gooking/bread)  / [码云镜像](https://gitee.com/javazj/bread)
- [朋友圈发圈素材小程序](https://github.com/gooking/moments)  / [码云镜像](https://gitee.com/javazj/moments)
- [小红书企业微展](https://github.com/gooking/xhs-qiyeweizan)  / [码云镜像](https://gitee.com/javazj/xhs-qiyeweizan)

## 联系作者

| 微信好友 | QQ好友 |
| :------: | :------: |
| <img src="https://dcdn.it120.cc/2021/09/13/61a80363-9085-4a10-9447-e276a3d40ab3.jpeg" width="200px"> | <img src="https://dcdn.it120.cc/2021/09/13/08a598d8-8186-4159-9930-2e4908accc5e.png" width="200px"> |

## 本项目使用了下面的组件，在此鸣谢

- [接口 SDK](https://github.com/gooking/apifm-wxapi)

- [api工厂](https://admin.s2m.cc)

- [vant-weapp](https://youzan.github.io/vant-weapp)

- [小程序富文本插件（html 渲染）](https://github.com/jin-yufeng/mp-html)

- [小程序海报组件-生成朋友圈分享海报并生成图片](https://github.com/jasondu/wxa-plugin-canvas)

- [Apache ECharts](https://github.com/ecomfe/echarts-for-weixin)

底部ICON图标使用：
https://www.iconfont.cn/collections/detail?spm=a313x.7781069.0.da5a778a4&cid=18904

  
## 如何升级到最新版

- 小程序程序的修改和您后台的数据是独立的，所以不用担心您会丢失数据
- 先把你开发工具下的现有版本程序备份
- 下载最新版的程序，直接覆盖您本地的程序
- 用开发工具修改域名 mall 为你自己的域名
- 开发工具里面上传代码提交微信审核
- 审核通过后，小程序后台去发布新版本即可
- 用户无需重新扫码，关闭小程序重新打开就是新版本了


#My Account Feature Introduction
=======



潘英明

1.When you open the shopping cart, there is an authorization login prompt (with options "Allow" or "Don't Log In for Now").
## 2.Allowing authorization can provide better services.
## 3.If not logged in, no information will be disclosed to the user.


## This is the authorization login pop - up interface on the shopping cart page of a WeChat Mini - Program. The page title is "Shopping Cart", and the pop - up title is "Authorization Login". It prompts users to authorize the Mini - Program to log in, promising not to disclose their information and stating that it is only for providing better services. The pop - up has two buttons: "Allow" and "Not Now". At the bottom is the navigation bar of the Mini - Program, which includes options such as "Home", "Categories", "Shopping Cart", and "My Account". Currently, the user is on the "Shopping Cart" page.



黎孔铭


My Account Feature Introduction

1. Interface Overview
Top Section: User Assets & Login
Login Now
Redirects to WeChat authorization login to bind user identity.

Balance
Available cash in the user's account, usable for spending or withdrawal (e.g., pocket money, top-up balance).

Frozen Amount
Temporarily locked funds (e.g., pending transactions or withdrawals under review).

Points
Earned through spending, check-ins, etc., redeemable for goods or coupons.

Growth Value
Reflects user level progression (e.g., Silver → Gold).
2. My Orders (Status Categories)
Pending Payment
Unpaid orders, often with a countdown (e.g., 30-minute payment window).

Pending Shipment
Paid orders awaiting seller dispatch, with estimated shipping time.
Pending Delivery
Orders in transit, with tracking number and logistics updates
Pending Review
Post-delivery, users can rate and review products.
After-Sales
Entry for returns/refunds/exchanges, requiring reason and proof.
3. Frequently Used Features

Discount Checkout
Quick payment using coupons or promo codes (common for in-store QR payments).
Transaction Records
View income/expense history (e.g., top-ups, spending, refunds).
Invoice Request
Apply for e-invoices or paper invoices for completed orders.
Invoice History
Track past invoice requests (issued, pending, mailed).
Shipping Addresses
Manage delivery addresses (add, edit, set as default).
Coupon Center
Claim platform or merchant coupons/discounts.
4. User Engagement & Benefits
My Favorites
List of saved products, shops, or articles.
Daily Check-In
Earn points/coupons for consecutive check-ins.
Redeem Points with Vouchers
Exchange voucher codes for extra points (e.g., event rewards).
Convert Points to Growth
Accelerate membership level by converting points.
5. Account & Security
Bind Phone Number
Link a phone number for verification or password recovery.
Bind Now
Redirects to phone binding page (SMS verification required).
Authorized Logins
Manage third-party app authorizations (e.g., WeChat-linked mini-programs).
6. About & Version
About Us
View developer info, privacy policy, and user agreements.
EastWorld v7.20.1
Current version number (check for updates or report issues).
7. Bottom Navigation Bar (All Clickable for Page Jumps)
Home
Return to the homepage for featured products/activities.
Categories
Filter by product/service type (e.g., food, apparel, electronics).
Shopping Cart
Holds items for checkout (supports batch operations).
My Account

Personal center entry (current page).




陈锋

The home page has four functions:

1. Product search function
2. Advertising space
3. Product recommendation dropdown
4. Coupon redirection function
Product search function description:
Users can search for products based on the product names they want.

Advertising space description:
We can display product advertisements from our partner advertisers in the backend, allowing users to see the advertised products.

Product recommendation dropdown description:
We can analyze users' preferences and interests through big data and recommend relevant products, enabling customers to see the products they like, stimulating their desire to purchase, and promoting consumption.

Coupon redirection function description:
Users can click the coupon redirection button to easily view the coupon information they own, facilitating their use of coupons



##黄润军
WeChat
Categories
Enter search keywords

Home
The default page displays the chat list, including conversations with friends and group chats. Users can view new messages, start new chats, or access existing conversations.

Categories
The functionality may vary depending on the version or context. Common uses include:

"Discover" Page: Features like Moments (朋友圈), Scan (扫一扫), Mini Programs (小程序), etc.

Search Function: Allows users to find chat history, contacts, articles, etc., by keywords.

The "Categories" and search bar at the top may refer to product categorization or content filtering (e.g., in e-commerce or service modules).

Coupons
Typically linked to WeChat Pay or merchant services, users can view claimed coupons, discounts, or membership benefits. Commonly found in Mini Programs or partnered merchant promotions.

Shopping Cart
An entry point for WeChat’s built-in e-commerce features (e.g., Mini Program stores, JD.com integration). Users can review added items, manage orders, or proceed to checkout.

Me (Profile)
The personal center page, containing account information, Wallet (钱包), Favorites (收藏), Settings (设置), and more. Users can manage personal details, payment settings, or access personalized services.


=======

黄忠堂
Here's the English translation of your analysis of the coupon center's functionality:

Tab Switching Functionality
The top of the page features three tabs: "Available Coupons", "My Coupons", and "Expired Coupons".
Clicking on a tab switches the display to the corresponding coupon status and automatically loads the relevant data.
Coupon Data Loading
Available Coupons: Calls sysCoupons(), which uses WXAPI.coupons() to fetch the list of redeemable coupons from the system.
My Coupons: Calls getMyCoupons(), which uses WXAPI.myCoupons() to retrieve the user's active (unredeemed) coupons.
Expired Coupons: Calls invalidCoupons(), which uses WXAPI.myCoupons() to fetch the user's used or expired coupons.
Coupon Redemption Function
Clicking the "Redeem Now" button triggers the getCounpon() method.
Supports two types of coupons:
Regular Coupons: Directly calls WXAPI.fetchCoupons() for redemption.
Password-Protected Coupons: Prompts a password input dialog; redemption occurs after entering the correct password.
Redemption Results:
Success: Displays "Redemption Successful".
Failure: Shows specific error messages based on error codes (e.g., "Too late", "Already redeemed").
User Authentication & Access Control
Checks login status via AUTH.checkHasLogined().
If not logged in, accessing "My Coupons" or "Expired Coupons" prompts the user to log in.
All user-specific requests include the authentication token.
UI Interaction & State Management
Uses activeIndex to track the currently selected tab.
Controls the password input dialog via showPwdPop.
Displays an empty state message when the coupon list is empty.
Page Lifecycle Management
onLoad: Initializes the page.
onShow: Loads data based on the current tab when the page appears.
onReady, onHide, onUnload: Reserved lifecycle functions (currently unimplemented).
Additional Features
Returns to the home page via toIndexPage().
Handles password input changes via pwdCouponChange().

Code Structure Analysis

Data Layer: Interacts with the backend via WXAPI-encapsulated APIs.
View Layer: Updates UI data using setData().
Control Layer: Manages user actions through event handlers (e.g., tabClick, getCounpon).

This coupon center fully implements browsing and redemption workflows with a clean UI, clear interaction logic, and comprehensive error handling.

Let me know if you need further refinements!

