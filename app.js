const WXAPI = require('apifm-wxapi')
const CONFIG = require('config.js')
const AUTH = require('utils/auth')
App({
  onLaunch: function() {
    const subDomain = wx.getExtConfigSync().subDomain
    if (subDomain) {
      WXAPI.init(subDomain)
    } else {
      WXAPI.init(CONFIG.subDomain)
      WXAPI.setMerchantId(CONFIG.merchantId)
    }
    const that = this;
    // 检测新版本
    const updateManager = wx.getUpdateManager()
    updateManager.onUpdateReady(function () {
      wx.showModal({
        title: '更新提示',
        content: '新版本已经准备好，是否重启应用？',
        success(res) {
          if (res.confirm) {
            // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
            updateManager.applyUpdate()
          }
        }
      })
    })
    /**
     * 初次加载判断网络情况
     * 无网络状态下根据实际情况进行调整
     */
    wx.getNetworkType({
      success(res) {
        const networkType = res.networkType
        if (networkType === 'none') {
          that.globalData.isConnected = false
          wx.showToast({
            title: '当前无网络',
            icon: 'loading',
            duration: 2000
          })
        }
      }
    });
    /**
     * 监听网络状态变化
     * 可根据业务需求进行调整
     */
    wx.onNetworkStatusChange(function(res) {
      if (!res.isConnected) {
        that.globalData.isConnected = false
        wx.showToast({
          title: '网络已断开',
          icon: 'loading',
          duration: 2000
        })
      } else {
        that.globalData.isConnected = true
        wx.hideToast()
      }
    })
    WXAPI.queryConfigBatch('mallName,WITHDRAW_MIN,ALLOW_SELF_COLLECTION,order_hx_uids,subscribe_ids,share_profile,adminUserIds,goodsDetailSkuShowType,shopMod,needIdCheck,balance_pay_pwd,shipping_address_gps,shipping_address_region_level,shopping_cart_vop_open,cps_open,recycle_open,categoryMod,hide_reputation,show_seller_number,show_goods_echarts,show_buy_dynamic,goods_search_show_type,show_3_seller,show_quan_exchange_score,show_score_exchange_growth,show_score_sign,fx_subscribe_ids,share_pic,orderPeriod_open,order_pay_user_balance,wxpay_api_url,sphpay_open,fx_type,invoice_subscribe_ids,zt_open_hx,withdrawal,customerServiceChatCorpId,customerServiceChatUrl,invoice_open,alipay,comment_subscribe_ids,notice_subscribe_ids,hidden_goods_index,create_order_ext,needBindMobile,invoice_share_pic,hot_search_words').then(res => {
      if (res.code == 0) {
        res.data.forEach(config => {
          wx.setStorageSync(config.key, config.value)
        })
        if (this.configLoadOK) {
          this.configLoadOK()
        }
        // wx.setStorageSync('shopMod', '1') // 测试用，不要取消注释
      }
    })
    // ---------------检测navbar高度
    let menuButtonObject = wx.getMenuButtonBoundingClientRect();
    console.log("小程序胶囊信息",menuButtonObject)
    wx.getSystemInfo({
      success: res => {
        let statusBarHeight = res.statusBarHeight,
          navTop = menuButtonObject.top,//胶囊按钮与顶部的距离
          navHeight = statusBarHeight + menuButtonObject.height + (menuButtonObject.top - statusBarHeight)*2;//导航高度
        this.globalData.navHeight = navHeight;
        this.globalData.navTop = navTop;
        this.globalData.windowHeight = res.windowHeight;
        this.globalData.menuButtonObject = menuButtonObject;
        console.log("navHeight",navHeight);
      },
      fail(err) {
        console.log(err);
      }
    })
  },

  onShow (e) {
    // 保存邀请人
    if (e && e.query && e.query.inviter_id) {
      wx.setStorageSync('referrer', e.query.inviter_id)
      if (e.shareTicket) {
        wx.getShareInfo({
          shareTicket: e.shareTicket,
          success: res => {
            wx.login({
              success(loginRes) {
                if (loginRes.code) {
                  WXAPI.shareGroupGetScore(
                    loginRes.code,
                    e.query.inviter_id,
                    res.encryptedData,
                    res.iv
                  ).then(_res => {
                    console.log(_res)
                  }).catch(err => {
                    console.error(err)
                  })
                } else {
                  console.error('登录失败！' + loginRes.errMsg)
                }
              }
            })
          }
        })
      }
    }
    // 自动登录
    AUTH.checkHasLogined().then(isLogined => {
      if (!isLogined) {
        // 未登录
        if (CONFIG.openIdAutoRegister) {
          // 进行登陆，用户不存在则注册
          AUTH.authorize().then( aaa => {
            if (CONFIG.bindSeller) {
              AUTH.bindSeller()
            }
            this.getUserApiInfo().then(() => {
              if (this.loginOK) {
                this.loginOK()
              }
            })
          })
        } else {
          // 只是登陆
          AUTH.login20241025().then( res => {
            if (res.code == 0) {
              // 登陆成功
              if (CONFIG.bindSeller) {
                AUTH.bindSeller()
              }
              this.getUserApiInfo().then(() => {
                if (this.loginOK) {
                  this.loginOK()
                }
              })
            } else {
              // 用户没注册
              if (this.loginFail) {
                this.loginFail()
              }
            }
          })
        }
      } else {
        // 已登录
        if (CONFIG.bindSeller) {
          AUTH.bindSeller()
        }
        this.getUserApiInfo()
      }
    })
  },
  async getUserApiInfo() {
    const res = await WXAPI.userDetail(wx.getStorageSync('token'))
    if (res.code == 0) {
      this.globalData.apiUserInfoMap = res.data
    }
  },
  initNickAvatarUrlPOP(_this) {
    setTimeout(() => {
      if (this.globalData.apiUserInfoMap && (!this.globalData.apiUserInfoMap.base.nick || !this.globalData.apiUserInfoMap.base.avatarUrl)) {
        _this.setData({
          nickPopShow: true,
          popnick: this.globalData.apiUserInfoMap.base.nick ? this.globalData.apiUserInfoMap.base.nick : '',
          popavatarUrl: this.globalData.apiUserInfoMap.base.avatarUrl ? this.globalData.apiUserInfoMap.base.avatarUrl : '',
        })
      }
    }, 3000) // 3秒后弹出
  },
  globalData: {
    isConnected: true,
    sdkAppID: CONFIG.sdkAppID,
    apiUserInfoMap: undefined, // 当前登陆用户信息: base/ext/idcard/saleDistributionTeam
  }
})