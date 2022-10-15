"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var color_1 = require("../common/color");
var component_1 = require("../common/component");
var utils_1 = require("../common/utils");
var validator_1 = require("../common/validator");
var version_1 = require("../common/version");
var canvas_1 = require("./canvas");
function format(rate) {
    return Math.min(Math.max(rate, 0), 100);
}
var PERIMETER = 2 * Math.PI;
var BEGIN_ANGLE = -Math.PI / 2;
var STEP = 1;
(0, component_1.VantComponent)({
    props: {
        text: String,
        lineCap: {
            type: String,
            value: 'round',
        },
        value: {
            type: Number,
            value: 0,
            observer: 'reRender',
        },
        speed: {
            type: Number,
            value: 50,
        },
        size: {
            type: Number,
            value: 100,
            observer: function () {
                this.drawCircle(this.currentValue);
            },
        },
        fill: String,
        layerColor: {
            type: String,
            value: color_1.WHITE,
        },
        color: {
            type: null,
            value: color_1.BLUE,
            observer: function () {
                var _this = this;
                this.setHoverColor().then(function () {
                    _this.drawCircle(_this.currentValue);
                });
            },
        },
        type: {
            type: String,
            value: '',
        },
        strokeWidth: {
            type: Number,
            value: 4,
        },
        clockwise: {
            type: Boolean,
            value: true,
        },
    },
    data: {
        hoverColor: color_1.BLUE,
    },
    methods: {
        getContext: function () {
            var _this = this;
            var _a = this.data, type = _a.type, size = _a.size;
            if (type === '' || !(0, version_1.canIUseCanvas2d)()) {
                var ctx = wx.createCanvasContext('van-circle', this);
                return Promise.resolve(ctx);
            }
            var dpr = (0, utils_1.getSystemInfoSync)().pixelRatio;
            return new Promise(function (resolve) {
                wx.createSelectorQuery()
                    .in(_this)
                    .select('#van-circle')
                    .node()
                    .exec(function (res) {
                    var canvas = res[0].node;
                    var ctx = canvas.getContext(type);
                    if (!_this.inited) {
                        _this.inited = true;
                        canvas.width = size * dpr;
                        canvas.height = size * dpr;
                        ctx.scale(dpr, dpr);
                    }
                    resolve((0, canvas_1.adaptor)(ctx));
                });
            });
        },
        setHoverColor: function () {
            var _this = this;
            var _a = this.data, color = _a.color, size = _a.size;
            if ((0, validator_1.isObj)(color)) {
                return this.getContext().then(function (context) {
                    var LinearColor = context.createLinearGradient(size, 0, 0, 0);
                    Object.keys(color)
                        .sort(function (a, b) { return parseFloat(a) - parseFloat(b); })
                        .map(function (key) {
                        return LinearColor.addColorStop(parseFloat(key) / 100, color[key]);
                    });
                    _this.hoverColor = LinearColor;
                });
            }
            this.hoverColor = color;
            return Promise.resolve();
        },
        presetCanvas: function (context, strokeStyle, beginAngle, endAngle, fill) {
            var _a = this.data, strokeWidth = _a.strokeWidth, lineCap = _a.lineCap, clockwise = _a.clockwise, size = _a.size;
            var position = size / 2;
            var radius = position - strokeWidth / 2;
            context.setStrokeStyle(strokeStyle);
            context.setLineWidth(strokeWidth);
            context.setLineCap(lineCap);
            context.beginPath();
            context.arc(position, position, radius, beginAngle, endAngle, !clockwise);
            context.stroke();
            if (fill) {
                context.setFillStyle(fill);
                context.fill();
            }
        },
        renderLayerCircle: function (context) {
            var _a = this.data, layerColor = _a.layerColor, fill = _a.fill;
            this.presetCanvas(context, layerColor, 0, PERIMETER, fill);
        },
        renderHoverCircle: function (context, formatValue) {
            var clockwise = this.data.clockwise;
            // 结束角度
            var progress = PERIMETER * (formatValue / 100);
            var endAngle = clockwise
                ? BEGIN_ANGLE + progress
                : 3 * Math.PI - (BEGIN_ANGLE + progress);
            this.presetCanvas(context, this.hoverColor, BEGIN_ANGLE, endAngle);
        },
        drawCircle: function (currentValue) {
            var _this = this;
            var size = this.data.size;
            this.getContext().then(function (context) {
                context.clearRect(0, 0, size, size);
                _this.renderLayerCircle(context);
                var formatValue = format(currentValue);
                if (formatValue !== 0) {
                    _this.renderHoverCircle(context, formatValue);
                }
                context.draw();
            });
        },
        reRender: function () {
            var _this = this;
            // tofector 动画暂时没有想到好的解决方案
            var _a = this.data, value = _a.value, speed = _a.speed;
            if (speed <= 0 || speed > 1000) {
                this.drawCircle(value);
                return;
            }
            this.clearMockInterval();
            this.currentValue = this.currentValue || 0;
            var run = function () {
                _this.interval = setTimeout(function () {
                    if (_this.currentValue !== value) {
                        if (Math.abs(_this.currentValue - value) < STEP) {
                            _this.currentValue = value;
                        }
                        else if (_this.currentValue < value) {
                            _this.currentValue += STEP;
                        }
                        else {
                            _this.currentValue -= STEP;
                        }
                        _this.drawCircle(_this.currentValue);
                        run();
                    }
                    else {
                        _this.clearMockInterval();
                    }
                }, 1000 / speed);
            };
            run();
        },
        clearMockInterval: function () {
            if (this.interval) {
                clearTimeout(this.interval);
                this.interval = null;
            }
        },
    },
    mounted: function () {
        var _this = this;
        this.currentValue = this.data.value;
        this.setHoverColor().then(function () {
            _this.drawCircle(_this.currentValue);
        });
    },
    destroyed: function () {
        this.clearMockInterval();
    },
});
