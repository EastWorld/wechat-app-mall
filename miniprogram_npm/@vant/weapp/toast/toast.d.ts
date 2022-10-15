/// <reference types="miniprogram-api-typings" />
/// <reference types="miniprogram-api-typings" />
declare type ToastMessage = string | number;
interface ToastOptions {
    show?: boolean;
    type?: string;
    mask?: boolean;
    zIndex?: number;
    context?: WechatMiniprogram.Component.TrivialInstance | WechatMiniprogram.Page.TrivialInstance;
    position?: string;
    duration?: number;
    selector?: string;
    forbidClick?: boolean;
    loadingType?: string;
    message?: ToastMessage;
    onClose?: () => void;
}
declare function Toast(toastOptions: ToastOptions | ToastMessage): WechatMiniprogram.Component.TrivialInstance | undefined;
declare namespace Toast {
    var loading: (options: ToastMessage | ToastOptions) => WechatMiniprogram.Component.TrivialInstance | undefined;
    var success: (options: ToastMessage | ToastOptions) => WechatMiniprogram.Component.TrivialInstance | undefined;
    var fail: (options: ToastMessage | ToastOptions) => WechatMiniprogram.Component.TrivialInstance | undefined;
    var clear: () => void;
    var setDefaultOptions: (options: ToastOptions) => void;
    var resetDefaultOptions: () => void;
}
export default Toast;
