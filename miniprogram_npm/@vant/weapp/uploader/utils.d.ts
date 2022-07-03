export interface File {
    url: string;
    size?: number;
    name?: string;
    type: string;
    duration?: number;
    time?: number;
    isImage?: boolean;
    isVideo?: boolean;
}
export declare function isImageFile(item: File): boolean;
export declare function isVideoFile(item: File): boolean;
export declare function chooseFile({ accept, multiple, capture, compressed, maxDuration, sizeType, camera, maxCount, }: {
    accept: any;
    multiple: any;
    capture: any;
    compressed: any;
    maxDuration: any;
    sizeType: any;
    camera: any;
    maxCount: any;
}): Promise<File | File[]>;
