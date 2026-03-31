const WXAPI = require('apifm-wxapi')
const AUTH = require('../../utils/auth')

const app = getApp()
Page({
  data: {
    page: 1
  },
  selectTap: function(e) {
    console.log(e);
    var id = e.currentTarget.dataset.id;
    WXAPI.updateAddress({
      token: wx.getStorageSync('token'),
      id: id,
      isDefault: 'true'
    }).then(function(res) {
      wx.navigateBack({})
    })
  },

  addAddess: function() {
    wx.navigateTo({
      url: "/pages/address-add/index"
    })
  },

  editAddess: function(e) {
    console.log(e);
    
    wx.navigateTo({
      url: "/pages/address-add/index?id=" + e.currentTarget.dataset.id
    })
  },

  onLoad() {
    
  },
  onShow: function() {
    this.initShippingAddress();
  },
  async initShippingAddress() {
    wx.showLoading({
      title: '',
    })
    const res = await WXAPI.queryAddressV2({
      token: wx.getStorageSync('token')
    })
    wx.hideLoading({
      success: (res) => {},
    })
    if (res.code == 0) {
      this.setData({
        addressList: res.data.result
      });
    } else if (res.code == 700) {
      this.setData({
        addressList: null
      });
    } else {
      wx.showToast({
        title: res.msg,
        icon: 'none'
      })
    }
  },
  onPullDownRefresh() {
    this.data.page = 1
    this.initShippingAddress()
    wx.stopPullDownRefresh()
  },
  deleteAddress(e) {
    const id = e.currentTarget.dataset.id
    const index = e.currentTarget.dataset.index
    wx.showModal({
      content: '确定要删除该收货地址吗？',
      success: async (res) => {
        if (res.confirm) {
          // https://www.yuque.com/apifm/nu0f75/gb0a2k
          wx.showLoading({
            title: '',
          })
          const res = await WXAPI.deleteAddress(wx.getStorageSync('token'), id)
          wx.hideLoading()
          if (res.code != 0) {
            wx.showToast({
              title: res.msg,
              icon: 'none'
            })
          } else {
            wx.showToast({
              title: '删除成功',
              icon: 'none'
            })
            this.data.addressList.splice(index, 1)
            this.setData({
              addressList: this.data.addressList
            })
          }
        }
      }
    })
  },
})