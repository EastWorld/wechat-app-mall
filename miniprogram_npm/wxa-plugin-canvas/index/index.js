const main = {
    /**
     * 渲染块
     * @param {Object} params
     */
    drawBlock({ text, width = 0, height, x, y, paddingLeft = 0, paddingRight = 0, borderWidth, backgroundColor, borderColor, borderRadius = 0, opacity = 1 }) {
        // 判断是否块内有文字
        let blockWidth = 0; // 块的宽度
        let textX = 0;
        let textY = 0;
        if (typeof text !== 'undefined') {
            // 如果有文字并且块的宽度小于文字宽度，块的宽度为 文字的宽度 + 内边距
            const textWidth = this._getTextWidth(typeof text.text === 'string' ? text : text.text);
            blockWidth = textWidth > width ? textWidth : width;
            blockWidth += paddingLeft + paddingLeft;

            const { textAlign = 'left', text: textCon } = text;
            textY = height / 2 + y; // 文字的y轴坐标在块中线
            if (textAlign === 'left') {
                // 如果是右对齐，那x轴在块的最左边
                textX = x + paddingLeft;
            } else if (textAlign === 'center') {
                textX = blockWidth / 2 + x;
            } else {
                textX = x + blockWidth - paddingRight;
            }
        } else {
            blockWidth = width;
        }

        if (backgroundColor) {
            // 画面
            this.ctx.save();
            this.ctx.setGlobalAlpha(opacity);
            this.ctx.setFillStyle(backgroundColor);
            if (borderRadius > 0) {
                // 画圆角矩形
                this._drawRadiusRect(x, y, blockWidth, height, borderRadius);
                this.ctx.fill();
            } else {
                this.ctx.fillRect(this.toPx(x), this.toPx(y), this.toPx(blockWidth), this.toPx(height));
            }
            this.ctx.restore();
        }
        if (borderWidth) {
            // 画线
            this.ctx.save();
            this.ctx.setGlobalAlpha(opacity);
            this.ctx.setStrokeStyle(borderColor);
            this.ctx.setLineWidth(this.toPx(borderWidth));
            if (borderRadius > 0) {
                // 画圆角矩形边框
                this._drawRadiusRect(x, y, blockWidth, height, borderRadius);
                this.ctx.stroke();
            } else {
                this.ctx.strokeRect(this.toPx(x), this.toPx(y), this.toPx(blockWidth), this.toPx(height));
            }
            this.ctx.restore();
        }

        if (text) {
            this.drawText(Object.assign(text, { x: textX, y: textY }))
        }
    },

    /**
     * 渲染文字
     * @param {Object} params
     */
    drawText(params) {
        const { x, y, fontSize, color, baseLine, textAlign, text, opacity = 1, width, lineNum, lineHeight } = params;
        if (Object.prototype.toString.call(text) === '[object Array]') {
            let preText = { x, y, baseLine };
            text.forEach(item => {
                preText.x += item.marginLeft || 0;
                const textWidth = this._drawSingleText(Object.assign(item, {
                    ...preText,
                }));
                preText.x += textWidth + (item.marginRight || 0); // 下一段字的x轴为上一段字x + 上一段字宽度
            })
        } else {
            this._drawSingleText(params);
        }
    },

    /**
     * 渲染图片
     */
    drawImage(data) {
        const { imgPath, x, y, w, h, sx, sy, sw, sh, borderRadius = 0, borderWidth = 0, borderColor } = data;
        this.ctx.save();
        if (borderRadius > 0) {
            this._drawRadiusRect(x, y, w, h, borderRadius);
            this.ctx.strokeStyle = 'rgba(255,255,255,0)';
            this.ctx.stroke();
            this.ctx.clip();
            this.ctx.drawImage(imgPath, this.toPx(sx), this.toPx(sy), this.toPx(sw), this.toPx(sh), this.toPx(x), this.toPx(y), this.toPx(w), this.toPx(h));
            if (borderWidth > 0) {
                this.ctx.setStrokeStyle(borderColor);
                this.ctx.setLineWidth(this.toPx(borderWidth));
                this.ctx.stroke();
            }
        } else {
            this.ctx.drawImage(imgPath, this.toPx(sx), this.toPx(sy), this.toPx(sw), this.toPx(sh), this.toPx(x), this.toPx(y), this.toPx(w), this.toPx(h));
        }
        this.ctx.restore();
    },
    /**
     * 渲染线
     * @param {*} param0
     */
    drawLine({ startX, startY, endX, endY, color, width }) {
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.setStrokeStyle(color);
        this.ctx.setLineWidth(this.toPx(width));
        this.ctx.moveTo(this.toPx(startX), this.toPx(startY));
        this.ctx.lineTo(this.toPx(endX), this.toPx(endY));
        this.ctx.stroke();
        this.ctx.closePath();
        this.ctx.restore();
    },
    downloadResource({ images = [], pixelRatio = 1 }) {
        const drawList = [];
        this.drawArr = [];
        images.forEach((image, index) => drawList.push(this._downloadImageAndInfo(image, index, pixelRatio)));
        return Promise.all(drawList);
    },
    initCanvas(w, h, debug) {
        return new Promise((resolve) => {
            this.setData({
                pxWidth: this.toPx(w),
                pxHeight: this.toPx(h),
                debug,
            }, resolve);
        });
    }
}
const handle = {
    /**
     * 画圆角矩形
     */
    _drawRadiusRect(x, y, w, h, r) {
        const br = r / 2;
        this.ctx.beginPath();
        this.ctx.moveTo(this.toPx(x + br), this.toPx(y));    // 移动到左上角的点
        this.ctx.lineTo(this.toPx(x + w - br), this.toPx(y));
        this.ctx.arc(this.toPx(x + w - br), this.toPx(y + br), this.toPx(br), 2 * Math.PI * (3 / 4), 2 * Math.PI * (4 / 4))
        this.ctx.lineTo(this.toPx(x + w), this.toPx(y + h - br));
        this.ctx.arc(this.toPx(x + w - br), this.toPx(y + h - br), this.toPx(br), 0, 2 * Math.PI * (1 / 4))
        this.ctx.lineTo(this.toPx(x + br), this.toPx(y + h));
        this.ctx.arc(this.toPx(x + br), this.toPx(y + h - br), this.toPx(br), 2 * Math.PI * (1 / 4), 2 * Math.PI * (2 / 4))
        this.ctx.lineTo(this.toPx(x), this.toPx(y + br));
        this.ctx.arc(this.toPx(x + br), this.toPx(y + br), this.toPx(br), 2 * Math.PI * (2 / 4), 2 * Math.PI * (3 / 4))
    },
    /**
     * 计算文本长度
     * @param {Array|Object}} text 数组 或者 对象
     */
    _getTextWidth(text) {
        let texts = [];
        if (Object.prototype.toString.call(text) === '[object Object]') {
            texts.push(text);
        } else {
            texts = text;
        }
        let width = 0;
        texts.forEach(({ fontSize, text, marginLeft = 0, marginRight = 0 }) => {
            this.ctx.setFontSize(this.toPx(fontSize));
            width += this.ctx.measureText(text).width + marginLeft + marginRight;
        })

        return this.toRpx(width);
    },
    /**
     * 渲染一段文字
     */
    _drawSingleText({ x, y, fontSize, color, baseLine, textAlign = 'left', text, opacity = 1, textDecoration = 'none',
      width, lineNum = 1, lineHeight = 0, fontWeight = 'normal', fontStyle = 'normal', fontFamily = "sans-serif"}) {
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.font = fontStyle + " " + fontWeight + " " + this.toPx(fontSize, true) + "px " + fontFamily
        this.ctx.setGlobalAlpha(opacity);
        // this.ctx.setFontSize(this.toPx(fontSize));
        this.ctx.setFillStyle(color);
        this.ctx.setTextBaseline(baseLine);
        this.ctx.setTextAlign(textAlign);
        let textWidth = this.toRpx(this.ctx.measureText(text).width);
        const textArr = [];
         if (textWidth > width) {
          // 文本宽度 大于 渲染宽度
          let fillText = '';
          let line = 1;
          for (let i = 0; i <= text.length - 1 ; i++) {  // 将文字转为数组，一行文字一个元素
            fillText = fillText + text[i];
            if (this.toRpx(this.ctx.measureText(fillText).width) >= width) {
              if (line === lineNum) {
                if (i !== text.length - 1) {
                  fillText = fillText.substring(0, fillText.length - 1) + '...';
                }
              }
              if(line <= lineNum) {
                textArr.push(fillText);
              }
              fillText = '';
              line++;
            } else {
              if(line <= lineNum) {
                if(i === text.length -1){
                   textArr.push(fillText);
                }
              }
            }
          }
          textWidth = width;
        } else {
          textArr.push(text);
        }

        textArr.forEach((item, index) => {
            this.ctx.fillText(item, this.toPx(x), this.toPx(y + (lineHeight || fontSize) * index));
        })

        this.ctx.restore();

        // textDecoration
        if (textDecoration !== 'none') {
            let lineY = y;
            if (textDecoration === 'line-through') {
                // 目前只支持贯穿线
                lineY = y;

                // 小程序画布baseLine偏移阈值
                let threshold = 5;

                // 根据baseLine的不同对贯穿线的Y坐标做相应调整
                switch (baseLine) {
                  case 'top':
                    lineY += fontSize / 2 + threshold;
                    break;
                  case 'middle':
                    break;
                  case 'bottom':
                    lineY -= fontSize / 2 + threshold;
                    break;
                  default:
                    lineY -= fontSize / 2 - threshold;
                    break;
                }
            }
            this.ctx.save();
            this.ctx.moveTo(this.toPx(x), this.toPx(lineY));
            this.ctx.lineTo(this.toPx(x) + this.toPx(textWidth), this.toPx(lineY));
            this.ctx.setStrokeStyle(color);
            this.ctx.stroke();
            this.ctx.restore();
        }

        return textWidth;
    },
}
const helper = {
    /**
      * 下载图片并获取图片信息
      */
    _downloadImageAndInfo(image, index, pixelRatio) {
        return new Promise((resolve, reject) => {
            const { x, y, url, zIndex } = image;
            const imageUrl = url;
            // 下载图片
            this._downImage(imageUrl, index)
                // 获取图片信息
                .then(imgPath => this._getImageInfo(imgPath, index))
                .then(({ imgPath, imgInfo }) => {
                    // 根据画布的宽高计算出图片绘制的大小，这里会保证图片绘制不变形
                    let sx;
                    let sy;
                    const borderRadius = image.borderRadius || 0;
                    const setWidth = image.width;
                    const setHeight = image.height;
                    const width = this.toRpx(imgInfo.width / pixelRatio);
                    const height = this.toRpx(imgInfo.height / pixelRatio);

                    if (width / height <= setWidth / setHeight) {
                        sx = 0;
                        sy = (height - ((width / setWidth) * setHeight)) / 2;
                    } else {
                        sy = 0;
                        sx = (width - ((height / setHeight) * setWidth)) / 2;
                    }
                    this.drawArr.push({
                        type: 'image',
                        borderRadius,
                        borderWidth: image.borderWidth,
                        borderColor: image.borderColor,
                        zIndex: typeof zIndex !== 'undefined' ? zIndex : index,
                        imgPath,
                        sx,
                        sy,
                        sw: (width - (sx * 2)),
                        sh: (height - (sy * 2)),
                        x,
                        y,
                        w: setWidth,
                        h: setHeight,
                    });
                    resolve();
                })
                .catch(err => reject(err));
        });
    },
    /**
     * 下载图片资源
     * @param {*} imageUrl
     */
    _downImage(imageUrl) {
        return new Promise((resolve, reject) => {
            if (/^http/.test(imageUrl) && !new RegExp(wx.env.USER_DATA_PATH).test(imageUrl)) {
                wx.downloadFile({
                    url: this._mapHttpToHttps(imageUrl),
                    success: (res) => {
                        if (res.statusCode === 200) {
                            resolve(res.tempFilePath);
                        } else {
                            reject(res.errMsg);
                        }
                    },
                    fail(err) {
                        reject(err);
                    },
                });
            } else {
                // 支持本地地址
                resolve(imageUrl);
            }
        });
    },
    /**
     * 获取图片信息
     * @param {*} imgPath
     * @param {*} index
     */
    _getImageInfo(imgPath, index) {
        return new Promise((resolve, reject) => {
            wx.getImageInfo({
                src: imgPath,
                success(res) {
                    resolve({ imgPath, imgInfo: res, index });
                },
                fail(err) {
                    reject(err);
                },
            });
        });
    },
    toPx(rpx, int) {
      if (int) {
        return parseInt(rpx * this.factor * this.pixelRatio);
      }
      return rpx * this.factor * this.pixelRatio;

    },
    toRpx(px, int) {
      if (int) {
        return parseInt(px / this.factor);
      }
      return px / this.factor;
    },
    /**
     * 将http转为https
     * @param {String}} rawUrl 图片资源url
     */
    _mapHttpToHttps(rawUrl) {
        if (rawUrl.indexOf(':') < 0) {
            return rawUrl;
        }
        const urlComponent = rawUrl.split(':');
        if (urlComponent.length === 2) {
            if (urlComponent[0] === 'http') {
                urlComponent[0] = 'https';
                return `${urlComponent[0]}:${urlComponent[1]}`;
            }
        }
        return rawUrl;
    },
}
Component({
    properties: {
    },
    created() {
        const sysInfo = wx.getSystemInfoSync();
        const screenWidth = sysInfo.screenWidth;
        this.factor = screenWidth / 750;
    },
    methods: Object.assign({
        /**
         * 计算画布的高度
         * @param {*} config
         */
        getHeight(config) {
            const getTextHeight = (text) => {
                let fontHeight = text.lineHeight || text.fontSize;
                let height = 0;
                if (text.baseLine === 'top') {
                    height = fontHeight;
                } else if (text.baseLine === 'middle') {
                    height = fontHeight / 2;
                } else {
                    height = 0;
                }
                return height;
            }
            const heightArr = [];
            (config.blocks || []).forEach((item) => {
                heightArr.push(item.y + item.height);
            });
            (config.texts  || []).forEach((item) => {
                let height;
                if (Object.prototype.toString.call(item.text) === '[object Array]') {
                    item.text.forEach((i) => {
                        height = getTextHeight({...i, baseLine: item.baseLine});
                        heightArr.push(item.y + height);
                    });
                } else {
                    height = getTextHeight(item);
                    heightArr.push(item.y + height);
                }
            });
            (config.images || []).forEach((item) => {
                heightArr.push(item.y + item.height);
            });
            (config.lines || []).forEach((item) => {
                heightArr.push(item.startY);
                heightArr.push(item.endY);
            });
            const sortRes = heightArr.sort((a, b) => b - a);
            let canvasHeight = 0;
            if (sortRes.length > 0) {
                canvasHeight = sortRes[0];
            }
            if (config.height < canvasHeight || !config.height) {
                return canvasHeight;
            } else {
                return config.height;
            }
        },
        create(config) {
            this.ctx = wx.createCanvasContext('canvasid', this);

            this.pixelRatio = config.pixelRatio || 1;
            const height = this.getHeight(config);
            this.initCanvas(config.width, height, config.debug)
                .then(() => {
                    // 设置画布底色
                    if (config.backgroundColor) {
                        this.ctx.save();
                        this.ctx.setFillStyle(config.backgroundColor);
                        this.ctx.fillRect(0, 0, this.toPx(config.width), this.toPx(height));
                        this.ctx.restore();
                    }
                    const { texts = [], images = [], blocks = [], lines = [] } = config;
                    const queue = this.drawArr
                        .concat(texts.map((item) => {
                            item.type = 'text';
                            item.zIndex = item.zIndex || 0;
                            return item;
                        }))
                        .concat(blocks.map((item) => {
                            item.type = 'block';
                            item.zIndex = item.zIndex || 0;
                            return item;
                        }))
                        .concat(lines.map((item) => {
                            item.type = 'line';
                            item.zIndex = item.zIndex || 0;
                            return item;
                        }));
                    // 按照顺序排序
                    queue.sort((a, b) => a.zIndex - b.zIndex);

                    queue.forEach((item) => {
                        if (item.type === 'image') {
                            this.drawImage(item)
                        } else if (item.type === 'text') {
                            this.drawText(item)
                        } else if (item.type === 'block') {
                            this.drawBlock(item)
                        } else if (item.type === 'line') {
                            this.drawLine(item)
                        }
                    });

                    const res = wx.getSystemInfoSync();
                    const platform = res.platform;
                    let time = 0;
                    if (platform === 'android') {
                        // 在安卓平台，经测试发现如果海报过于复杂在转换时需要做延时，要不然样式会错乱
                        time = 300;
                    }
                    this.ctx.draw(false, () => {
                        setTimeout(() => {
                            wx.canvasToTempFilePath({
                                canvasId: 'canvasid',
                                success: (res) => {
                                    this.triggerEvent('success', res.tempFilePath);
                                },
                                fail: (err) => {
                                    this.triggerEvent('fail', err);
                                },
                            }, this);
                        }, time);
                    });
                })
                .catch((err) => {
                    wx.showToast({ icon: 'none', title: err.errMsg || '生成失败' });
                    console.error(err);
                });
        },
    }, main, handle, helper),
});

