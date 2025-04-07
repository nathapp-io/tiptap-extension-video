import { Node } from '@tiptap/core';
export interface FacebookOptions {
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
     * @default 640
     * @example 1280
     */
    width: number;
    /**
     * The height of the youtube video.
     * @default 480
     * @example 720
     */
    height: number;
    showText: boolean;
}
type SetFacebookVideoOptions = {
    src: string;
    width?: number;
    height?: number;
};
declare module '@tiptap/core' {
    interface Commands<ReturnType> {
        facebook: {
            setFacebookVideo: (options: SetFacebookVideoOptions) => ReturnType;
        };
    }
}
export declare const Facebook: Node<FacebookOptions, any>;
export {};
