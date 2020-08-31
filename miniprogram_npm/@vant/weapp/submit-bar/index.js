'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
var component_1 = require('../common/component');
component_1.VantComponent({
  classes: ['bar-class', 'price-class', 'button-class'],
  props: {
    tip: {
      type: null,
      observer: 'updateTip',
    },
    tipIcon: String,
    type: Number,
    price: {
      type: null,
      observer: 'updatePrice',
    },
    label: String,
    loading: Boolean,
    disabled: Boolean,
    buttonText: String,
    currency: {
      type: String,
      value: '¥',
    },
    buttonType: {
      type: String,
      value: 'danger',
    },
    decimalLength: {
      type: Number,
      value: 2,
      observer: 'updatePrice',
    },
    suffixLabel: String,
    safeAreaInsetBottom: {
      type: Boolean,
      value: true,
    },
  },
  methods: {
    updatePrice: function () {
      var _a = this.data,
        price = _a.price,
        decimalLength = _a.decimalLength;
      var priceStrArr =
        typeof price === 'number' &&
        (price / 100).toFixed(decimalLength).split('.');
      this.setData({
        hasPrice: typeof price === 'number',
        integerStr: priceStrArr && priceStrArr[0],
        decimalStr: decimalLength && priceStrArr ? '.' + priceStrArr[1] : '',
      });
    },
    updateTip: function () {
      this.setData({ hasTip: typeof this.data.tip === 'string' });
    },
    onSubmit: function (event) {
      this.$emit('submit', event.detail);
    },
  },
});
