/// <reference types="miniprogram-api-typings" />
/// <reference types="miniprogram-api-typings" />
type IPageScrollOption = WechatMiniprogram.Page.IPageScrollOption;
type Scroller = (this: WechatMiniprogram.Component.TrivialInstance, event?: IPageScrollOption) => void;
export declare function pageScrollMixin(scroller: Scroller): string;
export {};
