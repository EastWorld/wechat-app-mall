/// <reference types="miniprogram-api-typings" />
interface WxWorkSystemInfo extends WechatMiniprogram.SystemInfo {
    environment?: 'wxwork';
}
interface SystemInfo extends WxWorkSystemInfo, WechatMiniprogram.SystemInfo {
}
export declare function getSystemInfoSync(): SystemInfo;
export declare function canIUseModel(): boolean;
export declare function canIUseFormFieldButton(): boolean;
export declare function canIUseAnimate(): boolean;
export declare function canIUseGroupSetData(): boolean;
export declare function canIUseNextTick(): boolean;
export declare function canIUseCanvas2d(): boolean;
export declare function canIUseGetUserProfile(): boolean;
export {};
