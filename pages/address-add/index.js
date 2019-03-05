const WXAPI = require('../../wxapi/main')
const regeneratorRuntime = require('../../utils/runtime')
//获取应用实例
var app = getApp()
Page({
  data: {
    pickerRegionRange: [],
    pickerSelect:[0, 0, 0],
    showRegionStr: '请选择'
  },
  initRegionPicker () {
    WXAPI.province().then(res => {
      if (res.code === 0) {
        let _pickerRegionRange = []
        _pickerRegionRange.push(res.data)
        _pickerRegionRange.push([{ name: '请选择' }])
        _pickerRegionRange.push([{ name: '请选择' }])
        this.data.pickerRegionRange = _pickerRegionRange
        this.bindcolumnchange({ detail: { column: 0, value: 0 } })
      }
    })
  },
  async initRegionDB (pname, cname, dname) {
    this.data.showRegionStr = pname + cname + dname
    let pObject = undefined
    let cObject = undefined
    let dObject = undefined
    if (pname) {
      const index = this.data.pickerRegionRange[0].findIndex(ele=>{
        return ele.name == pname
      })
      console.log('pindex', index)
      if (index >= 0) {
        this.data.pickerSelect[0] = index
        pObject = this.data.pickerRegionRange[0][index]
      }
    }    
    if (!pObject) {
      return
    }
    const _cRes = await WXAPI.nextRegion(pObject.id)
    if (_cRes.code === 0) {
      this.data.pickerRegionRange[1] = _cRes.data
      if (cname) {
        const index = this.data.pickerRegionRange[1].findIndex(ele => {
          return ele.name == cname
        })
        if (index >= 0) {
          this.data.pickerSelect[1] = index
          cObject = this.data.pickerRegionRange[1][index]
        }
      }
    }    
    if (!cObject) {
      return
    }
    const _dRes = await WXAPI.nextRegion(cObject.id)
    if (_dRes.code === 0) {
      this.data.pickerRegionRange[2] = _dRes.data
      if (dname) {
        const index = this.data.pickerRegionRange[2].findIndex(ele => {
          return ele.name == dname
        })
        if (index >= 0) {
          this.data.pickerSelect[2] = index
          dObject = this.data.pickerRegionRange[2][index]
        }
      }
    }
    this.setData({
      pickerRegionRange: this.data.pickerRegionRange,
      pickerSelect: this.data.pickerSelect,
      showRegionStr: this.data.showRegionStr,
      pObject: pObject,
      cObject: cObject,
      dObject: dObject
    })
  },
  bindchange: function(e) {
    console.log(e)
    const pObject = this.data.pickerRegionRange[0][e.detail.value[0]]
    const cObject = this.data.pickerRegionRange[1][e.detail.value[1]]
    const dObject = this.data.pickerRegionRange[2][e.detail.value[2]]
    const showRegionStr = pObject.name + cObject.name + dObject.name
    this.setData({
      pObject: pObject,
      cObject: cObject,
      dObject: dObject,
      showRegionStr: showRegionStr
    })
  },
  bindcolumnchange: function(e) {
    const column = e.detail.column
    const index = e.detail.value
    const regionObject = this.data.pickerRegionRange[column][index]
    console.log('bindcolumnchange', regionObject)
    if (column === 2) {
      this.setData({
        pickerRegionRange: this.data.pickerRegionRange
      })
      return
    }
    if (column === 1) {
      this.data.pickerRegionRange[2] = [{ name: '请选择' }]
    }
    if (column === 0) {
      this.data.pickerRegionRange[1] = [{ name: '请选择' }]
      this.data.pickerRegionRange[2] = [{ name: '请选择' }]
    }
    // 后面的数组全部清空
    this.data.pickerRegionRange.splice(column+1)
    // 追加后面的一级数组
    WXAPI.nextRegion(regionObject.id).then(res => {
      if (res.code === 0) {
        this.data.pickerRegionRange[column + 1] = res.data     
      }
      this.bindcolumnchange({ detail: { column: column + 1, value: 0 } })
    })
  },
  bindSave: function(e) {
    WXAPI.addTempleMsgFormid({
      token: wx.getStorageSync('token'),
      type: 'form',
      formId: e.detail.formId
    })
    var that = this;
    var linkMan = e.detail.value.linkMan;
    var address = e.detail.value.address;
    var mobile = e.detail.value.mobile;
    var code = e.detail.value.code;
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
    if (!this.data.pObject || !this.data.cObject){
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
    if (code == ""){
      wx.showModal({
        title: '提示',
        content: '请填写邮编',
        showCancel:false
      })
      return
    }
    let apiResult
    if (that.data.id) {
      apiResult = WXAPI.updateAddress({
        token: wx.getStorageSync('token'),
        id: that.data.id,
        provinceId: this.data.pObject.id,
        cityId: this.data.cObject.id,
        districtId: this.data.dObject ? this.data.dObject.id : '',
        linkMan: linkMan,
        address: address,
        mobile: mobile,
        code: code,
        isDefault: 'true'
      })
    } else {
      apiResult = WXAPI.addAddress({
        token: wx.getStorageSync('token'),
        provinceId: this.data.pObject.id,
        cityId: this.data.cObject.id,
        districtId: this.data.dObject ? this.data.dObject.id : '',
        linkMan: linkMan,
        address: address,
        mobile: mobile,
        code: code,
        isDefault: 'true'
      })
    }
    apiResult.then(function (res) {
      if (res.code != 0) {
        // 登录错误 
        wx.hideLoading();
        wx.showModal({
          title: '失败',
          content: res.msg,
          showCancel: false
        })
        return;
      }
      // 跳转到结算页面
      wx.navigateBack({})
    })
  },
  onLoad: function (e) {
    const _this = this
    _this.initRegionPicker() // 初始化省市区选择器
    if (e.id) { // 修改初始化数据库数据
      WXAPI.addressDetail(e.id, wx.getStorageSync('token')).then(function (res) {
        if (res.code === 0) {
          _this.setData({
            id: e.id,
            addressData: res.data,
            showRegionStr: res.data.provinceStr + res.data.cityStr + res.data.areaStr
          });
          _this.initRegionDB(res.data.provinceStr, res.data.cityStr, res.data.areaStr)
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
          WXAPI.deleteAddress(id, wx.getStorageSync('token')).then(function () {
            wx.navigateBack({})
          })
        } else {
          console.log('用户点击取消')
        }
      }
    })
  },
  readFromWx : function () {
    const _this = this
    wx.chooseAddress({
      success: function (res) {
        console.log(res)
        _this.initRegionDB(res.provinceName, res.cityName, res.countyName)
        _this.setData({
          wxaddress: res
        });
      }
    })
  }
})
