const WXAPI = require('apifm-wxapi')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    listType: 1, // 1为1个商品一行，2为2个商品一行    
    name: '', // 搜索关键词
    orderBy: '', // 排序规则
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      name: options.name,
      categoryId: options.categoryId
    })
    this.search()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },
  async search(){
    // 搜索商品
    wx.showLoading({
      title: '加载中',
    })
    const _data = {
      orderBy: this.data.orderBy,
      page: 1,
      pageSize: 500,
    }
    if (this.data.name) {
      _data.nameLike = this.data.name
    }
    if (this.data.categoryId) {
      _data.categoryId = this.data.categoryId
    }
    const res = await WXAPI.goods(_data)
    wx.hideLoading()
    if (res.code == 0) {
      this.setData({
        goods: res.data,
      })
    }
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },
  changeShowType(){
    if (this.data.listType == 1) {
      this.setData({
        listType: 2
      })
    } else {
      this.setData({
        listType: 1
      })
    }
  },
  bindinput(e){
    this.setData({
      name: e.detail.value
    })
  },
  bindconfirm(e){
    this.setData({
      name: e.detail.value
    })
    this.search()
  },
  filter(e){
    this.setData({
      orderBy: e.currentTarget.dataset.val
    })
    this.search()
  },
})