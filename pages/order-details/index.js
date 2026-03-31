const WXAPI = require('apifm-wxapi')

Page({
    data:{
      orderId:0,
      goodsList:[]
    },
    onLoad:function(e){
      // e.id = e.sfsdffd
      // e.payOrderNo = 'ZF2408290780106421'
      this.setData({
        orderId: e.id,
        payOrderNo: e.payOrderNo,
      })
      if (e.payOrderNo) {
        this.payLogs()
      }
    },
    onShow() {
      this.orderDetail()
    },
    async payLogs() {
      wx.showLoading({
        title: '',
      })
      const res = await WXAPI.payLogs({
        token: wx.getStorageSync('token'),
        orderNo: this.data.payOrderNo
      })
      wx.hideLoading()
      if (res.code != 0) {
        wx.showModal({
          content: res.msg,
          showCancel: false
        })
        return
      }
      const nextAction = res.data[0].nextAction
      if(!nextAction) {
        wx.navigateTo({
          url: '/pages/asset/index',
        })
        return
      }
      const _nextAction = JSON.parse(nextAction)
      if (_nextAction.type != 0) {
        wx.navigateTo({
          url: '/pages/asset/index',
        })
        return
      }
      this.setData({
        orderId: _nextAction.id,
      })
      this.orderDetail()
    },
    async orderDetail() {
      if (!this.data.orderId) {
        return
      }
      wx.showLoading({
        title: '',
      })
      const res = await WXAPI.orderDetail(wx.getStorageSync('token'), this.data.orderId)
      wx.hideLoading()
      if (res.code != 0) {
        wx.showModal({
          content: res.msg,
          showCancel: false
        })
        return
      }
      // 绘制核销码
      if (res.data.orderInfo.hxNumber && res.data.orderInfo.status > 0 && res.data.orderInfo.status < 3) {
        this.wxaQrcode(res.data.orderInfo.hxNumber)
      }
      // 子快递单信息
      if (res.data.orderLogisticsShippers) {
        res.data.orderLogisticsShippers.forEach(ele => {
          if (ele.traces) {
            ele.tracesArray = JSON.parse (ele.traces)
            if (ele.tracesArray && ele.tracesArray.length > 0) {
              ele.tracesLast = ele.tracesArray[ele.tracesArray.length - 1].AcceptStation + '\n' + ele.tracesArray[ele.tracesArray.length - 1].AcceptTime
            }
          }
        })
      }
      let iotControl = false
      res.data.goods.forEach(ele => {
        if (ele.iotControl) {
          iotControl = true
        }
      })
      if (iotControl) {
        // 读取IoT设备列表
        this._shopIotDevices()
      }
      let orderStores = null
      if (res.data.orderStores) {
        orderStores = res.data.orderStores.filter(ele => ele.type == 2)
      }
      if (!res.data.extJson || Object.keys(res.data.extJson).length == 0) {
        delete res.data.extJson
      }
      this.setData({
        orderDetail: res.data,
        orderStores
      })
    },
    wuliuDetailsTap:function(e){
      var orderId = e.currentTarget.dataset.id;
      wx.navigateTo({
        url: "/pages/wuliu/index?id=" + orderId
      })
    },
    confirmBtnTap:function(e){
      let that = this;
      let orderId = this.data.orderId;
      wx.showModal({
          title: '确认您已收到商品？',
          content: '',
          success: function(res) {
            if (res.confirm) {
              WXAPI.orderDelivery(wx.getStorageSync('token'), orderId).then(function (res) {
                if (res.code == 0) {
                  that.orderDetail()
                }
              })
            }
          }
      })
    },
    async submitReputation(e) {
      let that = this;
      let postJsonString = {};
      postJsonString.token = wx.getStorageSync('token');
      postJsonString.orderId = this.data.orderId;
      let reputations = [];
      let i = 0;
      while (e.detail.value["orderGoodsId" + i]) {
        let orderGoodsId = e.detail.value["orderGoodsId" + i];
        let goodReputation = e.detail.value["goodReputation" + i];
        const goodReputationNumber = goodReputation
        let goodReputationRemark = e.detail.value["goodReputationRemark" + i];

        if (!goodReputation) {
          goodReputation = 0
        } else if(goodReputation <= 1) {
          goodReputation = 0
        } else if(goodReputation <= 4) {
          goodReputation = 1
        } else {
          goodReputation = 2
        }

        let reputations_json = {};
        reputations_json.id = orderGoodsId;
        reputations_json.reputation = goodReputation;
        reputations_json.reputationNumber = goodReputationNumber
        reputations_json.remark = goodReputationRemark;
        if (this.data.picsList && this.data.picsList[i] && this.data.picsList[i].length > 0) {
          reputations_json.pics = []
          for (let index = 0; index < this.data.picsList[i].length; index++) {
            const pic = this.data.picsList[i][index];
            const res = await WXAPI.uploadFileV2(wx.getStorageSync('token'), pic.url)
            if (res.code == 0) {
              reputations_json.pics.push(res.data.url)
            }
          }
        }
        reputations.push(reputations_json);
        i++;
      }
      postJsonString.reputations = reputations;
      WXAPI.orderReputation({
        postJsonString: JSON.stringify(postJsonString)
      }).then(function (res) {
        if (res.code == 0) {
          that.orderDetail()
        }
      })
    },
    afterPicRead(e) {
      const idx = e.currentTarget.dataset.idx
      let picsList = this.data.picsList
      if (!picsList) {
        picsList = []
        for (let index = 0; index < this.data.orderDetail.goods.length; index++) {
          picsList[index] = []
        }
      }
      picsList[idx] = picsList[idx].concat(e.detail.file)
      this.setData({
        picsList
      })
    },
    afterPicDel(e) {
      const idx = e.currentTarget.dataset.idx
      let picsList = this.data.picsList
      picsList[idx].splice(e.detail.index, 1)
      this.setData({
        picsList
      })
    },
    async wxaQrcode(hxNumber) {
      // https://www.yuque.com/apifm/nu0f75/ak40es
      const accountInfo = wx.getAccountInfoSync()
      const envVersion = accountInfo.miniProgram.envVersion
      const res = await WXAPI.wxaQrcode({
        scene: hxNumber,
        page: 'pages/order-details/scan-result',
        autoColor: true,
        expireHours: 1,
        env_version: envVersion,
        check_path: envVersion == 'release' ? true : false,
      })
      if (res.code != 0) {
        wx.showModal({
          content: res.msg,
          showCancel: false
        })
        return
      }
      this.setData({
        hxNumberQrcode: res.data
      })
    },
    async _shopIotDevices() {
      // https://www.yuque.com/apifm/nu0f75/ibg4icu15di25hfc
      const res = await WXAPI.shopIotDevices({
        token: wx.getStorageSync('token'),
        orderId: this.data.orderId
      })
      if (res.code == 0) {
        this.setData({
          shopIotDevices: res.data
        })
      }
    },
    async shopIotCmds(e) {
      const idx = e.target.dataset.idx
      const item = this.data.shopIotDevices[idx]
      // https://www.yuque.com/apifm/nu0f75/rek5dwng8b9cdoko
      const res = await WXAPI.shopIotCmds({
        token: wx.getStorageSync('token'),
        orderId: this.data.orderId,
        topic: item.topic
      })
      if (res.code != 0) {
        wx.showModal({
          content: res.msg
        })
        return
      }
      this.setData({
        cmdList: res.data,
        cmdListShow: true
      })
    },
    cmdClose() {
      this.setData({ cmdListShow: false });
    },
  
    async cmdSelect(event) {
      // https://www.yuque.com/apifm/nu0f75/uq495hlq3ho5kw4t
      console.log(event.detail);
      const res = await WXAPI.shopIotExecute({
        token: wx.getStorageSync('token'),
        orderId: this.data.orderId,
        topic: event.detail.topic,
        cmdId: event.detail.id,
      })
      if (res.code != 0) {
        wx.showModal({
          content: res.msg
        })
      } else {
        wx.showToast({
          title: '已发送',
        })
      }
    },
})