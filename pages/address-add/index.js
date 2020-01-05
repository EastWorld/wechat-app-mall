const WXAPI = require('apifm-wxapi')
const AUTH = require('../../utils/auth')
//获取应用实例
var app = getApp()
Page({
  data: {
    showRegionStr: '请选择'
  },  
  async bindSave(e) {
    var that = this;
    var linkMan = e.detail.value.linkMan;
    var address = e.detail.value.address;
    var mobile = e.detail.value.mobile;
    const code = '322000';
    if (linkMan == ""){
      wx.showModal({
        title: '提示',
        content: '请填写联系人姓名',
        showCancel:false
      })
      return
    }
    if (mobile == ""){
      wx.showModal({
        title: '提示',
        content: '请填写手机号码',
        showCancel:false
      })
      return
    }
    if (!this.data.id && (!this.data.pObject || !this.data.cObject)){
      wx.showModal({
        title: '提示',
        content: '请选择地区',
        showCancel:false
      })
      return
    }
    if (address == ""){
      wx.showModal({
        title: '提示',
        content: '请填写详细地址',
        showCancel:false
      })
      return
    }    
    const postData = {
      token: wx.getStorageSync('token'),
      linkMan: linkMan,
      address: address,
      mobile: mobile,
      code: code,
      isDefault: 'true',
    }
    if (this.data.pObject) {
      postData.provinceId = this.data.pObject.id
    }
    if (this.data.cObject) {
      postData.cityId = this.data.cObject.id
    }
    if (this.data.dObject) {
      postData.districtId = this.data.dObject.id
    }    
    if (this.data.selectRegion && this.data.selectRegion.length > 3) {
      const extJsonStr = {}
      let _address = ''
      for (let i = 3; i < this.data.selectRegion.length; i++) {
        _address += this.data.selectRegion[i].name
      }
      extJsonStr['街道/社区'] = _address
      postData.extJsonStr = JSON.stringify(extJsonStr)
    }
    let apiResult
    if (that.data.id) {
      postData.id = this.data.id
      apiResult = await WXAPI.updateAddress(postData)
    } else {
      apiResult = await WXAPI.addAddress(postData)
    }
    if (apiResult.code != 0) {
      // 登录错误 
      wx.hideLoading();
      wx.showToast({
        title: apiResult.msg,
        icon: 'none'
      })
      return;
    } else {
      wx.navigateBack()
    }
  },
  onLoad: function (e) {
    const _this = this
    if (e.id) { // 修改初始化数据库数据
      WXAPI.addressDetail(wx.getStorageSync('token'), e.id).then(function (res) {
        if (res.code == 0) {
          let showRegionStr = res.data.info.provinceStr + res.data.info.cityStr + res.data.info.areaStr
          if (res.data.extJson && res.data.extJson['街道/社区']) {
            showRegionStr += res.data.extJson['街道/社区']
          }
          _this.setData({
            id: e.id,
            addressData: res.data.info,
            showRegionStr
          });
          return;
        } else {
          wx.showModal({
            title: '提示',
            content: '无法获取快递地址数据',
            showCancel: false
          })
        }
      })
    }
  },
  deleteAddress: function (e) {
    var that = this;
    var id = e.currentTarget.dataset.id;
    wx.showModal({
      title: '提示',
      content: '确定要删除该收货地址吗？',
      success: function (res) {
        if (res.confirm) {
          WXAPI.deleteAddress(wx.getStorageSync('token'), id).then(function () {
            wx.navigateBack({})
          })
        } else {
          console.log('用户点击取消')
        }
      }
    })
  },
  readFromWx() {
    AUTH.checkAndAuthorize('scope.address').then(() => {
      wx.chooseAddress({
        success: (res) => {
          this.setData({
            wxaddress: res
          });
        }
      })
    })
  },
  showRegionSelect(){
    this.setData({
      showRegionSelect: true
    })
  },
  closeAddress(){
    this.setData({
      showRegionSelect: false
    })
  },
  selectAddress(e){
    console.log(123, e.detail)
    const pObject = e.detail.selectRegion[0]
    const cObject = e.detail.selectRegion[1]
    const dObject = e.detail.selectRegion[2]
    let showRegionStr = ''
    e.detail.selectRegion.forEach(ele => {
      showRegionStr += ele.name
    })
    this.setData({
      pObject: pObject,
      cObject: cObject,
      dObject: dObject,
      showRegionStr: showRegionStr,
      selectRegion: e.detail.selectRegion
    })
  },
})
