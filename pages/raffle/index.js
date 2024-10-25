const WXAPI = require('apifm-wxapi');
const {
  unix
} = require('dayjs');
//计数器
var interval = null;
//值越大旋转时间越长  即旋转速度
var intime = 50;
Page({
  data: {
    id: undefined,
    border: ['border:none', 'border:none', 'border:none', 'border:none', 'border:none', 'border:none', 'border:none', 'border:none'],
    btnconfirm: 'https://dcdn.it120.cc/2024/04/12/21578e4c-575a-48dd-9825-072d92f7a3e8.png',
    clickLuck: 'clickLuck',
    luckPosition: 0,
  },
  onLoad(e) {
    this.data.id = e.id
    this.loadAnimation(); // 进入页面时缓慢切换
    this.luckyInfo()
  },
  onShow() {},
  onShareAppMessage() {

  },
  async luckyInfo() {
    wx.showLoading({
      title: ''
    })
    const res = await WXAPI.luckyInfo(this.data.id)
    wx.hideLoading()
    if (res.code == 0) {
      let timesPerUser = res.data.info.timesPerUser
      let luckyGoods = res.data.luckyGoods
      if (!luckyGoods) {
        luckyGoods = []
      }
      // 补全9个
      for (let index = 0; index < 9; index++) {
        luckyGoods.push({
          goodsId: -2, // 补全
          pic: "https://dcdn.it120.cc/2024/04/12/b5fa1fa4-66f2-4ac0-9261-480e6df1df9b.jpg",
          title: "谢谢参与"
        })
      }
      const uid = wx.getStorageSync('uid')
      let logs
      if (uid) {
        const res2 = await WXAPI.luckyInfoJoinLogs({
          lid: this.data.id,
          uid
        })
        if (res2.code == 0) {
          timesPerUser -= res2.data.totalRow
          logs = res2.data.result
        }
      } else {
        logs = null
      }
      this.setData({
        timesPerUser,
        logs,
        luckyGoods
      })
    }
  },
  loadAnimation() {
    var e = this;
    var index = 0;
    // if (interval == null){
    interval = setInterval(function () {
      if (index > 7) {
        index = 0;
        e.data.border[7] = 'border:none'
      } else if (index != 0) {
        e.data.border[index - 1] = 'border:none'
      }
      e.data.border[index] = 'border:6rpx solid #9077c4;border-radius:40rpx;width:168rpx;height:168rpx'
      e.setData({
        border: e.data.border,
      })
      index++;
    }, 1000);
    // }  
  },
  async getLuckyInfoJoin() { // 点击抽奖
    if (this.data.clickLuck == '') {
      return;
    }
    if (this.data.timesPerUser <= 0) {
      wx.showToast({
        title: '抽奖次数已用完',
        icon: 'none'
      })
      return
    }
    const token = wx.getStorageSync('token')
    wx.showLoading({
      title: '',
    })
    const res = await WXAPI.luckyInfoJoin(this.data.id, token)
    wx.hideLoading()
    if (res.code == 2000) {
      wx.navigateTo({
          url: '/pages/login/index',
      })
      return
    }
    if (res.code != 0) {
      wx.showToast({
        title: res.msg,
        icon: 'none'
      })
      return
    }
    const prizeName = res.data.prizeName
    const luckPosition = this.data.luckyGoods.findIndex(ele => ele.title == prizeName) // 服务器返回的中奖的是哪个商品
    this.setData({
      luckPosition
    })
    this.clickLuck()
  },
  clickLuck() {
    var e = this;
    if (this.data.clickLuck == '') {
      return;
    }
    //设置按钮不可点击
    this.setData({
      btnconfirm: 'https://dcdn.it120.cc/2024/04/12/816d31c4-cb18-4107-8934-00999356a682.png',
      clickLuck: '',
    })
    //清空计时器
    clearInterval(interval);
    var index = 0;
    //循环设置每一项的透明度
    interval = setInterval(function () {
      if (index > 7) {
        index = 0;
        e.data.border[7] = 'border:none'
      } else if (index != 0) {
        e.data.border[index - 1] = 'border:none'
      }
      e.data.border[index] = 'border:6rpx solid #9077c4;border-radius:40rpx;width:168rpx;height:168rpx'
      e.setData({
        border: e.data.border
      })
      index++;
    }, intime);

    //模拟网络请求时间  设为两秒
    var stoptime = 2000;
    setTimeout(function () {
      e.stop(e.data.luckPosition);
    }, stoptime)

  },
  stop(which) {
    var e = this;
    //清空计数器
    clearInterval(interval);
    //初始化当前位置
    var current = -1;
    var border = e.data.border;

    for (var i = 0; i < border.length; i++) {
      if (border[i] == 'border:6rpx solid #ee6916;border-radius:40rpx;width:168rpx;height:168rpx') {
        current = i;
      }
    }
    //下标从1开始
    var index = current + 1;
    this.stopLuck(which, index, intime, 10);
  },
  /**
   * which:中奖位置
   * index:当前位置
   * time：时间标记
   * splittime：每次增加的时间 值越大减速越快
   */
  stopLuck(which, index, time, splittime) {
    var e = this;
    //值越大出现中奖结果后减速时间越长
    var border = e.data.border;
    setTimeout(function () {
      //重置前一个位置
      if (index > 7) {
        index = 0;
        border[7] = 'border:none;'
      } else if (index != 0) {
        border[index - 1] = 'border:none;'
      }
      //当前位置为选中状态
      e.data.border[index] = 'border:6rpx solid #ee6916;border-radius:40rpx;width:168rpx;height:168rpx'
      e.setData({
        border: e.data.border
      })
      //如果旋转时间过短或者当前位置不等于中奖位置则递归执行
      //直到旋转至中奖位置
      if (time < 400 || index != which) {
        //越来越慢
        splittime++;
        time += splittime;
        //当前位置+1
        index++;
        e.stopLuck(which, index, time, splittime);
      } else {

        //抽奖后是否可以再次抽奖，可以的再次抽奖设为:'clickLuck',不能再次抽奖设为''
        e.setData({
          clickLuck: 'clickLuck'
        })

        //1秒后显示弹窗
        setTimeout(function () {
          wx.showModal({
            title: '中奖提示',
            content: e.data.luckPosition == 6 ? '非常遗憾，您没有中奖，谢谢您的参与。' : '恭喜抽中: ' + e.data.luckyGoods[e.data.luckPosition].title,
            showCancel: false,
            success: function (res) {
              if (res.confirm) {
                //设置按钮可以点击
                e.setData({
                  btnconfirm: 'https://dcdn.it120.cc/2024/04/12/21578e4c-575a-48dd-9825-072d92f7a3e8.png',
                  clickLuck: 'clickLuck',
                })
                e.loadAnimation();
                e.luckyInfo()
              }
            }
          })
        }, 600);
      }
    }, time);
    console.log(time);
  },
})