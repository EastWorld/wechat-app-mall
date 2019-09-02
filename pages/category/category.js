// pages/category/category.js

const WXAPI = require('../../wxapi/main')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    categories: [],
    goodsWrap: [],
    categorySelected: "",
    goodsToView: "",
    categoryToView: "",
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
      if (res.code == 0) {
        for (var i = 0; i < res.data.length; i++) {

          let item = res.data[i];

          item.scrollId = "s" + item.id;
          categories.push(item);

          if (i == 0) {

            that.setData({
              categorySelected: item.scrollId,
            })

          }
        }
      }
      that.setData({
        categories: categories,

      });
      console.log(categories);
      that.getGoodsList(0);
    }).catch((e) => {

      wx.hideNavigationBarLoading();
    });

  },
  getGoodsList: function(categoryId, append) {

    let that = this;

    WXAPI.goods({
      categoryId: "",
      page: 1,
      pageSize: 100000
    }).then(function(res) {
      if (res.code == 404 || res.code == 700) {

        return
      }
      let goodsWrap = [];


      that.data.categories.forEach((o, index) => {

        let wrap = {};
        wrap.id = o.id;
        wrap.scrollId = "s" + o.id;
        wrap.name = o.name;
        let goods = [];

        wrap.goods = goods;
        res.data.forEach((item, i) => {

          if (item.categoryId == wrap.id) {

            goods.push(item)
          }
        })

        goodsWrap.push(wrap);
      })



      that.setData({
        goodsWrap: goodsWrap,
      });

      console.log(goodsWrap);

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

    let id = e.currentTarget.dataset.id;
    this.categoryClick = true;
    this.setData({
      goodsToView: id,
      categorySelected: id,
    })

  },
  scroll: function(e) {

    if (this.categoryClick){
      this.categoryClick = false;
      return;
    }

    let scrollTop = e.detail.scrollTop;

    let that = this;

    let offset = 0;
    let isBreak = false;

    for (let g = 0; g < this.data.goodsWrap.length; g++) {

      let goodWrap = this.data.goodsWrap[g];

      offset += 30;

      if (scrollTop <= offset) {

        if (this.data.categoryToView != goodWrap.scrollId) {
          this.setData({
            categorySelected: goodWrap.scrollId,
            categoryToView: goodWrap.scrollId,
          })
        }

        break;
      }


      for (let i = 0; i < goodWrap.goods.length; i++) {

        offset += 91;

        if (scrollTop <= offset) {

          if (this.data.categoryToView != goodWrap.scrollId) {
            this.setData({
              categorySelected: goodWrap.scrollId,
              categoryToView: goodWrap.scrollId,
            })
          }

          isBreak = true;
          break;
        }
      }

      if (isBreak){
        break;
      }


    }

  
  }
})