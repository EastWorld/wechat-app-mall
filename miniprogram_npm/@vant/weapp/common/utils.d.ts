/// <reference types="miniprogram-api-typings" />
/// <reference types="node" />
/// <reference types="miniprogram-api-typings" />
/// <reference types="miniprogram-api-typings" />
/// <reference types="miniprogram-api-typings" />
export { isDef } from './validator';
export declare function range(num: number, min: number, max: number): number;
export declare function nextTick(cb: (...args: any[]) => void): void;
export declare function getSystemInfoSync(): WechatMiniprogram.SystemInfo;
export declare function addUnit(value?: string | number): string | undefined;
export declare function requestAnimationFrame(cb: () => void): NodeJS.Timeout | WechatMiniprogram.NodesRef;
export declare function pickExclude(obj: unknown, keys: string[]): {};
export declare function getRect(context: WechatMiniprogram.Component.TrivialInstance, selector: string): Promise<WechatMiniprogram.BoundingClientRectCallbackResult>;
export declare function getAllRect(context: WechatMiniprogram.Component.TrivialInstance, selector: string): Promise<WechatMiniprogram.BoundingClientRectCallbackResult[]>;
export declare function groupSetData(context: WechatMiniprogram.Component.TrivialInstance, cb: () => void): void;
export declare function toPromise(promiseLike: Promise<unknown> | unknown): Promise<unknown>;
export declare function getCurrentPage<T>(): T & WechatMiniprogram.OptionalInterface<WechatMiniprogram.Page.ILifetime> & WechatMiniprogram.Page.InstanceProperties & WechatMiniprogram.Page.InstanceMethods<WechatMiniprogram.IAnyObject> & WechatMiniprogram.Page.Data<WechatMiniprogram.IAnyObject> & WechatMiniprogram.IAnyObject;
