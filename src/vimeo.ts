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

  addOptions() {
    return {
      addPasteHandler: true,
      HTMLAttributes: {},
      allowFullscreen: true,
      autoplay: false,
      closedCaptions: false,
      controls: true,
      byline: false,
      loop: false,
      showLogo: false,
      responsive: true,
      portrait: false,
      title: false,
      inline: false,
    };
  },

  inline() {
    return this.options.inline
  },

  group() {
    return this.options.inline ? 'inline' : 'block'
  },

  draggable: true,

  addAttributes() {
    return {
      src: { default: null },
      start: {
        default: 0,
      },      
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
      allowFullscreen: this.options.allowFullscreen,
      autoplay: this.options.autoplay,
      controls: this.options.controls,
      loop: this.options.loop,
      byline: this.options.byline,
      closedCaptions: this.options.closedCaptions,
      endTime: this.options.endTime,
      startTime: HTMLAttributes.start || 0,
      showLogo: this.options.showLogo,
      responsive: this.options.responsive,
      portrait: this.options.portrait,
      title: this.options.title,
    });

    HTMLAttributes.src = embedUrl;

    return [
      'div',
      {
        'data-vimeo-video': '',
      },
      [
        'iframe',
        mergeAttributes(
          this.options.HTMLAttributes,
          {
            width: this.options.width,
            height: this.options.height,
          },
          HTMLAttributes
        ),
      ],
    ];
  },
});
