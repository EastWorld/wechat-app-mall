const WXAPI = require('apifm-wxapi')
Page({
    data: {
        active: 0,
        orderType: {
            0: "审核中",
            1: "审核成功",
            2: "审核失败",
            3: "待提交"
        },
        orderStatus: {
            INIT: "开户初审",
            OPEN_ACCOUNT_SUCCESS: "进件审核中",
            OPEN_ACCOUNT_FAIL: "开户失败",
            AUDITED_FAIL: "审核失败",
            AUDITED_SUCCESS: "进件成功",
            ENABLE: "使用中",
            DISABLE: "冻结中"
        },
        tabLsit: [ {
            name: "全部",
            type: ""
        }, {
            name: "企业商户",
            type: "COMPANY"
        }, {
            name: "标准商户",
            type: "INDIVIDUAL_BUSINESS_PEOPLE"
        }, {
            name: "小微商户",
            type: "INDIVIDUAL_SELLER"
        } ],
        orderList: [],
        typeObj: {
            INDIVIDUAL_SELLER: "小微商户进件",
            INDIVIDUAL_BUSINESS_PEOPLE: "个体工商户进件",
            COMPANY: "企业商户进件"
        },
        page: 1
    },
    onLoad: function() {
        this.bestPayMerchantList()
    },
    onReady: function() {},
    onShow: function() {
    },
    async bestPayMerchantList() {
        const res = await WXAPI.bestPayMerchantList({
            token: wx.getStorageSync('token'),
            pageSize: 10000,
            type: this.data.tabLsit[this.data.active].type
        })
        if (res.code == 0) {
            this.setData({
                orderList: res.data.result
            })
        } else {
            this.setData({
                orderList: []
            })
        }
    },
    onChange: function(t) {
        this.setData({
            active: t.detail.name,
            page: 1,
            orderList: []
        }), this.bestPayMerchantList();
    },
    pageToDetail: function(t) {
        console.log(t);
        var e = t.currentTarget.dataset.index, a = this.data.orderList;
        console.log(e, a);
        var n = a[e], o = n.type, i = n.id, r = n.status;
        "OPEN_ACCOUNT_SUCCESS" != r && "AUDITED_SUCCESS" != r && "ENABLE" != r && wx.navigateTo({
            url: "../merchant/index?type=".concat(o, "&id=").concat(i)
        });
    },
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {},
    onReachBottom: function() {
        var t = this.data, e = t.totalPage, a = t.page;
        a < e && (this.setData({
            page: ++a
        }), this.getList());
    },
    onShareAppMessage: function() {}
});