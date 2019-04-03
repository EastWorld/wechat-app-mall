const WXAPI = require('../wxapi/main')

/**
 * type: order 支付订单 recharge 充值 paybill 优惠买单
 * data: 扩展数据对象，用于保存参数
 */
function wxpay(type, money, orderId, redirectUrl, data) {
  let remark = "在线充值";
  let nextAction = {};
  if (type === 'order') {
    remark = "支付订单 ：" + orderId;
    nextAction = {
      type: 0,
      id: orderId
    };
  }
  if (type === 'paybill') {
    remark = "优惠买单 ：" + data.money;
    nextAction = {
      type: 4,
      uid: wx.getStorageSync('uid'),
      money: data.money
    };
  }
  WXAPI.wxpay({
    token: wx.getStorageSync('token'),
    money: money,
    remark: remark,
    payName: remark,
    nextAction: JSON.stringify(nextAction)
  }).then(function (res) {
    if (res.code == 0) {
      // 发起支付
      wx.requestPayment({
        timeStamp: res.data.timeStamp,
        nonceStr: res.data.nonceStr,
        package: 'prepay_id=' + res.data.prepayId,
        signType: 'MD5',
        paySign: res.data.sign,
        fail: function (aaa) {
          wx.showToast({
            title: '支付失败:' + aaa
          })
        },
        success: function () {
          // 保存 formid
          WXAPI.addTempleMsgFormid({
            token: wx.getStorageSync('token'),
            type: 'pay',
            formId: res.data.prepayId
          })
          // 提示支付成功
          wx.showToast({
            title: '支付成功'
          })
          wx.redirectTo({
            url: redirectUrl
          });
        }
      })
    } else {
      wx.showModal({
        title: '出错了',
        content: res.code + ':' + res.msg + ':' + res.data,
        showCancel: false,
        success: function (res) {

        }
      })
    }
  })
}

module.exports = {
  wxpay: wxpay
}