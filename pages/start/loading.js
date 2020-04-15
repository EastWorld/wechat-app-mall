const WXAPI = require('apifm-wxapi')
const APP = getApp()
const AUTH = require('../../utils/auth')

Page({
  data: {
    initSuccess: false
  },
  onLoad: function (options) {
    if (options) {
      this.data.route = options.route
    }
    const accountInfo = wx.getAccountInfoSync()
    wx.setStorageSync('wxAppid', accountInfo.miniProgram.appId);
    this.getSubDomain(accountInfo.miniProgram.appId)
    // 处理参数
    if (options && options.scene) {
      const scene = decodeURIComponent(options.scene) // 处理扫码进来的业务逻辑,格式为：   qrcode-*,queryString,referrer
      const _const = scene.split(',')
      if (_const[0] == 'qrcode-index') {
        this.data.route = '/pages/start/start' + _const[1]
        if (_const.length > 2) {
          wx.setStorageSync('referrer', _const[2])
        }
      }
      if (_const[0] == 'qrcode-goods') {
        this.data.route = '/pages/goods-details/index' + _const[1]
        if (_const.length > 2) {
          wx.setStorageSync('referrer', _const[2])
        }
      }
    }
    if (options && options.inviter_id) {
      wx.setStorageSync('referrer', options.inviter_id)
      if (options.shareTicket) {
        this.processShareTicket(options.inviter_id, options.shareTicket)
      } else {
        this.routePage()
      }
    } else {
      this.routePage()
    }    
  },
  async getSubDomain(appid){
    const _this = this
    const res = await WXAPI.fetchSubDomainByWxappAppid(appid)
    if (res.code == 700) {
      wx.showModal({
        title: '无法连接后台',
        content: '①请先在后台左侧菜单微信设置->小程序设置配置appid②修改配置有5分钟的延迟',
        showCancel: false,
        confirmText: '重新连接',
        success (res) {
          _this.getSubDomain(appid)
        }
      })
    } else if (res.code != 0) {
      wx.showModal({
        title: '错误',
        content: res.msg,
        showCancel: false,
        confirmText: '重试',
        success (res) {
          _this.getSubDomain(appid)
        }
      })
    } else {
      wx.setStorageSync('subDomain', res.data)
      WXAPI.init(res.data)
      this.initData()
    }
  },
  async initData(){
    // 初始化数据
    const vipRes = await WXAPI.vipLevel()
    if (vipRes.code == 0) {
      APP.globalData.vipLevel = vipRes.data
    }
    const configRes = await WXAPI.queryConfigBatch('mallName,recharge_amount_min,WITHDRAW_MIN,ALLOW_SELF_COLLECTION,order_hx_uids,subscribe_ids')
    if (configRes.code == 0) {
      configRes.data.forEach(config => {
        wx.setStorageSync(config.key, config.value);
      })
      
    }
    const scoreRulesRes = await WXAPI.scoreRules({
      code: 'goodReputation'
    })
    if (scoreRulesRes.code == 0) {        
      APP.globalData.order_reputation_score = scoreRulesRes.data[0].score;
    }
    // 自动登录
    const isLogined = await AUTH.checkHasLogined()
    if (!isLogined) {
      AUTH.login()
    }
    this.data.initSuccess = true    
  },
  async processShareTicket(inviter_id, shareTicket){
    if (!this.data.initSuccess) {
      setTimeout(() => {
        this.processShareTicket(inviter_id, shareTicket)
      }, 500);
      return
    }
    // 处理分享到群奖励
    const code = AUTH.wxaCode()
    wx.getShareInfo({
      shareTicket: shareTicket,
      success: res => {
        WXAPI.shareGroupGetScore(
          code,
          inviter_id,
          res.encryptedData,
          res.iv
        ).then(_res => {
          console.log(_res)
          this.routePage()
        }).catch(err => {
          console.error(err)
          this.routePage()
        })
      },
      fail: () => {
        this.routePage()
      }
    })
  },
  routePage(){
    if (!this.data.initSuccess) {
      setTimeout(() => {
        this.routePage()
      }, 500);
      return
    }
    // 页面跳转,  参数请用 url 编码
    let pageUrl = this.data.route ? this.data.route : '/pages/start/start'
    wx.reLaunch({
      url: decodeURIComponent(pageUrl)
    })    
  },
})