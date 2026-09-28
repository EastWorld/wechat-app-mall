const WXAPI = require('apifm-wxapi')
const AUTH = require('../../utils/auth')

Page({
  data: {
    id: null,
    isEdit: false,
    submitting: false,
    form: {
      name: '',
      content: '',
      pic: '',
      linkMan: '',
      mobile: '',
      address: '', // 详细门牌（楼栋/房号）
    },
    picFileList: [],
    uploading: false,

    // ── 四级地址级联 ──────────────────────────────────────────────
    provinces: null, // [{id, name}, ...]，null 表示尚未加载
    pIndex: 0,
    cities: null,
    cIndex: 0,
    areas: null,
    aIndex: 0,
    streets: null,   // null 表示当前区县无街道数据（不显示街道 picker）
    sIndex: 0,
    addrLoading: false,
  },

  onLoad(options) {
    AUTH.checkHasLogined().then(isLogined => {
      if (!isLogined) {
        getApp().loginOK = () => {
          if (options.id) this.enterEditMode(options.id)
          else this._initProvinces()
        }
        wx.navigateTo({ url: '/pages/login/index' })
        return
      }
      if (options.id) this.enterEditMode(options.id)
      else this._initProvinces()
    })
  },

  enterEditMode(id) {
    this.setData({ id, isEdit: true })
    wx.setNavigationBarTitle({ title: '编辑接龙' })
    this.loadDetail(id)
  },

  async loadDetail(id) {
    wx.showLoading({ title: '加载中...' })
    const res = await WXAPI.listingDetail(id)
    wx.hideLoading()
    if (res.code == 0 && res.data && res.data.info) {
      const info = res.data.info
      this.setData({
        form: {
          name:    info.name    || '',
          content: info.content || '',
          pic:     info.pic     || '',
          linkMan: info.linkMan || '',
          mobile:  info.mobile  || '',
          address: info.address || '',
        },
        picFileList: info.pic ? [{ url: info.pic }] : [],
      })
      // 带已有地址 ID 初始化省份，逐级还原已选项
      this._initProvinces(info.provinceId, info.cityId, info.districtId, info.streetId)
    } else {
      wx.showToast({ title: '加载失败，请重试', icon: 'none' })
      this._initProvinces()
    }
  },

  // ── 地址级联：加载省份 ───────────────────────────────────────────
  async _initProvinces(provinceId, cityId, districtId, streetId) {
    this.setData({ addrLoading: true })
    const res = await WXAPI.provinceV2()
    this.setData({ addrLoading: false })
    if (res.code != 0) return
    const provinces = [{ id: 0, name: '请选择省份' }].concat(res.data)
    let pIndex = 0
    if (provinceId) {
      const idx = provinces.findIndex(p => String(p.id) === String(provinceId))
      if (idx > 0) pIndex = idx
    }
    this.setData({ provinces, pIndex })
    if (pIndex > 0) {
      this.onProvinceChange({ detail: { value: pIndex } }, cityId, districtId, streetId)
    }
  },

  // 省份切换
  async onProvinceChange(e, cityId, districtId, streetId) {
    const index = Number(e.detail.value)
    this.setData({ pIndex: index, cities: null, cIndex: 0, areas: null, aIndex: 0, streets: null, sIndex: 0 })
    const pid = this.data.provinces[index].id
    if (!pid) return
    const res = await WXAPI.nextRegionV2(pid)
    if (res.code != 0) return
    const cities = [{ id: 0, name: '请选择城市' }].concat(res.data)
    let cIndex = 0
    if (cityId) {
      const idx = cities.findIndex(c => String(c.id) === String(cityId))
      if (idx > 0) cIndex = idx
    }
    this.setData({ cities, cIndex })
    if (cIndex > 0) {
      this.onCityChange({ detail: { value: cIndex } }, districtId, streetId)
    }
  },

  // 城市切换
  async onCityChange(e, districtId, streetId) {
    const index = Number(e.detail.value)
    this.setData({ cIndex: index, areas: null, aIndex: 0, streets: null, sIndex: 0 })
    const pid = this.data.cities[index].id
    if (!pid) return
    const res = await WXAPI.nextRegionV2(pid)
    if (res.code != 0) return
    const areas = [{ id: 0, name: '请选择区/县' }].concat(res.data)
    let aIndex = 0
    if (districtId) {
      const idx = areas.findIndex(a => String(a.id) === String(districtId))
      if (idx > 0) aIndex = idx
    }
    this.setData({ areas, aIndex })
    if (aIndex > 0) {
      this.onAreaChange({ detail: { value: aIndex } }, streetId)
    }
  },

  // 区县切换 —— 有街道数据才显示街道 picker
  async onAreaChange(e, streetId) {
    const index = Number(e.detail.value)
    this.setData({ aIndex: index, streets: null, sIndex: 0 })
    const pid = this.data.areas[index].id
    if (!pid) return
    const res = await WXAPI.nextRegionV2(pid)
    if (res.code == 0 && res.data && res.data.length > 0) {
      // 当前区县下有街道级数据，显示街道 picker
      const streets = [{ id: 0, name: '请选择街道/镇' }].concat(res.data)
      let sIndex = 0
      if (streetId) {
        const idx = streets.findIndex(s => String(s.id) === String(streetId))
        if (idx > 0) sIndex = idx
      }
      this.setData({ streets, sIndex })
    }
    // res.data 为空 → streets 保持 null → 街道 picker 不渲染
  },

  // 街道切换
  onStreetChange(e) {
    this.setData({ sIndex: Number(e.detail.value) })
  },

  // ── 表单输入 ─────────────────────────────────────────────────────
  onInput(e) {
    const field = e.currentTarget.dataset.field
    this.setData({ [`form.${field}`]: e.detail.value })
  },

  // ── 封面图：压缩 + 上传 ──────────────────────────────────────────
  _compressImage(tempFilePath, fileSize) {
    return new Promise(resolve => {
      if (fileSize && fileSize < 300 * 1024) {
        resolve(tempFilePath)
        return
      }
      wx.compressImage({
        src: tempFilePath,
        quality: 75,
        success: res => resolve(res.tempFilePath),
        fail: () => {
          console.warn('[listing-edit] wx.compressImage 不可用，回退原图上传')
          resolve(tempFilePath)
        },
      })
    })
  },

  async onUploadPic(e) {
    const file = e.detail.file
    if (!file || !file.url) return
    const token = wx.getStorageSync('token')
    this.setData({ uploading: true })
    try {
      wx.showLoading({ title: '压缩图片中…' })
      const compressedPath = await this._compressImage(file.url, file.size)
      wx.showLoading({ title: '上传中…' })
      const res = await WXAPI.uploadFileV2(token, compressedPath)
      if (res.code == 0) {
        const url = res.data.url
        this.setData({ 'form.pic': url, picFileList: [{ url }] })
      } else {
        wx.showToast({ title: res.msg || '上传失败', icon: 'none' })
        this.setData({ picFileList: this.data.form.pic ? [{ url: this.data.form.pic }] : [] })
      }
    } catch (err) {
      wx.showToast({ title: '上传失败', icon: 'none' })
      this.setData({ picFileList: this.data.form.pic ? [{ url: this.data.form.pic }] : [] })
    } finally {
      this.setData({ uploading: false })
      wx.hideLoading()
    }
  },

  onDeletePic() {
    this.setData({ 'form.pic': '', picFileList: [] })
  },

  // ── 校验 ─────────────────────────────────────────────────────────
  _validate() {
    const { name, mobile } = this.data.form
    if (!name.trim()) {
      wx.showToast({ title: '请填写接龙名称', icon: 'none' })
      return false
    }
    if (name.trim().length > 30) {
      wx.showToast({ title: '名称不能超过 30 个字', icon: 'none' })
      return false
    }
    if (mobile && !/^1[3-9]\d{9}$/.test(mobile)) {
      wx.showToast({ title: '手机号格式不正确', icon: 'none' })
      return false
    }
    return true
  },

  // ── 提交 ─────────────────────────────────────────────────────────
  async submit() {
    if (this.data.submitting || this.data.uploading) return
    if (!this._validate()) return

    this.setData({ submitting: true })
    const { name, content, pic, linkMan, mobile, address } = this.data.form
    const postData = {
      token:   wx.getStorageSync('token'),
      name:    name.trim(),
      content: content.trim(),
      pic,
      linkMan: linkMan.trim(),
      mobile:  mobile.trim(),
      address: address.trim(),
    }

    // 地址 ID（有选择才传）
    const { pIndex, cIndex, aIndex, sIndex, provinces, cities, areas, streets } = this.data
    if (provinces && pIndex > 0) postData.provinceId = provinces[pIndex].id
    if (cities   && cIndex > 0) postData.cityId      = cities[cIndex].id
    if (areas    && aIndex > 0) postData.districtId  = areas[aIndex].id
    if (streets  && sIndex > 0) postData.streetId    = streets[sIndex].id

    if (this.data.id) postData.id = this.data.id

    const res = await WXAPI.listingSave(postData)
    this.setData({ submitting: false })

    if (res.code == 0) {
      wx.showToast({ title: this.data.isEdit ? '修改成功 ✓' : '创建成功 🎉' })
      setTimeout(() => {
        if (this.data.isEdit) {
          wx.navigateBack()
        } else {
          const newId = res.data && res.data.id
          if (newId) {
            wx.redirectTo({ url: `/marketing/listing/detail?id=${newId}` })
          } else {
            wx.navigateBack()
          }
        }
      }, 1200)
    } else {
      wx.showToast({ title: res.msg || '保存失败，请重试', icon: 'none' })
    }
  },
})
