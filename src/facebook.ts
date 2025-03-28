import { mergeAttributes, Node, nodePasteRule } from '@tiptap/core';

import { getEmbedUrlFromFacebookUrl, isValidFacebookUrl, FACEBOOK_REGEX_GLOBAL } from './utils';

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

type SetFacebookVideoOptions = { src: string; width?: number; height?: number };

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    facebook: {
      setFacebookVideo: (options: SetFacebookVideoOptions) => ReturnType;
    };
  }
}

export const Facebook = Node.create<FacebookOptions>({
  name: 'facebook',

  group: 'block',

  draggable: true,

  addOptions() {
    return {
      allowFullscreen: true,
      addPasteHandler: true,
      HTMLAttributes: {},
      width: 640,
      height: 480,
      showText: false,
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
    return [{ tag: 'div[data-facebook-video] iframe' }];
  },

  addCommands() {
    return {
      setFacebookVideo:
        (options: SetFacebookVideoOptions) =>
        ({ commands }) => {
          if (!isValidFacebookUrl(options.src)) return false;

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
        find: FACEBOOK_REGEX_GLOBAL,
        type: this.type,
        getAttributes: (match) => ({ src: match.input }),
      }),
    ];
  },

  renderHTML({ HTMLAttributes }) {
    const embedUrl = getEmbedUrlFromFacebookUrl({
      url: HTMLAttributes.src,
      width: this.options.width,
      height: this.options.height,
      showText: false,
    });

    HTMLAttributes.src = embedUrl;

    return [
      'div',
      {
        'data-facebook-video': '',
      },
      [
        'iframe',
        mergeAttributes(
          this.options.HTMLAttributes,
          {
            src: embedUrl,
          },
          HTMLAttributes
        ),
      ],
    ];
  },
});
