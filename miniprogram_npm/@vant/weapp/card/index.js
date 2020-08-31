'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
var link_1 = require('../mixins/link');
var component_1 = require('../common/component');
component_1.VantComponent({
  classes: [
    'num-class',
    'desc-class',
    'thumb-class',
    'title-class',
    'price-class',
    'origin-price-class',
  ],
  mixins: [link_1.link],
  props: {
    tag: String,
    num: String,
    desc: String,
    thumb: String,
    title: String,
    price: {
      type: String,
      observer: 'updatePrice',
    },
    centered: Boolean,
    lazyLoad: Boolean,
    thumbLink: String,
    originPrice: String,
    thumbMode: {
      type: String,
      value: 'aspectFit',
    },
    currency: {
      type: String,
      value: '¥',
    },
  },
  methods: {
    updatePrice: function () {
      var price = this.data.price;
      var priceArr = price.toString().split('.');
      this.setData({
        integerStr: priceArr[0],
        decimalStr: priceArr[1] ? '.' + priceArr[1] : '',
      });
    },
    onClickThumb: function () {
      this.jumpLink('thumbLink');
    },
  },
});
