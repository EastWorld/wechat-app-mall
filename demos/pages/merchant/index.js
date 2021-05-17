const WXAPI = require('apifm-wxapi');
const { wxpay } = require('../../../utils/pay');
var e = require("../../@babel/runtime/helpers/interopRequireDefault"), t = e(require("../../@babel/runtime/helpers/defineProperty")), a = e(require("../../@babel/runtime/regenerator")), i = e(require("../../@babel/runtime/helpers/asyncToGenerator"));

function n(e, t) {
    var a = Object.keys(e);
    if (Object.getOwnPropertySymbols) {
        var i = Object.getOwnPropertySymbols(e);
        t && (i = i.filter(function(t) {
            return Object.getOwnPropertyDescriptor(e, t).enumerable;
        })), a.push.apply(a, i);
    }
    return a;
}

function r(e) {
    for (var a = 1; a < arguments.length; a++) {
        var i = null != arguments[a] ? arguments[a] : {};
        a % 2 ? n(Object(i), !0).forEach(function(a) {
            (0, t.default)(e, a, i[a]);
        }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(i)) : n(Object(i)).forEach(function(t) {
            Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(i, t));
        });
    }
    return e;
}

var o, c = getApp(), f = require("dateformat");
var e = require("./api/index.js")
var ee = require("../../@babel/runtime/helpers/interopRequireDefault")(require("./api/index.js"));
var s = ee.default

