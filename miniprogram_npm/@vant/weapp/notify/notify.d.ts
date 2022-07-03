interface NotifyOptions {
    type?: 'primary' | 'success' | 'danger' | 'warning';
    color?: string;
    zIndex?: number;
    top?: number;
    message: string;
    context?: any;
    duration?: number;
    selector?: string;
    background?: string;
    safeAreaInsetTop?: boolean;
    onClick?: () => void;
    onOpened?: () => void;
    onClose?: () => void;
}
declare function Notify(options: NotifyOptions | string): any;
declare namespace Notify {
    var clear: (options?: NotifyOptions | undefined) => void;
}
export default Notify;
