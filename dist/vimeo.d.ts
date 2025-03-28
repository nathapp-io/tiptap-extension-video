import { Node } from '@tiptap/core';
export interface VimeoOptions {
    /**
     * Controls if the paste handler for youtube videos should be added.
     * @default true
     * @example false
     */
    addPasteHandler: boolean;
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
    controls: boolean;
    loop: boolean;
    byline: boolean;
    closedCaptions?: boolean;
    endTime?: number;
    startTime?: number;
    showLogo: boolean;
    responsive: boolean;
    portrait: boolean;
    title: boolean;
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
}
type SetVimeoVideoOptions = {
    src: string;
    width?: number;
    height?: number;
};
declare module '@tiptap/core' {
    interface Commands<ReturnType> {
        vimeo: {
            setVimeoVideo: (options: SetVimeoVideoOptions) => ReturnType;
        };
    }
}
export declare const Vimeo: Node<VimeoOptions, any>;
export {};
