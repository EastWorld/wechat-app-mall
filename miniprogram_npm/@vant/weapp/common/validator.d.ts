export declare function isFunction(val: unknown): val is Function;
export declare function isPlainObject(val: unknown): val is Record<string, unknown>;
export declare function isPromise<T = unknown>(val: unknown): val is Promise<T>;
export declare function isDef(value: unknown): boolean;
export declare function isObj(x: unknown): x is Record<string, unknown>;
export declare function isNumber(value: string): boolean;
export declare function isBoolean(value: unknown): value is boolean;
export declare function isImageUrl(url: string): boolean;
export declare function isVideoUrl(url: string): boolean;
