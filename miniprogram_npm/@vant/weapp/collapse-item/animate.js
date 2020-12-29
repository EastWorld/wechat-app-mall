'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.setContentAnimate = void 0;
var version_1 = require('../common/version');
var utils_1 = require('../common/utils');
function useAnimate(context, expanded, mounted, height) {
  var selector = '.van-collapse-item__wrapper';
  if (expanded) {
    context.animate(
      selector,
      [
        { height: 0, ease: 'ease-in-out', offset: 0 },
        { height: height + 'px', ease: 'ease-in-out', offset: 1 },
        { height: 'auto', ease: 'ease-in-out', offset: 1 },
      ],
      mounted ? 300 : 0,
      function () {
        context.clearAnimation(selector);
      }
    );
    return;
  }
  context.animate(
    selector,
    [
      { height: height + 'px', ease: 'ease-in-out', offset: 0 },
      { height: 0, ease: 'ease-in-out', offset: 1 },
    ],
    300,
    function () {
      context.clearAnimation(selector);
    }
  );
}
function useAnimation(context, expanded, mounted, height) {
  var animation = wx.createAnimation({
    duration: 0,
    timingFunction: 'ease-in-out',
  });
  if (expanded) {
    if (height === 0) {
      animation.height('auto').top(1).step();
    } else {
      animation
        .height(height)
        .top(1)
        .step({
          duration: mounted ? 300 : 1,
        })
        .height('auto')
        .step();
    }
    context.setData({
      animation: animation.export(),
    });
    return;
  }
  animation.height(height).top(0).step({ duration: 1 }).height(0).step({
    duration: 300,
  });
  context.setData({
    animation: animation.export(),
  });
}
function setContentAnimate(context, expanded, mounted) {
  utils_1
    .getRect(context, '.van-collapse-item__content')
    .then(function (rect) {
      return rect.height;
    })
    .then(function (height) {
      version_1.canIUseAnimate()
        ? useAnimate(context, expanded, mounted, height)
        : useAnimation(context, expanded, mounted, height);
    });
}
exports.setContentAnimate = setContentAnimate;
