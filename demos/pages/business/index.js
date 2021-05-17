const WXAPI = require('apifm-wxapi')
const AUTH = require('../../../utils/auth')
Page({
    data: {
        list: [{
            title: "企业商户(对公结算)",
            desc: "需提供法人身份证、银行结算账户、营业执照照片等",
            icon: "../../images/icon_qiye.png",
            url: "../merchant/index?type=COMPANY"
        }, {
            title: "标准商户(个体工商户)",
            desc: "需提供经营者身份证、结算银行卡(借记卡)、营业执照照片",
            icon: "../../images/icon_biaozhun.png",
            url: "../merchant/index?type=INDIVIDUAL_BUSINESS_PEOPLE"
        }, {
            title: "无证小微商户",
            desc: "需提供经营者身份证、结算银行卡(借记卡)照片",
            icon: "../../images/icon_xiaowei.png",
            url: "../merchant/index?type=INDIVIDUAL_SELLER"
        }]
    },
    onLoad: function (n) {},
    onShow: function () {
        AUTH.checkHasLogined().then(isLogined => {
            if (isLogined) {
                this.getUserApiInfo()
            } else {
                AUTH.login().then(res => {
                    this.getUserApiInfo()
                })
            }
        })
    },
    pageTo: function (n) {
        this.data.mobile ? wx.navigateTo({
            url: n.currentTarget.dataset.url
        }) : wx.showModal({
            title: "提示",
            content: "请先绑定手机号",
            success: function (n) {
                n.confirm && wx.navigateTo({
                    url: "../bind-phone/index"
                });
            }
        });
    },
    onHide: function () {},
    onUnload: function () {},
    onPullDownRefresh: function () {},
    onReachBottom: function () {},
    onShareAppMessage: function () {},
    async getUserApiInfo() {
        const res = await WXAPI.userDetail(wx.getStorageSync('token'))
        if (res.code == 0) {
            this.setData({
                mobile: res.data.base.mobile,
            })
        }
    },
});