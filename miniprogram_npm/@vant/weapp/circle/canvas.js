'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.adaptor = void 0;
function adaptor(ctx) {
  // @ts-ignore
  return Object.assign(ctx, {
    setStrokeStyle: function (val) {
      ctx.strokeStyle = val;
    },
    setLineWidth: function (val) {
      ctx.lineWidth = val;
    },
    setLineCap: function (val) {
      ctx.lineCap = val;
    },
    setFillStyle: function (val) {
      ctx.fillStyle = val;
    },
    setFontSize: function (val) {
      ctx.font = String(val);
    },
    setGlobalAlpha: function (val) {
      ctx.globalAlpha = val;
    },
    setLineJoin: function (val) {
      ctx.lineJoin = val;
    },
    setTextAlign: function (val) {
      ctx.textAlign = val;
    },
    setMiterLimit: function (val) {
      ctx.miterLimit = val;
    },
    setShadow: function (offsetX, offsetY, blur, color) {
      ctx.shadowOffsetX = offsetX;
      ctx.shadowOffsetY = offsetY;
      ctx.shadowBlur = blur;
      ctx.shadowColor = color;
    },
    setTextBaseline: function (val) {
      ctx.textBaseline = val;
    },
    createCircularGradient: function () {},
    draw: function () {},
  });
}
exports.adaptor = adaptor;
