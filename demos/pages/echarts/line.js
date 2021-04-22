const WXAPI = require('apifm-wxapi')
import * as echarts from '../../components/ec-canvas/echarts';

Page({
  data: {
    ec: {
      // 将 lazyLoad 设为 true 后，需要手动初始化图表
      lazyLoad: true
    },
  },
  onLoad(e) {
    e.id = 235853
    this.data.goodsId = e.id
    this.mychartInit()
  },
  onReady: function () {
    // 获取组件
    this.ecComponent = this.selectComponent('#mychart-dom-line');
  },
  onUnload() {
    if (this.chart) {
      this.chart.dispose();
    }
  },
  async mychartInit() {
    const res = await WXAPI.goodsStatistics({
      pageSize: 7,
      goodsId: this.data.goodsId
    })
    if (res.code != 0) {
      this.setData({
        show_goods_echarts: false
      })
      return;
    }
    const list = res.data.result.reverse()
    const x = []
    const v1= []
    const v2= []
    console.log(list);
    list.forEach(ele => {
      x.push(ele.day)
      v1.push(ele.number)
      v2.push(ele.saleroom)
    })
    const mychartOption = {
      title: {
        text: '成交金额',
        left: 'center',
        top: 16
      },
      legend: {
        data: ['销售数量', '销售金额'],
        top: 50,
        left: 'center',
        z: 100
      },
      tooltip: {
        show: true,
        trigger: 'axis'
      },
      xAxis: {
          type: 'category',
          axisTick: {
            interval: 0
          },
          axisLabel: {
            interval: 0,
            rotate: 40 // 标签倾斜的角度
          },
          data: x
      },
      yAxis: {
        name: '成交额',
        nameLocation: 'center',
        nameTextStyle: {
            padding: 32,
            fontSize : 20
        },
        x: 'center',
        type: 'value',
        splitLine: {
          lineStyle: {
            type: 'dashed'
          }
        }
      },
      series: [
        {
          name: '销售数量',
          data: v1,
          type: 'line'
        },
        {
          name: '销售金额',
          data: v2,
          type: 'line'
        }
      ]
    }
    if (!this.ecComponent) {
      this.ecComponent = this.selectComponent('#mychart-dom-line');
    }
    if (!this.ecComponent) {
      return
    }
    this.ecComponent.init((canvas, width, height, dpr) => {
      // 获取组件的 canvas、width、height 后的回调函数
      // 在这里初始化图表
      const chart = echarts.init(canvas, null, {
        width: width,
        height: height,
        devicePixelRatio: dpr // new
      });
      chart.setOption(mychartOption);

      // 将图表实例绑定到 this 上，可以在其他成员函数（如 dispose）中访问
      this.chart = chart;

      // 注意这里一定要返回 chart 实例，否则会影响事件处理等
      return chart;
    })
  },
})

