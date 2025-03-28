import { Node } from '@tiptap/core';
export interface TiktokOptions {
    /**
     * Controls if the paste handler for youtube videos should be added.
     * @default true
     * @example false
     */
    addPasteHandler: boolean;
    /**
     * Controls if the youtube video should be allowed to go fullscreen.
     * @default true
     * @example false
     */
    allowFullscreen: boolean;
    /**
     * Controls if the youtube video should autoplay.
     * @default false
     * @example true
     */
    autoplay: boolean;
    /**
     * Controls if the youtube video should loop.
     * @default false
     * @example true
     */
    loop: boolean;
    /**
     * Controls if the controls should be shown in the youtube video.
     * @default true
     * @example false
     */
    controls: boolean;
    /**
     * The HTML attributes for a youtube video node.
     * @default {}
     * @example { class: 'foo' }
     */
    HTMLAttributes: Record<string, any>;
    /**
    * Controls if the youtube node should be inline or not.
    * @default false
    * @example true
    */
    inline: boolean;
    /**
     * The width of the youtube video.
     * @example 1280
     */
    width?: number;
    /**
     * The height of the youtube video.
     * @example 720
     */
    height?: number;
    rel?: number;
    musicInfo?: boolean;
    nativeContextMenu?: boolean;
    closedCaptions?: boolean;
}
type SetTiktokVideoOptions = {
    src: string;
    width?: number;
    height?: number;
};
declare module '@tiptap/core' {
    interface Commands<ReturnType> {
        tiktok: {
            setTiktokVideo: (options: SetTiktokVideoOptions) => ReturnType;
        };
    }
}
export declare const Tiktok: Node<TiktokOptions, any>;
export {};
