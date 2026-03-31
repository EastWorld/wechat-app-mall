/// <reference types="miniprogram-api-typings" />
type TrivialInstance = WechatMiniprogram.Component.TrivialInstance;
export declare function useParent(name: string, onEffect?: (this: TrivialInstance) => void): {
    relations: {
        [x: string]: WechatMiniprogram.Component.RelationOption;
    };
    mixin: string;
};
export declare function useChildren(name: string, onEffect?: (this: TrivialInstance, target: TrivialInstance) => void): {
    relations: {
        [x: string]: WechatMiniprogram.Component.RelationOption;
    };
    mixin: string;
};
export {};
