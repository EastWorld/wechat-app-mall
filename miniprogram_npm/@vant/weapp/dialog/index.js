'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
var component_1 = require('../common/component');
var button_1 = require('../mixins/button');
var open_type_1 = require('../mixins/open-type');
var color_1 = require('../common/color');
var utils_1 = require('../common/utils');
component_1.VantComponent({
  mixins: [button_1.button, open_type_1.openType],
  props: {
    show: {
      type: Boolean,
      observer: function (show) {
        !show && this.stopLoading();
      },
    },
    title: String,
    message: String,
    theme: {
      type: String,
      value: 'default',
    },
    useSlot: Boolean,
    className: String,
    customStyle: String,
    asyncClose: Boolean,
    messageAlign: String,
    beforeClose: null,
    overlayStyle: String,
    useTitleSlot: Boolean,
    showCancelButton: Boolean,
    closeOnClickOverlay: Boolean,
    confirmButtonOpenType: String,
    width: null,
    zIndex: {
      type: Number,
      value: 2000,
    },
    confirmButtonText: {
      type: String,
      value: '确认',
    },
    cancelButtonText: {
      type: String,
      value: '取消',
    },
    confirmButtonColor: {
      type: String,
      value: color_1.RED,
    },
    cancelButtonColor: {
      type: String,
      value: color_1.GRAY,
    },
    showConfirmButton: {
      type: Boolean,
      value: true,
    },
    overlay: {
      type: Boolean,
      value: true,
    },
    transition: {
      type: String,
      value: 'scale',
    },
  },
  data: {
    loading: {
      confirm: false,
      cancel: false,
    },
  },
  methods: {
    onConfirm: function () {
      this.handleAction('confirm');
    },
    onCancel: function () {
      this.handleAction('cancel');
    },
    onClickOverlay: function () {
      this.onClose('overlay');
    },
    close: function (action) {
      var _this = this;
      this.setData({ show: false });
      wx.nextTick(function () {
        _this.$emit('close', action);
        var callback = _this.data.callback;
        if (callback) {
          callback(action, _this);
        }
      });
    },
    stopLoading: function () {
      this.setData({
        loading: {
          confirm: false,
          cancel: false,
        },
      });
    },
    handleAction: function (action) {
      var _a;
      var _this = this;
      this.$emit(action, { dialog: this });
      var _b = this.data,
        asyncClose = _b.asyncClose,
        beforeClose = _b.beforeClose;
      if (!asyncClose && !beforeClose) {
        this.close(action);
        return;
      }
      this.setData(((_a = {}), (_a['loading.' + action] = true), _a));
      if (beforeClose) {
        utils_1.toPromise(beforeClose(action)).then(function (value) {
          if (value) {
            _this.close(action);
          } else {
            _this.stopLoading();
          }
        });
      }
    },
  },
});
