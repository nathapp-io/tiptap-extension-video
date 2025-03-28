import { mergeAttributes, Node, nodePasteRule } from '@tiptap/core';

import { getEmbedUrlFromVimeoUrl, isValidVimeoUrl, VIMEO_REGEX_GLOBAL } from './utils';

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
}

type SetVimeoVideoOptions = { src: string; width?: number; height?: number };

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    vimeo: {
      setVimeoVideo: (options: SetVimeoVideoOptions) => ReturnType;
    };
  }
}

export const Vimeo = Node.create<VimeoOptions>({
  name: 'vimeo',

  group: 'block',

  draggable: true,

  addOptions() {
    return {
      addPasteHandler: true,
      HTMLAttributes: {},
      width: 640,
      height: 480,
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
    return [{ tag: 'div[data-vimeo-video] iframe' }];
  },

  addCommands() {
    return {
      setVimeoVideo:
        (options: SetVimeoVideoOptions) =>
        ({ commands }) => {
          if (!isValidVimeoUrl(options.src)) return false;

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
        find: VIMEO_REGEX_GLOBAL,
        type: this.type,
        getAttributes: (match) => ({ src: match.input }),
      }),
    ];
  },

  renderHTML({ HTMLAttributes }) {
    const embedUrl = getEmbedUrlFromVimeoUrl({
      url: HTMLAttributes.src,
    });

    HTMLAttributes.src = embedUrl;

    return [
      'div',
      {
        'data-vimeo-video': '',
        style: 'padding:56.25% 0 0 0; position:relative;',
      },
      [
        'iframe',
        mergeAttributes(
          this.options.HTMLAttributes,
          {
            src: embedUrl,
            frameborder: '0',
            width: this.options.width,
            height: this.options.height,
            allow: 'autoplay; fullscreen; picture-in-picture; clipboard-write',
            style: 'position:absolute; top:0; left:0; width:100%; height:100%;',
          },
          HTMLAttributes
        ),
      ],
    ];
  },
});
