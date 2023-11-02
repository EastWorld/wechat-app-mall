const app = getApp();
const CONFIG = require('../../config.js')
const WXAPI = require('apifm-wxapi')

Page({
    data:{
      orderId:0,
      goodsList:[]
    },
    onLoad:function(e){
      // e.id = 478785
      var orderId = e.id;
      this.data.orderId = orderId;
      this.setData({
        orderId: orderId
      });
    },
    onShow : function () {
      var that = this;
      WXAPI.orderDetail(wx.getStorageSync('token'), that.data.orderId).then(function (res) {
        if (res.code != 0) {
          wx.showModal({
            title: '错误',
            content: res.msg,
            showCancel: false
          })
          return;
        }
        // 绘制核销码
        if (res.data.orderInfo.hxNumber && res.data.orderInfo.status > 0 && res.data.orderInfo.status < 3) {
          that.wxaQrcode(res.data.orderInfo.hxNumber)
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
          that._shopIotDevices()
        }
        let orderStores = null
        if (res.data.orderStores) {
          orderStores = res.data.orderStores.filter(ele => ele.type == 2)
        }
        that.setData({
          orderDetail: res.data,
          orderStores
        });
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
                  that.onShow();                  
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
          that.onShow();
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
        wx.wx.showModal({
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