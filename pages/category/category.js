// pages/category/category.js

const WXAPI = require('apifm-wxapi')

Page({
  /**
   * 页面的初始数据
   */
  data: {
    categories: [],
    categorySelected: {
      name: '',
      id: ''
    },
    currentGoods: [],
    onLoadStatus: true,
    scrolltop: 0
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.initData();
  },
  initData() {
    let that = this;
    wx.showNavigationBarLoading();
    WXAPI.goodsCategory().then(function(res) {
      var categories = [];
      var categoryName = '';
      var categoryId = '';
      if (res.code == 0) {
        for (var i = 0; i < res.data.length; i++) {
          let item = res.data[i];
          categories.push(item);
          if (i == 0) {
            categoryName = item.name;
            categoryId = item.id;
          }
        }
      }
      that.setData({
        categories: categories,
        categorySelected: {
          name: categoryName,
          id: categoryId
        }
      });
      // console.log(categories);
      that.getGoodsList();
    }).catch((e) => {
      wx.hideNavigationBarLoading();
    });
  },
  getGoodsList: function() {
    let that = this;
    WXAPI.goods({
      categoryId: that.data.categorySelected.id,
      page: 1,
      pageSize: 100000
    }).then(function(res) {
      if (res.code == 404 || res.code == 700) {
        return
      }
      that.setData({
        currentGoods: res.data
      });
      console.log(res.data);
      wx.hideNavigationBarLoading();
    }).catch((e) => {
      wx.hideNavigationBarLoading();
    });
  },
  toDetailsTap: function(e) {
    wx.navigateTo({
      url: "/pages/goods-details/index?id=" + e.currentTarget.dataset.id
    })
  },
  onCategoryClick: function(e) {
    var that = this;
    var id = e.target.dataset.id;
    if (id === that.data.categorySelected.id) {
      that.setData({
        scrolltop: 0,
      })
    } else {
      var categoryName = '';
      for (var i = 0; i < that.data.categories.length; i++) {
        let item = that.data.categories[i];
        if (item.id == id) {
          categoryName = item.name;
          break;
        }
      }
      that.setData({
        categorySelected: {
          name: categoryName,
          id: id
        },
        scrolltop: 0
      });
      that.getGoodsList();
    }
  }
})