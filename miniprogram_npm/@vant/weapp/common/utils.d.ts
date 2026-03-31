/// <reference types="node" />
/// <reference types="miniprogram-api-typings" />
/// <reference types="miniprogram-api-typings" />
/// <reference types="miniprogram-api-typings" />
/// <reference types="miniprogram-api-typings" />
export { isDef } from './validator';
export { getSystemInfoSync } from './version';
export declare function range(num: number, min: number, max: number): number;
export declare function nextTick(cb: (...args: any[]) => void): void;
export declare function addUnit(value?: string | number): string | undefined;
export declare function requestAnimationFrame(cb: () => void): NodeJS.Timeout;
export declare function pickExclude(obj: unknown, keys: string[]): {};
export declare function getRect(context: WechatMiniprogram.Component.TrivialInstance, selector: string): Promise<WechatMiniprogram.BoundingClientRectCallbackResult>;
export declare function getAllRect(context: WechatMiniprogram.Component.TrivialInstance, selector: string): Promise<WechatMiniprogram.BoundingClientRectCallbackResult[]>;
export declare function groupSetData(context: WechatMiniprogram.Component.TrivialInstance, cb: () => void): void;
export declare function toPromise(promiseLike: Promise<unknown> | unknown): Promise<unknown>;
export declare function addNumber(num1: any, num2: any): number;
export declare const clamp: (num: any, min: any, max: any) => number;
export declare function getCurrentPage<T>(): T & WechatMiniprogram.OptionalInterface<WechatMiniprogram.Page.ILifetime> & WechatMiniprogram.Page.InstanceProperties & WechatMiniprogram.Page.InstanceMethods<WechatMiniprogram.IAnyObject> & WechatMiniprogram.Page.Data<WechatMiniprogram.IAnyObject> & WechatMiniprogram.IAnyObject;
export declare const isPC: boolean;
export declare const isWxWork: boolean;
