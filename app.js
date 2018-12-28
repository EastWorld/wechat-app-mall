const api = require('./utils/request.js')
App({
  navigateToLogin: false,
  onLaunch: function() {
    var that = this;
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
          duration: 2000,
          complete: function() {
            that.goStartIndexPage()
          }
        })
      } else {
        that.globalData.isConnected = true
        wx.hideToast()
      }
    });
    //  获取商城名称
    api.fetchRequest('/config/get-value', {
      key: 'mallName'
    }).then(function(res) {
      if (res.data.code == 0) {
        wx.setStorageSync('mallName', res.data.data.value);
      }
    })
    api.fetchRequest('/score/send/rule', {
      code: 'goodReputation'
    }).then(function(res) {
      if (res.data.code == 0) {
        that.globalData.order_reputation_score = res.data.data[0].score;
      }
    })
    api.fetchRequest('/config/get-value', {
      key: 'recharge_amount_min'
    }).then(function(res) {
      if (res.data.code == 0) {
        that.globalData.recharge_amount_min = res.data.data.value;
      }
    })
    // 获取砍价设置
    api.fetchRequest('/shop/goods/kanjia/list').then(function(res) {
      if (res.data.code == 0) {
        that.globalData.kanjiaList = res.data.data.result;
      }
    })
    // 判断是否登录
    let token = wx.getStorageSync('token');
    if (!token) {
      that.goLoginPageTimeOut()
      return
    }
    api.fetchRequest('/user/check-token', {
      token: token
    }).then(function(res) {
      if (res.data.code != 0) {
        wx.removeStorageSync('token')
        that.goLoginPageTimeOut()
      }
    })
  },
  sendTempleMsg: function(orderId, trigger, template_id, form_id, page, postJsonString) {
    var that = this;
    api.fetchRequest('/template-msg/put', {
      token: wx.getStorageSync('token'),
      type: 0,
      module: 'order',
      business_id: orderId,
      trigger: trigger,
      template_id: template_id,
      form_id: form_id,
      url: page,
      postJsonString: postJsonString
    }, 'POST', 0, {
      'content-type': 'application/x-www-form-urlencoded'
    }).then(function(res) {})
  },
  sendTempleMsgImmediately: function(template_id, form_id, page, postJsonString) {
    var that = this;
    api.fetchRequest('/template-msg/put', {
      token: wx.getStorageSync('token'),
      type: 0,
      module: 'immediately',
      template_id: template_id,
      form_id: form_id,
      url: page,
      postJsonString: postJsonString
    }, 'POST', 0, {
      'content-type': 'application/x-www-form-urlencoded'
    }).then(function(res) {})
  },
  goLoginPageTimeOut: function() {
    if (this.navigateToLogin){
      return
    }
    this.navigateToLogin = true
    setTimeout(function() {
      wx.navigateTo({
        url: "/pages/authorize/index"
      })
    }, 1000)
  },
  goStartIndexPage: function() {
    setTimeout(function() {
      wx.redirectTo({
        url: "/pages/start/start"
      })
    }, 1000)
  },
  globalData: {                
    isConnected: true
  }  
})