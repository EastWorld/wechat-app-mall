const api = require('./request.js')
function wxpay(app, money, orderId, redirectUrl) {
  let remark = "在线充值";
  let nextAction = {};
  if (orderId != 0) {
    remark = "支付订单 ：" + orderId;
    nextAction = { type: 0, id: orderId };
  }
  api.fetchRequest('/pay/wx/wxapp', {
    token: wx.getStorageSync('token'),
    money: money,
    remark: remark,
    payName: "在线支付",
    nextAction: nextAction
  }).then(function (res) {
    if (res.data.code == 0) {
      // 发起支付
      wx.requestPayment({
        timeStamp: res.data.data.timeStamp,
        nonceStr: res.data.data.nonceStr,
        package: 'prepay_id=' + res.data.data.prepayId,
        signType: 'MD5',
        paySign: res.data.data.sign,
        fail: function (aaa) {
          wx.showToast({ title: '支付失败:' + aaa })
        },
        success: function () {
          // 保存 formid
          api.fetchRequest('/template-msg/wxa/formId', {
            token: wx.getStorageSync('token'),
            type: 'pay',
            formId: res.data.data.prepayId
          })
          // 提示支付成功
          wx.showToast({ title: '支付成功' })
          wx.redirectTo({
            url: redirectUrl
          });
        }
      })
    } else {
      wx.showModal({
        title: '出错了',
        content: res.data.code + ':' + res.data.msg + ':' + res.data.data,
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
