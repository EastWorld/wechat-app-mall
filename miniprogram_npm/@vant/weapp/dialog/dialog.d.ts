/// <reference types="miniprogram-api-typings" />
/// <reference types="miniprogram-api-typings" />
export type Action = 'confirm' | 'cancel' | 'overlay';
type DialogContext = WechatMiniprogram.Page.TrivialInstance | WechatMiniprogram.Component.TrivialInstance;
interface DialogOptions {
    lang?: string;
    show?: boolean;
    title?: string;
    width?: string | number | null;
    zIndex?: number;
    theme?: string;
    context?: (() => DialogContext) | DialogContext;
    message?: string;
    overlay?: boolean;
    selector?: string;
    ariaLabel?: string;
    /**
     * @deprecated use custom-class instead
     */
    className?: string;
    customStyle?: string;
    transition?: string;
    /**
     * @deprecated use beforeClose instead
     */
    asyncClose?: boolean;
    beforeClose?: null | ((action: Action) => Promise<void | boolean> | void);
    businessId?: number;
    sessionFrom?: string;
    overlayStyle?: string;
    appParameter?: string;
    messageAlign?: string;
    sendMessageImg?: string;
    showMessageCard?: boolean;
    sendMessagePath?: string;
    sendMessageTitle?: string;
    confirmButtonText?: string;
    cancelButtonText?: string;
    showConfirmButton?: boolean;
    showCancelButton?: boolean;
    closeOnClickOverlay?: boolean;
    confirmButtonOpenType?: string;
}
declare const Dialog: {
    (options: DialogOptions): Promise<WechatMiniprogram.Component.TrivialInstance>;
    alert(options: DialogOptions): Promise<WechatMiniprogram.Component.TrivialInstance>;
    confirm(options: DialogOptions): Promise<WechatMiniprogram.Component.TrivialInstance>;
    close(): void;
    stopLoading(): void;
    currentOptions: DialogOptions;
    defaultOptions: DialogOptions;
    setDefaultOptions(options: DialogOptions): void;
    resetDefaultOptions(): void;
};
export default Dialog;
