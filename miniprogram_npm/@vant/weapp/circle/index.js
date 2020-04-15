"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var component_1 = require("../common/component");
var utils_1 = require("../common/utils");
var color_1 = require("../common/color");
function format(rate) {
    return Math.min(Math.max(rate, 0), 100);
}
var PERIMETER = 2 * Math.PI;
var BEGIN_ANGLE = -Math.PI / 2;
var STEP = 1;
component_1.VantComponent({
    props: {
        text: String,
        lineCap: {
            type: String,
            value: 'round'
        },
        value: {
            type: Number,
            value: 0,
            observer: 'reRender'
        },
        speed: {
            type: Number,
            value: 50
        },
        size: {
            type: Number,
            value: 100,
        },
        fill: String,
        layerColor: {
            type: String,
            value: color_1.WHITE
        },
        color: {
            type: [String, Object],
            value: color_1.BLUE,
            observer: 'setHoverColor'
        },
        type: {
            type: String,
            value: ''
        },
        strokeWidth: {
            type: Number,
            value: 4
        },
        clockwise: {
            type: Boolean,
            value: true
        }
    },
    data: {
        hoverColor: color_1.BLUE
    },
    methods: {
        getContext: function () {
            if (!this.ctx) {
                this.ctx = wx.createCanvasContext('van-circle', this);
            }
            return this.ctx;
        },
        setHoverColor: function () {
            var _a = this.data, color = _a.color, size = _a.size, type = _a.type;
            var context = type ? this.getContext(type) : this.getContext();
            var hoverColor = color;
            if (utils_1.isObj(color)) {
                var LinearColor_1 = context.createLinearGradient(size, 0, 0, 0);
                Object.keys(color)
                    .sort(function (a, b) { return parseFloat(a) - parseFloat(b); })
                    .map(function (key) { return LinearColor_1.addColorStop(parseFloat(key) / 100, color[key]); });
                hoverColor = LinearColor_1;
            }
            this.setData({ hoverColor: hoverColor });
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
            var _a = this.data, clockwise = _a.clockwise, hoverColor = _a.hoverColor;
            // 结束角度
            var progress = PERIMETER * (formatValue / 100);
            var endAngle = clockwise
                ? BEGIN_ANGLE + progress
                : 3 * Math.PI - (BEGIN_ANGLE + progress);
            this.presetCanvas(context, hoverColor, BEGIN_ANGLE, endAngle);
        },
        drawCircle: function (currentValue) {
            var _a = this.data, size = _a.size, type = _a.type;
            var context = type ? this.getContext(type) : this.getContext();
            context.clearRect(0, 0, size, size);
            this.renderLayerCircle(context);
            var formatValue = format(currentValue);
            if (formatValue !== 0) {
                this.renderHoverCircle(context, formatValue);
            }
            context.draw();
        },
        reRender: function () {
            var _this = this;
            // tofector 动画暂时没有想到好的解决方案
            var _a = this.data, value = _a.value, speed = _a.speed;
            if (speed <= 0 || speed > 1000) {
                this.drawCircle(value);
                return;
            }
            this.clearInterval();
            this.currentValue = this.currentValue || 0;
            this.interval = setInterval(function () {
                if (_this.currentValue !== value) {
                    if (_this.currentValue < value) {
                        _this.currentValue += STEP;
                    }
                    else {
                        _this.currentValue -= STEP;
                    }
                    _this.drawCircle(_this.currentValue);
                }
                else {
                    _this.clearInterval();
                }
            }, 1000 / speed);
        },
        clearInterval: function () {
            if (this.interval) {
                clearInterval(this.interval);
                this.interval = null;
            }
        }
    },
    created: function () {
        var value = this.data.value;
        this.currentValue = value;
        this.drawCircle(value);
    },
    destroyed: function () {
        this.ctx = null;
        this.clearInterval();
    }
});
