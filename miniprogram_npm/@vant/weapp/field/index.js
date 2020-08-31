'use strict';
var __assign =
  (this && this.__assign) ||
  function () {
    __assign =
      Object.assign ||
      function (t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
          s = arguments[i];
          for (var p in s)
            if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
      };
    return __assign.apply(this, arguments);
  };
Object.defineProperty(exports, '__esModule', { value: true });
var component_1 = require('../common/component');
var props_1 = require('./props');
component_1.VantComponent({
  field: true,
  classes: ['input-class', 'right-icon-class', 'label-class'],
  props: __assign(
    __assign(
      __assign(__assign({}, props_1.commonProps), props_1.inputProps),
      props_1.textareaProps
    ),
    {
      size: String,
      icon: String,
      label: String,
      error: Boolean,
      center: Boolean,
      isLink: Boolean,
      leftIcon: String,
      rightIcon: String,
      autosize: [Boolean, Object],
      required: Boolean,
      iconClass: String,
      clickable: Boolean,
      inputAlign: String,
      customStyle: String,
      errorMessage: String,
      arrowDirection: String,
      showWordLimit: Boolean,
      errorMessageAlign: String,
      readonly: {
        type: Boolean,
        observer: 'setShowClear',
      },
      clearable: {
        type: Boolean,
        observer: 'setShowClear',
      },
      border: {
        type: Boolean,
        value: true,
      },
      titleWidth: {
        type: String,
        value: '6.2em',
      },
    }
  ),
  data: {
    focused: false,
    innerValue: '',
    showClear: false,
  },
  created: function () {
    this.value = this.data.value;
    this.setData({ innerValue: this.value });
  },
  methods: {
    onInput: function (event) {
      var _a = (event.detail || {}).value,
        value = _a === void 0 ? '' : _a;
      this.value = value;
      this.setShowClear();
      this.emitChange();
    },
    onFocus: function (event) {
      this.focused = true;
      this.setShowClear();
      this.$emit('focus', event.detail);
    },
    onBlur: function (event) {
      this.focused = false;
      this.setShowClear();
      this.$emit('blur', event.detail);
    },
    onClickIcon: function () {
      this.$emit('click-icon');
    },
    onClear: function () {
      var _this = this;
      this.setData({ innerValue: '' });
      this.value = '';
      this.setShowClear();
      wx.nextTick(function () {
        _this.emitChange();
        _this.$emit('clear', '');
      });
    },
    onConfirm: function (event) {
      var _a = (event.detail || {}).value,
        value = _a === void 0 ? '' : _a;
      this.value = value;
      this.setShowClear();
      this.$emit('confirm', value);
    },
    setValue: function (value) {
      this.value = value;
      this.setShowClear();
      if (value === '') {
        this.setData({ innerValue: '' });
      }
      this.emitChange();
    },
    onLineChange: function (event) {
      this.$emit('linechange', event.detail);
    },
    onKeyboardHeightChange: function (event) {
      this.$emit('keyboardheightchange', event.detail);
    },
    emitChange: function () {
      var _this = this;
      this.setData({ value: this.value });
      wx.nextTick(function () {
        _this.$emit('input', _this.value);
        _this.$emit('change', _this.value);
      });
    },
    setShowClear: function () {
      var _a = this.data,
        clearable = _a.clearable,
        readonly = _a.readonly;
      var _b = this,
        focused = _b.focused,
        value = _b.value;
      this.setData({
        showClear: !!clearable && !!focused && !!value && !readonly,
      });
    },
    noop: function () {},
  },
});
