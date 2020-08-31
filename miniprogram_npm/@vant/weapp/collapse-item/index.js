'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
var component_1 = require('../common/component');
component_1.VantComponent({
  classes: ['title-class', 'content-class'],
  relation: {
    name: 'collapse',
    type: 'ancestor',
    current: 'collapse-item',
  },
  props: {
    name: null,
    title: null,
    value: null,
    icon: String,
    label: String,
    disabled: Boolean,
    clickable: Boolean,
    border: {
      type: Boolean,
      value: true,
    },
    isLink: {
      type: Boolean,
      value: true,
    },
  },
  data: {
    expanded: false,
  },
  created: function () {
    this.animation = wx.createAnimation({
      duration: 0,
      timingFunction: 'ease-in-out',
    });
  },
  mounted: function () {
    this.updateExpanded();
    this.inited = true;
  },
  methods: {
    updateExpanded: function () {
      if (!this.parent) {
        return Promise.resolve();
      }
      var _a = this.parent.data,
        value = _a.value,
        accordion = _a.accordion;
      var _b = this.parent.children,
        children = _b === void 0 ? [] : _b;
      var name = this.data.name;
      var index = children.indexOf(this);
      var currentName = name == null ? index : name;
      var expanded = accordion
        ? value === currentName
        : (value || []).some(function (name) {
            return name === currentName;
          });
      if (expanded !== this.data.expanded) {
        this.updateStyle(expanded);
      }
      this.setData({ index: index, expanded: expanded });
    },
    updateStyle: function (expanded) {
      var _this = this;
      var inited = this.inited;
      this.getRect('.van-collapse-item__content')
        .then(function (rect) {
          return rect.height;
        })
        .then(function (height) {
          var animation = _this.animation;
          if (expanded) {
            if (height === 0) {
              animation.height('auto').top(1).step();
            } else {
              animation
                .height(height)
                .top(1)
                .step({
                  duration: inited ? 300 : 1,
                })
                .height('auto')
                .step();
            }
            _this.setData({
              animation: animation.export(),
            });
            return;
          }
          animation.height(height).top(0).step({ duration: 1 }).height(0).step({
            duration: 300,
          });
          _this.setData({
            animation: animation.export(),
          });
        });
    },
    onClick: function () {
      if (this.data.disabled) {
        return;
      }
      var _a = this.data,
        name = _a.name,
        expanded = _a.expanded;
      var index = this.parent.children.indexOf(this);
      var currentName = name == null ? index : name;
      this.parent.switch(currentName, !expanded);
    },
  },
});
