let queue = {};
let timer = 0;
let ctx = null;

const badges = {};

Component({
  properties: {
    count: {
      type: Number,
      observer: "likeChange",
      value: 0,
    },
    height: {
      type: Number,
      value: 300
    },
    width: {
      type: Number,
      value: 90
    }
  },
  methods: {
    /**点赞个数变化 */
    likeChange(newVal, oldVal) {
      if (newVal - oldVal > 0) {
        this.likeClick();
      }
    },
    /**点赞 */
    likeClick() {
      const image = "./images-v2/" + this.getRandomInt(1, 13) + ".png";
      const anmationData = {
        id: new Date().getTime(),
        timer: 0,
        opacity: 0.5,
        pathData: this.generatePathData(),
        image: image,
        factor: {
          speed: 0.4, // 运动速度，值越小越慢
          t: 0 //  贝塞尔函数系数
        }
      };
      if (Object.keys(queue).length > 0) {
        queue[anmationData.id] = anmationData;
      } else {
        queue[anmationData.id] = anmationData;
        this.bubbleAnimate();
      }
    },
    /**获取最大最小随机值 */
    getRandom(min, max) {
      return Math.random() * (max - min) + min;
    },
    /**获取最大最小之前随机值的整数 */
    getRandomInt(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    },
    /**获取图片路径 */
    generatePathData() {
      let width = this.data.width,
        height = this.data.height;
      const p0 = {
        x: 0.65 * width,
        y: height
      };
      const p1 = {
        x: this.getRandom(0.22 * width, 0.33 * width),
        y: this.getRandom(0.5 * height, 0.75 * height)
      };
      const p2 = {
        x: this.getRandom(0, 0.88 * width),
        y: this.getRandom(0.25 * height, 0.5 * height)
      };
      const p3 = {
        x: this.getRandom(0, 0.88 * width),
        y: this.getRandom(0, 0.125 * height)
      };
      return [p0, p1, p2, p3];
    },
    /**更新图片的最新运动路径 */
    updatePath(data, factor) {
      const p0 = data[0];
      const p1 = data[1];
      const p2 = data[2];
      const p3 = data[3];

      const t = factor.t;

      /*计算多项式系数 （下同）*/
      const cx1 = 3 * (p1.x - p0.x);
      const bx1 = 3 * (p2.x - p1.x) - cx1;
      const ax1 = p3.x - p0.x - cx1 - bx1;

      const cy1 = 3 * (p1.y - p0.y);
      const by1 = 3 * (p2.y - p1.y) - cy1;
      const ay1 = p3.y - p0.y - cy1 - by1;

      const x = ax1 * (t * t * t) + bx1 * (t * t) + cx1 * t + p0.x;
      const y = ay1 * (t * t * t) + by1 * (t * t) + cy1 * t + p0.y;
      return {
        x,
        y
      };
    },
    /**点赞动画 */
    bubbleAnimate() {
      let width = this.data.width,
        height = this.data.height;
      Object.keys(queue).forEach(key => {
        const anmationData = queue[+key];
        const {
          x,
          y
        } = this.updatePath(
          anmationData.pathData,
          anmationData.factor
        );
        const speed = anmationData.factor.speed;
        anmationData.factor.t += speed;

        var curWidth = 30;
        curWidth = (height - y) / 1.5;
        curWidth = Math.min(30, curWidth);

        var curAlpha = anmationData.opacity;
        curAlpha = y / height;
        curAlpha = Math.min(1, curAlpha);
        ctx.globalAlpha = curAlpha;
        ctx.drawImage(anmationData.image, x - curWidth / 2, y, curWidth, curWidth);
        if (anmationData.factor.t > 1) {
          delete queue[anmationData.id];
        }
        if (y > height) {
          delete queue[anmationData.id];
        }
      });
      ctx.draw();
      if (Object.keys(queue).length > 0) {
        timer = setTimeout(() => {
          this.bubbleAnimate();
        }, 5);
      } else {
        clearTimeout(timer);
        ctx.draw(); // 清空画面
      }
    }
  },

  ready() {
    ctx = wx.createCanvasContext("bubble", this);
    queue = {};
  },

  detached() {
    if (timer) {
      clearTimeout(timer);
    }
  }
});