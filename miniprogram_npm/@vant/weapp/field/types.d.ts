export interface InputDetails {
    /** 输入框内容 */
    value: string;
    /** 光标位置 */
    cursor?: number;
    /** keyCode 为键值 (目前工具还不支持返回keyCode参数) `2.1.0` 起支持 */
    keyCode?: number;
}
