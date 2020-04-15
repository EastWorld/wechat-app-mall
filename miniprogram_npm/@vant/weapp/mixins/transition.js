"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("../common/utils");
var getClassNames = function (name) { return ({
    enter: "van-" + name + "-enter van-" + name + "-enter-active enter-class enter-active-class",
    'enter-to': "van-" + name + "-enter-to van-" + name + "-enter-active enter-to-class enter-active-class",
    leave: "van-" + name + "-leave van-" + name + "-leave-active leave-class leave-active-class",
    'leave-to': "van-" + name + "-leave-to van-" + name + "-leave-active leave-to-class leave-active-class"
}); };
var nextTick = function () { return new Promise(function (resolve) { return setTimeout(resolve, 1000 / 30); }); };
exports.transition = function (showDefaultValue) {
    return Behavior({
        properties: {
            customStyle: String,
            // @ts-ignore
            show: {
                type: Boolean,
                value: showDefaultValue,
                observer: 'observeShow'
            },
            // @ts-ignore
            duration: {
                type: null,
                value: 300,
                observer: 'observeDuration'
            },
            name: {
                type: String,
                value: 'fade'
            }
        },
        data: {
            type: '',
            inited: false,
            display: false
        },
        methods: {
            observeShow: function (value, old) {
                if (value === old) {
                    return;
                }
                value ? this.enter() : this.leave();
            },
            enter: function () {
                var _this = this;
                var _a = this.data, duration = _a.duration, name = _a.name;
                var classNames = getClassNames(name);
                var currentDuration = utils_1.isObj(duration) ? duration.enter : duration;
                this.status = 'enter';
                this.$emit('before-enter');
                Promise.resolve()
                    .then(nextTick)
                    .then(function () {
                    _this.checkStatus('enter');
                    _this.$emit('enter');
                    _this.setData({
                        inited: true,
                        display: true,
                        classes: classNames.enter,
                        currentDuration: currentDuration
                    });
                })
                    .then(nextTick)
                    .then(function () {
                    _this.checkStatus('enter');
                    _this.transitionEnded = false;
                    _this.setData({
                        classes: classNames['enter-to']
                    });
                })
                    .catch(function () { });
            },
            leave: function () {
                var _this = this;
                if (!this.data.display) {
                    return;
                }
                var _a = this.data, duration = _a.duration, name = _a.name;
                var classNames = getClassNames(name);
                var currentDuration = utils_1.isObj(duration) ? duration.leave : duration;
                this.status = 'leave';
                this.$emit('before-leave');
                Promise.resolve()
                    .then(nextTick)
                    .then(function () {
                    _this.checkStatus('leave');
                    _this.$emit('leave');
                    _this.setData({
                        classes: classNames.leave,
                        currentDuration: currentDuration
                    });
                })
                    .then(nextTick)
                    .then(function () {
                    _this.checkStatus('leave');
                    _this.transitionEnded = false;
                    setTimeout(function () { return _this.onTransitionEnd(); }, currentDuration);
                    _this.setData({
                        classes: classNames['leave-to']
                    });
                })
                    .catch(function () { });
            },
            checkStatus: function (status) {
                if (status !== this.status) {
                    throw new Error("incongruent status: " + status);
                }
            },
            onTransitionEnd: function () {
                if (this.transitionEnded) {
                    return;
                }
                this.transitionEnded = true;
                this.$emit("after-" + this.status);
                var _a = this.data, show = _a.show, display = _a.display;
                if (!show && display) {
                    this.setData({ display: false });
                }
            }
        }
    });
};
