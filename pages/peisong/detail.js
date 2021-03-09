const app = getApp();
const CONFIG = require('../../config.js')
const WXAPI = require('apifm-wxapi')
import wxbarcode from 'wxbarcode'

Page({
    data:{
      orderId:0,
      goodsList:[],
      fileList: [],
      membersSelectIndex: -1,
      membersSelectStr: '请选择分配配送员',
    },
    onLoad:function(e){
      // e.peisongOrderId = 54
      var peisongOrderId = e.peisongOrderId;
      this.setData({
        peisongOrderId
      });
      this.peisongOrderDetail()
      this.peisongMemberInfo()
    },
    async peisongOrderDetail() {
      const res = await WXAPI.peisongOrderDetail(wx.getStorageSync('token'), this.data.peisongOrderId)
      if (res.code == 0) {
        this.setData({
          peisongOrderDetail: res.data
        })
      }
    },
    async peisongMemberInfo() {
      const res = await WXAPI.peisongMemberInfo(wx.getStorageSync('token'))
      if (res.code == 0) {
        this.setData({
          peisongMemberInfo: res.data
        })
        if (res.data.type == 2) {
          this.peisongMembers()
        }
      }
    },
    async peisongMembers() {
      const res = await WXAPI.peisongMembers({
        token: wx.getStorageSync('token')
      })
      if (res.code == 0) {
        res.data.result.forEach(ele => {
          ele.showStr = ele.name + ' ' + ele.mobile + ' ' + ele.statusStr
        })
        this.setData({
          peisongMembers: res.data.result
        })
      }
    },
    onShow : function () {
      var that = this;
      WXAPI.orderDetail(wx.getStorageSync('token'), 0, '', that.data.peisongOrderId).then(function (res) {
        if (res.code != 0) {
          wx.showModal({
            title: '错误',
            content: res.msg,
            showCancel: false
          })
          return;
        }
        // 绘制核销码
        if (res.data.orderInfo.hxNumber && res.data.orderInfo.status > 0) {
          wxbarcode.qrcode('qrcode', res.data.orderInfo.hxNumber, 650, 650);
        }        
        that.setData({
          orderDetail: res.data
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
          title: '确认服务已完成？',
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
    submitReputation: function (e) {
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

        let reputations_json = {};
        reputations_json.id = orderGoodsId;
        reputations_json.reputation = goodReputation;
        reputations_json.remark = goodReputationRemark;

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
    afterRead(event) {
      console.log(event.detail);
      const fileList = this.data.fileList
      event.detail.file.forEach(ele => {
        fileList.push({
          url: ele.path,
          name: '图片'
        })
      })
      this.setData({
        fileList
      });      
    },
    deletePic(event) {
      const fileList = this.data.fileList
      fileList.splice(event.detail.index, 1)
      this.setData({
        fileList
      });
    },
    async startService() {
      const extJsonStr = {}
      wx.showLoading({
        title: '提交中',
      })
      const res = await WXAPI.peisongStartService({
        token: wx.getStorageSync('token'),
        id: this.data.peisongOrderId,
        extJsonStr: JSON.stringify(extJsonStr)
      })
      wx.hideLoading({
        complete: (res) => {},
      })
      if (res.code != 0) {
        wx.showToast({
          title: res.msg,
          icon: 'none'
        })
      } else {
        wx.showToast({
          title: '提交成功',
          icon: 'success'
        })
        this.peisongOrderDetail()
        this.onShow()
      }
    },
    async endService() {
      const extJsonStr = {}
      let picNumber = 0
      wx.showLoading({
        title: '提交中',
      })
      const res = await WXAPI.peisongEndService({
        token: wx.getStorageSync('token'),
        id: this.data.peisongOrderId,
        extJsonStr: JSON.stringify(extJsonStr)
      })
      wx.hideLoading({
        complete: (res) => {},
      })
      if (res.code != 0) {
        wx.showToast({
          title: res.msg,
          icon: 'none'
        })
      } else {
        wx.showToast({
          title: '提交成功',
          icon: 'success'
        })
        this.setData({
          fileList: []
        })
        this.peisongOrderDetail()
        this.onShow()
      }
    },
    previewImage(e) {
      const logid = e.currentTarget.dataset.logid
      const current = e.currentTarget.dataset.current
      const urls = []
      this.data.peisongOrderDetail.logs.forEach(ele => {
        if (ele.id == logid) {
          Object.values(ele.extJson).forEach(_ele => {
            urls.push(_ele)
          })
        }
      })
      wx.previewImage({
        urls,
        current
      })
    },
    bindPickerChange: function(e) {
      const obj = this.data.peisongMembers[e.detail.value]
      this.setData({
        membersSelectIndex: e.detail.value,
        membersSelectStr: obj.name + ' ' + obj.mobile
      })
    },
    async paidan() {
      if (this.data.membersSelectIndex == -1) {
        wx.showToast({
          title: '请选择洗车工',
          icon: 'none'
        })
        return
      }
      const member = this.data.peisongMembers[this.data.membersSelectIndex]
      const res = await WXAPI.peisongOrderAllocation(wx.getStorageSync('token'), this.data.peisongOrderId, member.id)
      if (res.code != 0) {
        wx.showToast({
          title: res.msg,
          icon: 'none'
        })
      } else {
        wx.showToast({
          title: '派单成功',
          icon: 'success'
        })
        wx.navigateBack({
          complete: (res) => {},
        })
      }
    },
    callMobile() {
      wx.makePhoneCall({
        phoneNumber: this.data.orderDetail.peisongMember.mobile,
      })
    },
    callMobile2() {
      wx.makePhoneCall({
        phoneNumber: this.data.orderDetail.logistics.mobile,
      })
    },
    goMap() {
      const _this = this
      const latitude = this.data.orderDetail.logistics.latitude
      const longitude = this.data.orderDetail.logistics.longitude
      wx.openLocation({
        latitude,
        longitude,
        scale: 18
      })
    },
    estimatedCompletionTimeChange(value) {
      this.data.estimatedCompletionTimeChange = value.detail      
    },
    async estimatedCompletionTime(){
      if (!this.data.estimatedCompletionTimeChange) {
        wx.showToast({
          title: '填写预计完成时间',
          icon: 'none'
        })
        return;
      }
      const res = await WXAPI.peisongOrderEstimatedCompletionTime({
        token: wx.getStorageSync('token'),
        id: this.data.peisongOrderId,
        estimatedCompletionTime: this.data.estimatedCompletionTimeChange
      })
      if (res.code == 0) {
        wx.showToast({
          title: '设置成功',
          icon: 'success'
        })
        this.peisongOrderDetail()
        this.onShow()
      } else {
        wx.showToast({
          title: res.msg,
          icon: 'none'
        })
      }
    },
    async peisongOrderGrab(){
      if (!this.data.estimatedCompletionTimeChange) {
        wx.showToast({
          title: '填写预计完成时间',
          icon: 'none'
        })
        return;
      }
      const res = await WXAPI.peisongOrderGrab({
        token: wx.getStorageSync('token'),
        id: this.data.peisongOrderId,
        estimatedCompletionTime: this.data.estimatedCompletionTimeChange
      })
      if (res.code == 0) {
        wx.showToast({
          title: '抢单成功',
          icon: 'success'
        })
        this.peisongOrderDetail()
        this.onShow()
      } else {
        wx.showToast({
          title: res.msg,
          icon: 'none'
        })
      }
    },
})