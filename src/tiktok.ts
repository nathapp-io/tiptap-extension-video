import { mergeAttributes, Node, nodePasteRule } from '@tiptap/core';

import { getEmbedUrlFromTiktokUrl, isValidTiktokUrl, TIKTOK_REGEX_GLOBAL } from './utils';

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

type SetTiktokVideoOptions = { src: string; width?: number; height?: number };

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    tiktok: {
      setTiktokVideo: (options: SetTiktokVideoOptions) => ReturnType;
    };
  }
}

export const Tiktok = Node.create<TiktokOptions>({
  name: 'tiktok',

  group: 'block',

  draggable: true,

  addOptions() {
    return {
      addPasteHandler: true,
      HTMLAttributes: {},
      allowFullscreen: true,
      autoplay: false,
      loop: false,
      controls: true,
      rel: 0,
      musicInfo: false,
      nativeContextMenu: false,
      closedCaptions: false,
      inline: false,
    };
  },

  addAttributes() {
    return {
      src: { default: null },
      width: { default: this.options.width },
      height: { default: this.options.height },
    };
  },

  parseHTML() {
    return [{ tag: 'div[data-tiktok-video] iframe' }];
  },

  addCommands() {
    return {
      setTiktokVideo:
        (options: SetTiktokVideoOptions) =>
        ({ commands }) => {
          if (!isValidTiktokUrl(options.src)) return false;

          return commands.insertContent({
            type: this.name,
            attrs: options,
          });
        },
    };
  },

  addPasteRules() {
    if (!this.options.addPasteHandler) return [];

    return [
      nodePasteRule({
        find: TIKTOK_REGEX_GLOBAL,
        type: this.type,
        getAttributes: (match) => ({ src: match.input }),
      }),
    ];
  },

  renderHTML({ HTMLAttributes }) {
    const embedUrl = getEmbedUrlFromTiktokUrl({
      url: HTMLAttributes.src,
      allowFullscreen: this.options.allowFullscreen,
      autoplay: this.options.autoplay,
      loop: this.options.loop,
      controls: this.options.controls,
      rel: this.options.rel,
      musicInfo: this.options.musicInfo,
      nativeContextMenu: this.options.nativeContextMenu,
      closedCaptions: this.options.closedCaptions,
    });

    HTMLAttributes.src = embedUrl;

    return [
      'div',
      {
        'data-tiktok-video': '',
      },
      [
        'iframe',
        mergeAttributes(
          this.options.HTMLAttributes,
          {
            src: embedUrl,
            width: this.options.width,
            height: this.options.height,
            allowfullscreen: this.options.allowFullscreen,
            autoplay: this.options.autoplay,     
            loop: this.options.loop,
            controls: this.options.controls,
            rel: this.options.rel,
            musicInfo: this.options.musicInfo,
            nativeContextMenu: this.options.nativeContextMenu,
            closedCaptions: this.options.closedCaptions,
          },
          HTMLAttributes
        ),
      ],
    ];
  },
});
