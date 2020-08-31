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
var utils_1 = require('./utils');
var shared_1 = require('./shared');
component_1.VantComponent({
  props: __assign(
    __assign(
      {
        disabled: Boolean,
        multiple: Boolean,
        uploadText: String,
        useBeforeRead: Boolean,
        afterRead: null,
        beforeRead: null,
        previewSize: {
          type: null,
          value: 80,
        },
        name: {
          type: [Number, String],
          value: '',
        },
        accept: {
          type: String,
          value: 'image',
        },
        fileList: {
          type: Array,
          value: [],
          observer: 'formatFileList',
        },
        maxSize: {
          type: Number,
          value: Number.MAX_VALUE,
        },
        maxCount: {
          type: Number,
          value: 100,
        },
        deletable: {
          type: Boolean,
          value: true,
        },
        showUpload: {
          type: Boolean,
          value: true,
        },
        previewImage: {
          type: Boolean,
          value: true,
        },
        previewFullImage: {
          type: Boolean,
          value: true,
        },
        imageFit: {
          type: String,
          value: 'scaleToFill',
        },
        uploadIcon: {
          type: String,
          value: 'photograph',
        },
      },
      shared_1.chooseImageProps
    ),
    shared_1.chooseVideoProps
  ),
  data: {
    lists: [],
    isInCount: true,
  },
  methods: {
    formatFileList: function () {
      var _a = this.data,
        _b = _a.fileList,
        fileList = _b === void 0 ? [] : _b,
        maxCount = _a.maxCount;
      var lists = fileList.map(function (item) {
        return __assign(__assign({}, item), {
          isImage:
            typeof item.isImage === 'undefined'
              ? utils_1.isImageFile(item)
              : item.isImage,
          deletable:
            typeof item.deletable === 'undefined' ? true : item.deletable,
        });
      });
      this.setData({ lists: lists, isInCount: lists.length < maxCount });
    },
    getDetail: function (index) {
      return {
        name: this.data.name,
        index: index == null ? this.data.fileList.length : index,
      };
    },
    startUpload: function () {
      var _this = this;
      var _a = this.data,
        maxCount = _a.maxCount,
        multiple = _a.multiple,
        accept = _a.accept,
        lists = _a.lists,
        disabled = _a.disabled;
      if (disabled) return;
      utils_1
        .chooseFile(
          __assign(__assign({}, this.data), {
            maxCount: maxCount - lists.length,
          })
        )
        .then(function (res) {
          var file = null;
          if (utils_1.isVideo(res, accept)) {
            file = __assign({ path: res.tempFilePath }, res);
          } else {
            file = multiple ? res.tempFiles : res.tempFiles[0];
          }
          _this.onBeforeRead(file);
        })
        .catch(function (error) {
          _this.$emit('error', error);
        });
    },
    onBeforeRead: function (file) {
      var _this = this;
      var _a = this.data,
        beforeRead = _a.beforeRead,
        useBeforeRead = _a.useBeforeRead;
      var res = true;
      if (typeof beforeRead === 'function') {
        res = beforeRead(file, this.getDetail());
      }
      if (useBeforeRead) {
        res = new Promise(function (resolve, reject) {
          _this.$emit(
            'before-read',
            __assign(__assign({ file: file }, _this.getDetail()), {
              callback: function (ok) {
                ok ? resolve() : reject();
              },
            })
          );
        });
      }
      if (!res) {
        return;
      }
      if (utils_1.isPromise(res)) {
        res.then(function (data) {
          return _this.onAfterRead(data || file);
        });
      } else {
        this.onAfterRead(file);
      }
    },
    onAfterRead: function (file) {
      var maxSize = this.data.maxSize;
      var oversize = Array.isArray(file)
        ? file.some(function (item) {
            return item.size > maxSize;
          })
        : file.size > maxSize;
      if (oversize) {
        this.$emit('oversize', __assign({ file: file }, this.getDetail()));
        return;
      }
      if (typeof this.data.afterRead === 'function') {
        this.data.afterRead(file, this.getDetail());
      }
      this.$emit('after-read', __assign({ file: file }, this.getDetail()));
    },
    deleteItem: function (event) {
      var index = event.currentTarget.dataset.index;
      this.$emit(
        'delete',
        __assign(__assign({}, this.getDetail(index)), {
          file: this.data.fileList[index],
        })
      );
    },
    onPreviewImage: function (event) {
      if (!this.data.previewFullImage) return;
      var index = event.currentTarget.dataset.index;
      var lists = this.data.lists;
      var item = lists[index];
      wx.previewImage({
        urls: lists
          .filter(function (item) {
            return item.isImage;
          })
          .map(function (item) {
            return item.url || item.path;
          }),
        current: item.url || item.path,
        fail: function () {
          wx.showToast({ title: '预览图片失败', icon: 'none' });
        },
      });
    },
    onClickPreview: function (event) {
      var index = event.currentTarget.dataset.index;
      var item = this.data.lists[index];
      this.$emit(
        'click-preview',
        __assign(__assign({}, item), this.getDetail(index))
      );
    },
  },
});
