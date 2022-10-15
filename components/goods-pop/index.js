const WXAPI = require('apifm-wxapi')
const AUTH = require('../../utils/auth')
const TOOLS = require('../../utils/tools.js') // TOOLS.showTabBarBadge();

Component({
  behaviors: [],
  options: {
    addGlobalClass: true,
  },
  /**
   * 组件的对外属性，是属性名到属性设置的映射表
   */
  properties: {  
    skuCurGoodsBaseInfo: null,
  },

  /**
   * 组件的内部数据，和 properties 一同用于组件的模板渲染
   */
  data: {
    skuCurGoodsShow: false,
    skuCurGoods: undefined
  },
  // 组件数据字段监听器，用于监听 properties 和 data 的变化
  observers: {
    'skuCurGoodsBaseInfo': function(skuCurGoodsBaseInfo) {
      console.log('observers-skuCurGoodsBaseInfo', skuCurGoodsBaseInfo)
      if (!skuCurGoodsBaseInfo) {
        return
      }
      if (skuCurGoodsBaseInfo.stores <= 0) {
        wx.showToast({
          title: '已售罄~',
          icon: 'none'
        })
        return
      }
      this.initGoodsData(skuCurGoodsBaseInfo)
    }
  },
  lifetimes: {
    attached: function () {
      console.log('11', this.data.skuCurGoods);
    },
    detached: function () {
      // 在组件实例被从页面节点树移除时执行
    },
  },
  pageLifetimes: {
    // 组件所在页面的生命周期函数
    show: function () { 
      console.log('22', this.data.skuCurGoods);
    },
    hide: function () { },
    resize: function () { },
  },
  /**
   * 组件的方法列表
   */
  methods: {
    closeSku(){
      // 关闭弹窗
      this.setData({
        skuCurGoodsShow: false
      })
      wx.showTabBar()
    },
    async initGoodsData(skuCurGoodsBaseInfo) {
      const skuCurGoodsRes = await WXAPI.goodsDetail(skuCurGoodsBaseInfo.id)
      if (skuCurGoodsRes.code != 0) {
        wx.showToast({
          title: skuCurGoodsRes.msg,
          icon: 'none'
        })
        return
      }
      wx.hideTabBar()
      const skuCurGoods = skuCurGoodsRes.data
      skuCurGoods.basicInfo.storesBuy = 1
      // 处理可选配件
      let goodsAddition = []
      if (skuCurGoods.basicInfo.hasAddition) {
        const res = await WXAPI.goodsAddition(skuCurGoodsBaseInfo.id)
        if (res.code == 0) {
          goodsAddition = res.data
        }
      }
      console.log('abc:', skuCurGoods);
      this.setData({
        skuCurGoods,
        goodsAddition,
        skuGoodsPic: skuCurGoods.basicInfo.pic,
        selectSizePrice: skuCurGoods.basicInfo.minPrice,
        selectSizeOPrice: skuCurGoods.basicInfo.originalPrice,
        skuCurGoodsShow: true
      })
    },
    storesJia(){
      const skuCurGoods = this.data.skuCurGoods
      if (skuCurGoods.basicInfo.storesBuy < skuCurGoods.basicInfo.stores) {
        skuCurGoods.basicInfo.storesBuy++
        this.setData({
          skuCurGoods
        })
      }
    },
    storesJian(){
      const skuCurGoods = this.data.skuCurGoods
      if (skuCurGoods.basicInfo.storesBuy > 1) {
        skuCurGoods.basicInfo.storesBuy--
        this.setData({
          skuCurGoods
        })
      }
    },
    skuSelect(e){
      const skuCurGoods = this.data.skuCurGoods
      const propertyindex = e.currentTarget.dataset.propertyindex
      const propertychildindex = e.currentTarget.dataset.propertychildindex
      const property = this.data.skuCurGoods.properties[propertyindex]
      const child = property.childsCurGoods[propertychildindex]
      // 当前位置往下的所有sku取消选中状态
      for (let index = propertyindex; index < skuCurGoods.properties.length; index++) {
        const element = skuCurGoods.properties[index]
        element.optionValueId = null
        element.childsCurGoods.forEach(child => {
          child.active = false
        })
      }
      // 处理选中
      property.childsCurGoods.forEach(ele => {
        if (ele.id == child.id) {
          ele.active = true
        } else {
          ele.active = false
        }
      })
      // 隐藏没有的sku，不让选中
      let _skuList = skuCurGoods.skuList
      skuCurGoods.properties.forEach(p => {
        p.childsCurGoods.forEach(c => {
          // 处理当前选中的sku信息
          if (c.active) {
            _skuList = _skuList.filter(aaa => {
              return aaa.propertyChildIds.indexOf(p.id + ':' + c.id) != -1
            })
          } else if(!p.optionValueId) {
            const nextO = _skuList.find(aaa => {
              return aaa.propertyChildIds.indexOf(p.id + ':' + c.id) != -1
            })
            c.hidden = (nextO || p.id == property.id) ? false : true
          }
        })
      })
      // 显示图片
      let skuGoodsPic = this.data.skuGoodsPic
      if (skuCurGoods.subPics && skuCurGoods.subPics.length > 0) {
        const _subPic = skuCurGoods.subPics.find(ele => {
          return ele.optionValueId == child.id
        })
        if (_subPic) {
          skuGoodsPic = _subPic.pic
        }
      }
      this.setData({
        skuCurGoods,
        skuGoodsPic
      })
      // 计算价格
      this.calculateGoodsPrice()
    },
    /**
     * 选择可选配件
     */
    async additionSelect(e) {
      const propertyindex = e.currentTarget.dataset.propertyindex
      const propertychildindex = e.currentTarget.dataset.propertychildindex

      const goodsAddition = this.data.goodsAddition
      const property = goodsAddition[propertyindex]
      const child = property.items[propertychildindex]
      if (child.active) {
        // 该操作为取消选择
        child.active = false
        this.setData({
          goodsAddition
        })
        this.calculateGoodsPrice()
        return
      }
      // 单选配件取消所有子栏目选中状态
      if (property.type == 0) {
        property.items.forEach(child => {
          child.active = false
        })
      }
      // 设置当前选中状态
      child.active = true
      this.setData({
        goodsAddition
      })
      this.calculateGoodsPrice()
    },
    async calculateGoodsPrice() {
      // 计算最终的商品价格
      let price = this.data.skuCurGoods.basicInfo.minPrice
      let originalPrice = this.data.skuCurGoods.basicInfo.originalPrice
      let totalScoreToPay = this.data.skuCurGoods.basicInfo.minScore
      let buyNumMax = this.data.skuCurGoods.basicInfo.stores
      let buyNumber = this.data.skuCurGoods.basicInfo.minBuyNumber
      // 计算 sku 价格
      const needSelectNum = this.data.skuCurGoods.properties ? this.data.skuCurGoods.properties.length : 0
      let curSelectNum = 0;
      let propertyChildIds = "";
      let propertyChildNames = "";
      if (this.data.skuCurGoods.properties) {
        this.data.skuCurGoods.properties.forEach(p => {
          p.childsCurGoods.forEach(c => {
            if (c.active) {
              curSelectNum++;
              propertyChildIds = propertyChildIds + p.id + ":" + c.id + ",";
              propertyChildNames = propertyChildNames + p.name + ":" + c.name + "  ";
            }
          })
        })
      }
      let canSubmit = true;
      if (needSelectNum != curSelectNum) {
        canSubmit = false;
      }
      // 计算可选配件
      if (this.data.skuCurGoods.basicInfo.hasAddition && this.data.goodsAddition) {
        this.data.goodsAddition.forEach(ele => {
          if (ele.required) {
            const a = ele.items.find(item => {
              return item.active
            })
            if (!a) {
              canSubmit = false
            }
          }
        })
      }
      const token = wx.getStorageSync('token')
      if (canSubmit) {
        const res = await WXAPI.goodsPriceV2({
          token: token ? token : '',
          goodsId: this.data.skuCurGoods.basicInfo.id,
          propertyChildIds: propertyChildIds
        })
        if (res.code == 0) {
          price = res.data.price
          originalPrice = res.data.originalPrice
          totalScoreToPay = res.data.score
          buyNumMax = res.data.stores
        }
      }
      // 计算配件价格
      if (this.data.goodsAddition) {
        this.data.goodsAddition.forEach(big => {
          big.items.forEach(small => {
            if (small.active) {
              price = (price * 100 + small.price * 100) / 100
            }
          })
        })
      }
      this.setData({
        canSubmit,
        selectSizePrice: price,
        selectSizeOPrice: originalPrice,
        totalScoreToPay: totalScoreToPay,
        buyNumMax,
        buyNumber: (buyNumMax >= buyNumber) ? buyNumber : 0
      });
    },
    async addCarSku(){
      await this.calculateGoodsPrice()
      // 加入购物车
      if (!this.data.canSubmit) {
        wx.showToast({
          title: '请选择规格/配件',
          icon: 'none'
        })
        return
      }
      const skuCurGoods = this.data.skuCurGoods
      const sku = []
      if (skuCurGoods.properties) {
        skuCurGoods.properties.forEach(p => {
          const o = p.childsCurGoods.find(ele => {return ele.active})
          if (!o) {        
            return
          }
          sku.push({
            optionId: o.propertyId,
            optionValueId: o.id
          })
        })
      }
      const goodsAddition = []
      if (this.data.goodsAddition) {
        this.data.goodsAddition.forEach(ele => {
          ele.items.forEach(item => {
            if (item.active) {
              goodsAddition.push({
                id: item.id,
                pid: item.pid
              })
            }
          })
        })
      }
      const res = await WXAPI.shippingCarInfoAddItem(wx.getStorageSync('token'), skuCurGoods.basicInfo.id, skuCurGoods.basicInfo.storesBuy, sku, goodsAddition)
      if (res.code == 0) {
        wx.showToast({
          title: '加入成功',
          icon: 'success'
        })
        wx.showTabBar()
        TOOLS.showTabBarBadge() // 获取购物车数据，显示TabBarBadge
        this.setData({
          skuCurGoodsShow: false
        })
      } else {
        wx.showToast({
          title: res.msg,
          icon: 'none'
        })
      }
    },
  }
})