Page({
    data: {
        typeIndex: "INDIVIDUAL_SELLER", // 小微商户:INDIVIDUAL_SELLER;个体工商户:INDIVIDUAL_BUSINESS_PEOPLE;企业商户:COMPANY
        typeObj: {
            INDIVIDUAL_SELLER: "小微商户进件",
            INDIVIDUAL_BUSINESS_PEOPLE: "个体工商户进件",
            COMPANY: "企业商户进件"
        },
        aaaList: [        
            {
                "id": 96,
                "mainCode": "MCC_TYPE",
                "mainName": "经营类型",
                "name": "门店场所",
                "code": "STORE_LOCATION",
                "value": ""
            },
            {
                "id": 97,
                "mainCode": "MCC_TYPE",
                "mainName": "经营类型",
                "name": "流动经营/便民服务",
                "code": "CONVENIENCE_SERVICE",
                "value": ""
            },
            {
                "id": 98,
                "mainCode": "MCC_TYPE",
                "mainName": "经营类型",
                "name": "服务交易/线上商品",
                "code": "SERVICE_TRANSACTION",
                "value": ""
            },
            {
                "id": 99,
                "mainCode": "REGIST_CERTIFICATE_TYPE",
                "mainName": "商户资质信息类型",
                "name": "营业执照",
                "code": "LICENSE",
                "value": ""
            },
            {
                "id": 100,
                "mainCode": "REGIST_CERTIFICATE_TYPE",
                "mainName": "商户资质信息类型",
                "name": "多证合一",
                "code": "MLICENSE",
                "value": ""
            },
            {
                "id": 101,
                "mainCode": "REGIST_CERTIFICATE_TYPE",
                "mainName": "商户资质信息类型",
                "name": "社证",
                "code": "SOCIETY",
                "value": ""
            },
            {
                "id": 102,
                "mainCode": "REGIST_CERTIFICATE_TYPE",
                "mainName": "商户资质信息类型",
                "name": "民证",
                "code": "CIVIL",
                "value": ""
            },
            {
                "id": 103,
                "mainCode": "REGIST_CERTIFICATE_TYPE",
                "mainName": "商户资质信息类型",
                "name": "事证",
                "code": "EVIDENCE",
                "value": ""
            },
            {
                "id": 104,
                "mainCode": "REGIST_CERTIFICATE_TYPE",
                "mainName": "商户资质信息类型",
                "name": "公司注册证书",
                "code": "CERTOFCORP",
                "value": ""
            },
            {
                "id": 105,
                "mainCode": "CERTIFICATE_TYPE",
                "mainName": "联系人证件类型",
                "name": "身份证",
                "code": "ID",
                "value": ""
            },
            {
                "id": 106,
                "mainCode": "CERTIFICATE_TYPE",
                "mainName": "联系人证件类型",
                "name": "护照",
                "code": "PASSPORT",
                "value": ""
            },
            {
                "id": 107,
                "mainCode": "CERTIFICATE_TYPE",
                "mainName": "联系人证件类型",
                "name": "台胞证",
                "code": "MTPS",
                "value": ""
            },
            {
                "id": 108,
                "mainCode": "CERTIFICATE_TYPE",
                "mainName": "联系人证件类型",
                "name": "港澳通行证",
                "code": "HMPASS",
                "value": ""
            }
        ],
        step: 1,
        currentDate: new Date().getTime(),
        isshowPicker: !1,
        isshowDatePicker: !1,
        isshowArea: !1,
        isshowBank: !1,
        isshow: !1,
        isshowCategory: !1,
        areaList: [],
        areaIdList: [],
        pickerList: [],
        categoryList: [],
        areaName: "",
        areaIndex: [],
        keyName: "",
        dateKeyName: "",
        termStartTime: {},
        termEndTime: {
            text: "2199-12-31",
            time: 72580032e5
        },
        cardStartTime: {
            text: "",
            time: ""
        },
        cardEndTime: {},
        idCardInfo: {
            list: [],
            value: ""
        },
        managementInfo: {
            list: [],
            value: ""
        },
        registCertificateTypeInfo: {
            list: [],
            value: ""
        },
        mccCodeName: "",
        settlementInfo: {
            bankType: "",
            bankAccountNo: "",
            bankName: "",
            bankAccountPhone: "",
            bankAssNo: "",
            bankCode: "",
            bankSettlementCert: ""
        },
        contactInfo: {
            contactName: "",
            contactPhone: "",
            certificateType: "",
            certificateNo: "",
            certificateBack: "",
            certificateFront: "",
            certificateValid: "",
            certificateAddress: "",
            contactEmail: ""
        },
        businessInfo: {
            merchantName: "",
            merchantShortName: "",
            businessScope: "",
            mccCode: "",
            mccType: "",
            provinceCode: "",
            cityCode: "",
            districtCode: "",
            address: "",
            signBoard: "",
            interior: ""
        },
        identifyInfo: {
            registCertificateCry: "CNY",
            registCertificateFront: "",
            registCertificateNo: "",
            registCertificateType: "",
            registCertificateValid: "",
            registCertificateCaptial: ""
        },
        bankList: [],
        fileList: {
            certificateFront: [],
            certificateBack: [],
            bankSettlementCert: [],
            signBoard: [],
            interior: [],
            registCertificateFront: []
        },
        extInfo: {
            certificateName: "身份证"
        },
        totalPage: 0,
        page: 1,
        keyword: "",
        recordId: "",
        payChannelRates: [ {
            name: "翼支付",
            billingValue: "0.35",
            payTool: "DEFAULT"
        }, {
            name: "支付宝",
            billingValue: "0.35",
            payTool: "ALIPAY"
        }, {
            name: "微信支付",
            billingValue: "0.35",
            payTool: "WECHATPAY"
        } ]
    },
    onLoad: (o = (0, i.default)(a.default.mark(function e(t) {
        return a.default.wrap(function(e) {
            for (;;) switch (e.prev = e.next) {
              case 0:
                if (t.type && this.setData({
                    typeIndex: t.type
                }), !t.id) {
                    e.next = 5;
                    break;
                }
                return this.setData({
                    recordId: t.id
                }), e.next = 5, this.getCompanyDetail();

              case 5:
                return this.setData({
                    userInfo: wx.getStorageSync("userInfo") || {}
                }), e.next = 8, this.getSelectList();

              case 8:
                return e.next = 10, this.getBankList();

              case 10:
                return e.next = 12, this.getAreaList(0, "0");

              case 12:
                return e.next = 14, this.getCategoryList();

              case 14:
              case "end":
                return e.stop();
            }
        }, e, this);
    })), function(e) {
        return o.apply(this, arguments);
    }),
    onShow: function() {},
    async getCompanyDetail() {
        const res = await WXAPI.bestPayMerchantDetail(wx.getStorageSync('token'), this.data.recordId)
        if (res.code != 0) {
            wx.showModal({
                title: '错误',
                content: '进件信息不存在',
                showCancel: false,
                success: res => {
                  if (res.confirm) {
                    wx.navigateBack()
                  }
                }
            })
        }
        const contactInfo = res.data.merchantInputAuthContactRespDTO
        contactInfo.certificateValid = contactInfo.validDate
        contactInfo.certificateFront = contactInfo.contactFront
        contactInfo.certificateBack = contactInfo.contactBack

        const settlementInfo = JSON.parse(res.data.merchantInputBankInfoRespDTO)
        settlementInfo.bankAccountNo = settlementInfo.settleCardNo
        settlementInfo.bankName = settlementInfo.bankBranchName
        settlementInfo.bankAssNo = settlementInfo.cnapsNo
        settlementInfo.bankAccountPhone = settlementInfo.phone
        settlementInfo.bankSettlementCert = settlementInfo.settlePic

        const businessInfo = res.data.merchantInputBaseInfoRespDTO
        businessInfo.mccType = businessInfo.manageType
        businessInfo.address = businessInfo.businessAddress
        businessInfo.signBoard = businessInfo.merchantSignboard
        businessInfo.interior = businessInfo.merchantInterior

        const identifyInfo = res.data.merchantInputAuthIdentifyRespDTO
        
        const _data = {
            contactInfo,
            settlementInfo,
            businessInfo,
            identifyInfo,
            areaName: contactInfo.residentCity,
            aaapcode: businessInfo.provinceCode,
            aaaccode: businessInfo.cityCode,
            aaaacode: businessInfo.districtCode,
        }

        if (identifyInfo) {
            identifyInfo.registCertificateNo = identifyInfo.registrationNumber
            identifyInfo.registCertificateFront = identifyInfo.paramValue
            identifyInfo.registCertificateCaptial = identifyInfo.registeredCapital
            _data.termStartTime = {
                text: identifyInfo.licenseBeginDate
            }
        }

        this.data.managementInfo.value = this.data.aaaList.find(ele => { return ele.code == businessInfo.manageType }).name
        this.data.identifyInfo.registCertificateNo = this.data.aaaList.find(ele => { return ele.code == businessInfo.manageType }).name

        const mccObj = this.data.categoryList.find(ele => {
            return ele.mccCode == businessInfo.mccCode
        })
        if (mccObj) {
            _data.mccCodeName = mccObj.mccName
        }

        this.setData(_data)
    },
    getSelectList: function() {
        const list = this.data.aaaList
        var e = this;
        var a = e.data, i = a.contactInfo, n = a.idCardInfo, r = a.managementInfo, o = a.registCertificateTypeInfo;
        list.forEach(function(e) {
            "CERTIFICATE_TYPE" === e.mainCode ? (n.list.push(e), "身份证" == e.name && (i.certificateType = e.code, 
            n.value = n.value || e.name)) : "MCC_TYPE" === e.mainCode ? r.list.push(e) : "REGIST_CERTIFICATE_TYPE" === e.mainCode && o.list.push(e);
        }), e.setData({
            idCardInfo: n,
            managementInfo: r,
            contactInfo: i,
            registCertificateTypeInfo: o
        });
    },
    async getAreaList(index, pid) {
        if (index > 2) {
            return
        }
        const res = await WXAPI.bestPayRegions(pid)
        if (res.code != 0) {
            return
        }
        const areaList = this.data.areaList
        const defaultIndex = 0 // 默认选中第几个对象
        areaList[index] = {
            values: res.data,
            defaultIndex
        }
        this.setData({
            areaList
        })
        this.getAreaList(index+1, res.data[defaultIndex].code)
    },
    async getBankList() {
        const res = await WXAPI.getBankList()
        if (res.code != 0) {
            this.setData({
                bankList: null,
                totalPage: 0
            })
            return
        }
        let bankList = res.data
        if (this.data.keyword) {
            bankList = bankList.filter(ele => {
                return ele.bankName.indexOf(this.data.keyword) != -1
            })
        }
        this.setData({
            bankList,
            totalPage: 1
        })
    },
    async getCategoryList() {
        const res = await WXAPI.bestPayMccList()
        if (res.code == 0) {
            let categoryList = res.data
            if (this.data.keyword) {
                categoryList = categoryList.filter(ele => {
                    return ele.mccName.indexOf(this.data.keyword) != -1
                })
            }
            const _data = {
                categoryList
            }
            console.log(this.data.businessInfo.mccCode);
            if (this.data.businessInfo.mccCode) {
                const mccObj = categoryList.find(ele => {
                    return ele.mccCode == this.data.businessInfo.mccCode
                })
                if (mccObj) {
                    _data.mccCodeName = mccObj.mccName
                }
            }
            this.setData(_data)
        }
    },
    searchBank: function() {
        this.setData({
            page: 1,
            bankList: []
        }), this.getBankList();
    },
    async afterRead(e) {
        const id = e.currentTarget.id // certificateFront
        const name = e.currentTarget.dataset.name // contactInfo
        const file = e.detail.file
        // fileList="{{fileList.certificateFront}}"
        console.log(e);
        const res = await WXAPI.uploadFileBestPay(file.url)
        if (res.code == 0) {
          const fileList = this.data.fileList
          if (id == 'certificateFront') {
            fileList.certificateFront = [file]
            this.data.contactInfo.certificateFront = res.data.fileId
            this.setData({
              fileList
            })
          }
          if (id == 'certificateBack') {
            fileList.certificateBack = [file]
            this.data.contactInfo.certificateBack = res.data.fileId
            this.setData({
              fileList
            })
          }
          if (id == 'bankSettlementCert') {
            fileList.bankSettlementCert = [file]
            this.data.settlementInfo.bankSettlementCert = res.data.fileId
            this.setData({
              fileList
            })
          }
          if (id == 'signBoard') {
            fileList.signBoard = [file]
            this.data.businessInfo.signBoard = res.data.fileId
            this.setData({
              fileList
            })
          }
          if (id == 'interior') {
            fileList.interior = [file]
            this.data.businessInfo.interior = res.data.fileId
            this.setData({
              fileList
            })
          }
          if (id == 'registCertificateFront') {
            fileList.registCertificateFront = [file]
            this.data.identifyInfo.registCertificateFront = res.data.fileId
            this.setData({
              fileList
            })
          }
        } else {
            wx.showToast({
              title: res.msg,
              icon: 'none'
            })
        }
    },
    deleteImg: function(e) {
        var a, i = e.currentTarget.id, n = "fileList." + i, r = e.currentTarget.dataset.name + "." + i;
        this.setData((a = {}, (0, t.default)(a, n, []), (0, t.default)(a, r, ""), a));
    },
    onChangeInp: function(e) {
        this.setData((0, t.default)({}, e.currentTarget.id, e.detail));
    },
    changePicker(e) {
        console.log(e);
        const idx = e.detail.index
        const value = e.detail.value
        if (e.detail.index == 2) {
            return
        }
        console.log(idx, value[idx].code);
        this.getAreaList(idx + 1, value[idx].code)
    },
    showPicker: function() {
        this.setData({
            isshowPicker: !this.data.isshowPicker
        });
    },
    showDatePicker: function() {
        this.setData({
            isshowDatePicker: !this.data.isshowDatePicker
        });
    },
    showBank: function() {
        this.setData({
            isshowBank: !this.data.isshowBank,
            keyword: ""
        });
    },
    showCategory: function() {
        this.setData({
            isshowCategory: !this.data.isshowCategory
        });
    },
    clickPicker: function(e) {
        console.log(e);
        var t = e.currentTarget.id, a = [];
        this.data[t].list.forEach(function(e) {
            a.push(e.name);
        }), this.setData({
            keyName: t,
            pickerList: a,
            isshowPicker: !0
        });
    },
    onConfirmPicker: function(e) {
        var t = e.detail, a = t.value, i = t.index, n = this.data.keyName, r = this.data[n].list[i].code, o = {
            isshowPicker: !1
        };
        "idCardInfo" === n ? (o["contactInfo.certificateType"] = r, o["idCardInfo.value"] = a) : "managementInfo" === n ? (o["businessInfo.mccType"] = r, 
        o["managementInfo.value"] = a) : "registCertificateTypeInfo" === n && (o["identifyInfo.registCertificateType"] = r, 
        o["registCertificateTypeInfo.value"] = a), this.setData(o);
    },
    showDatetimePicker: function(e) {
        this.setData({
            dateKeyName: e.currentTarget.id
        }), this.showDatePicker();
    },
    showArea: function() {
        this.setData({
            isshowArea: !this.data.isshowArea
        });
    },
    onConfirmDatetime: function(e) {
        var a = e.detail, i = this.data.dateKeyName, n = {
            text: f(a, "yyyy-mm-dd"),
            time: a
        };
        this.setData((0, t.default)({}, i, n)), this.showDatePicker();
    },
    onConfirmArea: function(e) {
        const index = e.detail.index
        const value = e.detail.value
        const _areaName = []
        value.forEach(ele => {
            _areaName.push(ele.name)
        })
        this.setData({
            aaapcode: null,
            aaaccode: null,
            aaaacode: null,
            areaIndex: index,
            areaName: _areaName.join('')
        })
        this.showArea()
    },
    clickBank: function(e) {
        console.log(e), this.setData({
            "settlementInfo.bankName": e.currentTarget.id,
            "settlementInfo.bankCode": e.currentTarget.dataset.code
        }), this.showBank();
    },
    clickCategory: function(e) {
        this.setData({
            mccCodeName: e.currentTarget.id,
            "businessInfo.mccCode": e.currentTarget.dataset.code
        }), this.showCategory();
    },
    bindscrolltolower: function() {
        var e = this.data, t = e.page;
        t <= e.totalPage && (this.setData({
            page: ++t
        }), this.getBankList());
    },
    upperStep: function() {
        this.setData({
            step: --this.data.step,
            page: 1
        });
    },
    bindRateInput: function(e) {
        var a = e.detail;
        a = (a = (a = (a = (a = a.replace(/[^\d.]/g, "")).replace(/^\./g, "")).replace(/\.{2,}/g, ".")).replace(".", "$#$").replace(/\./g, "").replace("$#$", ".")).replace(/^(\-)*(\d+)\.(\d\d).*$/, "$1$2.$3"), 
        this.setData((0, t.default)({}, "payChannelRates[".concat(e.currentTarget.id, "].billingValue"), a));
    },
    confirmContactInfo: function() {
        var e = this.data, t = e.settlementInfo, a = e.contactInfo, i = e.typeIndex;
        a.contactName ? a.contactPhone ? a.certificateNo ? a.certificateValid ? a.certificateFront ? a.certificateBack ? t.bankAccountNo ? t.bankName ? t.bankAccountPhone ? "COMPANY" != i || t.bankAssNo ? t.bankSettlementCert ? this.setData({
            step: ++this.data.step,
            page: 1
        }) : wx.showToast({
          title: '请上传结算证明',
          icon: 'none'
        }) : wx.showToast({
            title: '请输入银行联行号',
            icon: 'none'
        }) : wx.showToast({
            title: '请输入银行卡预留手机号',
            icon: 'none'
        }) : wx.showToast({
            title: '请选择开户银行名称',
            icon: 'none'
        }) : wx.showToast({
            title: '请输入收款银行卡号',
            icon: 'none'
        }) : wx.showToast({
            title: '请上传证件反面照',
            icon: 'none'
        }) : wx.showToast({
            title: '请上传证件正面照',
            icon: 'none'
        }) : wx.showToast({
            title: '请选择证件有效期',
            icon: 'none'
        }) : wx.showToast({
            title: '请输入证件号码',
            icon: 'none'
        }) : wx.showToast({
            title: '请输入手机号码',
            icon: 'none'
        }) : wx.showToast({
            title: '请输入法人姓名',
            icon: 'none'
        });
    },
    confirmBusiness: function() {
        var e = this.data, t = e.businessInfo, a = e.contactInfo, i = e.settlementInfo, n = e.areaName, r = e.typeIndex, o = e.recordId, s = e.payChannelRates, f = e.userInfo, l = e.idCardInfo, d = e.managementInfo, u = e.mccCodeName;
        if (t.merchantName) if (t.merchantShortName) if (t.businessScope) if (t.mccType) if (t.mccCode) if (n) if (t.address) if (t.signBoard) if (t.interior) if ("INDIVIDUAL_SELLER" == r) {
            for (var m = 0; m < s.length; m++) {
                var h = s[m].billingValue;
                if (!(h >= .26 && h <= .6)) {
                    c.Toast(s[m].name + "费率范围0.26~0.6");
                    break;
                }
            }
            if (s.filter(function(e) {
                return !(e.billingValue >= .26 && e.billingValue <= .6);
            }).length) return;
            var g = {
                businessInfo: t,
                settlementInfo: i,
                contactInfo: a,
                merchantApplyType: r,
                recommend: f.recommendId,
                extInfo: JSON.stringify({
                    certificateName: l.value,
                    mccTypeName: d.value,
                    mccCodeName: u,
                    areaName: n
                }),
                payChannelRates: "一级" == f.marking ? s : []
            };
            o ? (g.companyId = o, this.confirmRequest(g)) : this.confirmRequest(g);
        } else this.setData({
            step: ++this.data.step
        }); else wx.showToast({
            title: '请上传店内照片',
            icon: 'none'
        }); else wx.showToast({
            title: '请上传门头照片',
            icon: 'none'
        }); else wx.showToast({
            title: '请输入详细商户地址',
            icon: 'none'
        }); else wx.showToast({
            title: '请选择商户地址',
            icon: 'none'
        }); else wx.showToast({
            title: '请选择商户经营类目',
            icon: 'none'
        }); else wx.showToast({
            title: '请选择商户经营类型',
            icon: 'none'
        }); else wx.showToast({
            title: '请输入经营范围',
            icon: 'none'
        }); else wx.showToast({
            title: '请输入商户门头名称',
            icon: 'none'
        }); else wx.showToast({
            title: '请输入营业执照上的名称',
            icon: 'none'
        });
    },
    submit: function() {
        var e = this.data, t = e.businessInfo, a = e.settlementInfo, i = e.contactInfo, n = e.identifyInfo, r = e.termStartTime, o = e.termEndTime, s = e.typeIndex, f = e.recordId, l = e.idCardInfo, d = e.managementInfo, u = e.mccCodeName, m = e.areaName, h = e.registCertificateTypeInfo, g = e.payChannelRates, p = e.userInfo;
        if (n.registCertificateType) if (n.registCertificateNo) if (n.registCertificateFront) if (r.text) if (o.text) if (n.registCertificateCaptial) {
            for (var C = 0; C < g.length; C++) {
                var y = g[C].billingValue;
                if (!(y >= .26 && y <= .6)) {
                    c.Toast(g[C].name + "费率范围0.26~0.6");
                    break;
                }
            }
            if (g.filter(function(e) {
                return !(e.billingValue >= .26 && e.billingValue <= .6);
            }).length) return;
            n.registCertificateValid = r.text.replace(/-/g, "") + "-" + o.text.replace(/-/g, "");
            var I = {
                businessInfo: t,
                settlementInfo: a,
                contactInfo: i,
                identifyInfo: n,
                merchantApplyType: s,
                recommend: p.recommendId,
                extInfo: JSON.stringify({
                    certificateName: l.value,
                    mccTypeName: d.value,
                    mccCodeName: u,
                    areaName: m,
                    registCertificateName: h.value
                }),
                payChannelRates: "一级" == p.marking ? g : []
            };
            f ? (I.companyId = f, this.confirmRequest(I)) : this.confirmRequest(I);
        } else wx.showToast({
            title: '请输入注册资本金',
            icon: 'none'
        }); else wx.showToast({
            title: '请先选择证照截止日期',
            icon: 'none'
        }); else wx.showToast({
            title: '请先选择证照起始日期',
            icon: 'none'
        }); else wx.showToast({
            title: '请上传证照照片',
            icon: 'none'
        }); else wx.showToast({
            title: '请输入证照编号',
            icon: 'none'
        }); else wx.showToast({
            title: '请选择证照类型',
            icon: 'none'
        });
    },
    async confirmRequest(e) {
        const token = wx.getStorageSync('token')
        if (!token) {
            wx.showToast({
              title: '请先登陆',
              icon: 'none'
            })
            return
        }
        let postData = {
            token,
            merchantApplyType: e.merchantApplyType,
            merchantSignboard: e.businessInfo.signBoard,
            merchantInterior: e.businessInfo.interior,
            settlePic: e.settlementInfo.bankSettlementCert,
            contactFront: e.contactInfo.certificateFront,
            contactBack: e.contactInfo.certificateBack,
            manageType: e.businessInfo.mccType,
            businessAddress: e.businessInfo.address,
            settleCardNo: e.settlementInfo.bankAccountNo,
            bankBranchName: e.settlementInfo.bankName,
            phone: e.settlementInfo.bankAccountPhone,
            validDate: e.contactInfo.certificateValid,
            residentCity: this.data.areaName,
            licenseBeginDate: this.data.termStartTime.text,
            licenseEndDate: this.data.termEndTime.text,
            cnapsNo: e.settlementInfo.bankAssNo,
        }
        if (e.identifyInfo) {
            postData.businessCertificat = e.identifyInfo.registCertificateType
            postData.registrationNumber = e.identifyInfo.registCertificateNo
            postData.registeredCry =  e.identifyInfo.registCertificateCry
            postData.registeredCapital = e.identifyInfo.registCertificateCaptial
            postData.paramValue =  e.identifyInfo.registCertificateFront
        }
        
        const _extInfo = JSON.parse(e.extInfo)
        postData = Object.assign(postData, e.businessInfo, e.settlementInfo, e.contactInfo, e.identifyInfo, _extInfo)        
        
        postData.provinceCode = this.data.aaapcode ? this.data.aaapcode : this.data.areaList[0].values[this.data.areaIndex[0]].code
        postData.cityCode = this.data.aaaccode ? this.data.aaaccode : this.data.areaList[1].values[this.data.areaIndex[1]].code
        if (this.data.areaIndex.length == 3) {
            postData.districtCode = this.data.aaaacode ? this.data.aaaacode : this.data.areaList[2].values[this.data.areaIndex[2]].code
        }
        console.log(postData);
        const res = await WXAPI.bestPayMerchantSubmit(postData)
        if (res.code != 0) {
            wx.showToast({
              title: res.msg,
              icon: 'none'
            })
            return
        }
        wx.showToast({
          title: '提交成功',
        })
        setTimeout(() => {
            wx.navigateTo({
              url: '../record-list/index',
            })
        }, 1000);
    },
    updateRequest: function(e) {
        s.getCompanyUpdate(e).then(function(e) {
            console.log(e), "0" === e.code && wx.showModal({
                title: "提示",
                content: "提交成功",
                showCancel: !1,
                success: function(e) {
                    e.confirm && wx.navigateBack();
                }
            });
        });
    },
    ocrSuccess: function(e) {
        console.log(e);
    },
    doNothing: function() {},
    onShareAppMessage: function() {}
});