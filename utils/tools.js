// 显示购物车tabBar的Badge
function showTabBarBadge(){
  wx.getStorage({
    key: 'shopCarInfo',
    success: function (res) {
      if (res.data.shopNum > 0) {
        wx.setTabBarBadge({
          index: 1,
          text: `${res.data.shopNum}`
        });
      } else {
        wx.removeTabBarBadge({
          index: 1
        });
      }
    }
  });
}

module.exports = {
  showTabBarBadge: showTabBarBadge
}