import { Node, mergeAttributes, nodePasteRule } from '@tiptap/core';

const YOUTUBE_REGEX = /^((?:https?:)?\/\/)?((?:www|m|music)\.)?((?:youtube\.com|youtu.be|youtube-nocookie\.com))(\/(?:[\w-]+\?v=|embed\/|v\/)?)([\w-]+)(\S+)?$/;
const YOUTUBE_REGEX_GLOBAL = /^((?:https?:)?\/\/)?((?:www|m|music)\.)?((?:youtube\.com|youtu.be|youtube-nocookie\.com))(\/(?:[\w-]+\?v=|embed\/|v\/)?)([\w-]+)(\S+)?$/g;
const VIMEO_REGEX = /^(https?:\/\/)?(www\.)?(vimeo\.com\/(video\/)?|player\.vimeo\.com\/video\/)(\d+)(\?.*)?$/;
const VIMEO_REGEX_GLOBAL = /^(https?:\/\/)?(www\.)?(vimeo\.com\/(video\/)?|player\.vimeo\.com\/video\/)(\d+)(\?.*)?$/g;
const FACEBOOK_REGEX = /^(https?:\/\/)?(www\.)?facebook\.com\/.+\/(videos|reel)\/\d+/;
const FACEBOOK_REGEX_GLOBAL = /^(https?:\/\/)?(www\.)?facebook\.com\/.+\/(videos|reel)\/\d+/g;
const TIKTOK_REGEX = /^(https?:\/\/)?(www\.)?tiktok\.com\/@.+\/video\/\d+/;
const TIKTOK_REGEX_GLOBAL = /^(https?:\/\/)?(www\.)?tiktok\.com\/@.+\/video\/\d+/g;
const isValidYoutubeUrl = (url) => {
    return url && url.match(YOUTUBE_REGEX);
};
const isValidVimeoUrl = (url) => {
    return url && url.match(VIMEO_REGEX);
};
const isValidFacebookUrl = (url) => {
    return url && url.match(FACEBOOK_REGEX);
};
const isValidTiktokUrl = (url) => {
    return url && url.match(TIKTOK_REGEX);
};
const getYoutubeEmbedUrl = (nocookie) => {
    return nocookie ? 'https://www.youtube-nocookie.com/embed/' : 'https://www.youtube.com/embed/';
};
const getEmbedUrlFromYoutubeUrl = (options) => {
    const { url, allowFullscreen, autoplay, ccLanguage, ccLoadPolicy, controls, disableKBcontrols, enableIFrameApi, endTime, interfaceLanguage, ivLoadPolicy, loop, modestBranding, nocookie, origin, playlist, progressBarColor, startAt, rel, } = options;
    if (!isValidYoutubeUrl(url)) {
        return null;
    }
    // if is already an embed url, return it
    if (url.includes('/embed/')) {
        return url;
    }
    // if is a youtu.be url, get the id after the /
    if (url.includes('youtu.be')) {
        const id = url.split('/').pop();
        if (!id) {
            return null;
        }
        return `${getYoutubeEmbedUrl(nocookie)}${id}`;
    }
    const videoIdRegex = /(?:v=|shorts\/)([-\w]+)/gm;
    const matches = videoIdRegex.exec(url);
    if (!matches || !matches[1]) {
        return null;
    }
    let outputUrl = `${getYoutubeEmbedUrl(nocookie)}${matches[1]}`;
    const params = [];
    if (allowFullscreen === false) {
        params.push('fs=0');
    }
    if (autoplay) {
        params.push('autoplay=1');
    }
    if (ccLanguage) {
        params.push(`cc_lang_pref=${ccLanguage}`);
    }
    if (ccLoadPolicy) {
        params.push('cc_load_policy=1');
    }
    if (!controls) {
        params.push('controls=0');
    }
    if (disableKBcontrols) {
        params.push('disablekb=1');
    }
    if (enableIFrameApi) {
        params.push('enablejsapi=1');
    }
    if (endTime) {
        params.push(`end=${endTime}`);
    }
    if (interfaceLanguage) {
        params.push(`hl=${interfaceLanguage}`);
    }
    if (ivLoadPolicy) {
        params.push(`iv_load_policy=${ivLoadPolicy}`);
    }
    if (loop) {
        params.push('loop=1');
    }
    if (modestBranding) {
        params.push('modestbranding=1');
    }
    if (origin) {
        params.push(`origin=${origin}`);
    }
    if (playlist) {
        params.push(`playlist=${playlist}`);
    }
    if (startAt) {
        params.push(`start=${startAt}`);
    }
    if (progressBarColor) {
        params.push(`color=${progressBarColor}`);
    }
    if (rel !== undefined) {
        params.push(`rel=${rel}`);
    }
    if (params.length) {
        outputUrl += `?${params.join('&')}`;
    }
    return outputUrl;
};
const getEmbedUrlFromVimeoUrl = (options) => {
    const { url, allowFullscreen, autoplay, controls, loop, byline, closedCaptions, endTime, startTime, showLogo, responsive, portrait, title } = options;
    if (!isValidVimeoUrl(url))
        return null;
    const match = url.match(/^(https?:\/\/)?(www\.)?(vimeo\.com\/(video\/)?|player\.vimeo\.com\/video\/)(\d+)(\?.*)?$/);
    if (!match)
        return null;
    const videoId = match[5];
    const outputUrl = `https://player.vimeo.com/video/${videoId}`;
    const params = [];
    if (!allowFullscreen) {
        console.log('allowFullscreen', allowFullscreen);
        params.push(`fullscreen=0`);
    }
    if (autoplay) {
        params.push('autoplay=1');
    }
    if (!controls) {
        params.push('controls=0');
    }
    if (loop) {
        params.push('loop=1');
    }
    if (!closedCaptions) {
        params.push('cc=0');
    }
    if (endTime) {
        params.push(`end_time=${endTime}`);
    }
    if (startTime) {
        params.push(`start_time=${startTime}`);
    }
    if (!showLogo) {
        params.push(`vimeo_logo=0`);
    }
    if (responsive) {
        params.push(`responsive=1`);
    }
    if (!title) {
        params.push(`title=0`);
    }
    if (!byline) {
        params.push(`byline=0`);
    }
    if (!portrait) {
        params.push(`portrait=0`);
    }
    if (params.length) {
        return `${outputUrl}?${params.join('&')}`;
    }
    return outputUrl;
};
const getEmbedUrlFromFacebookUrl = (options) => {
    const { url, width, height } = options;
    if (!isValidFacebookUrl(url))
        return null;
    const outputUrl = 'https://www.facebook.com/plugins/video.php';
    const params = [];
    params.push(`href=${encodeURIComponent(url)}`);
    {
        params.push(`show_text=0`);
    }
    if (width) {
        params.push(`width=${width}`);
    }
    if (height) {
        params.push(`height=${height}`);
    }
    if (params.length) {
        return `${outputUrl}?${params.join('&')}`;
    }
    return outputUrl;
};
const getEmbedUrlFromTiktokUrl = (options) => {
    const { url, allowFullscreen, autoplay, controls, loop, rel, musicInfo, nativeContextMenu, closedCaptions, } = options;
    if (!isValidTiktokUrl(url))
        return null;
    const videoId = url.split('/video/')[1].split('?')[0];
    if (!videoId)
        return null;
    const outputUrl = `https://www.tiktok.com/player/v1/${videoId}`;
    const params = [];
    params.push(`url=${encodeURIComponent(url)}`);
    if (autoplay) {
        params.push(`autoplay=1`);
    }
    if (loop) {
        params.push(`loop=1`);
    }
    if (rel !== undefined) {
        params.push(`rel=${rel}`);
    }
    if (!allowFullscreen) {
        params.push(`fullscreen_button=0`);
    }
    if (!controls) {
        params.push(`controls=0`);
    }
    if (!musicInfo) {
        params.push(`music_info=0`);
    }
    if (!nativeContextMenu) {
        params.push(`native_context_menu=0`);
    }
    if (!closedCaptions) {
        params.push(`closed_captions=0`);
    }
    if (params.length) {
        return `${outputUrl}?${params.join('&')}`;
    }
    return outputUrl;
};

/**
 * This extension adds support for youtube videos.
 * @see https://www.tiptap.dev/api/nodes/youtube
 */
const Youtube = Node.create({
    name: 'youtube',
    addOptions() {
        return {
            addPasteHandler: true,
            allowFullscreen: true,
            autoplay: false,
            ccLanguage: undefined,
            ccLoadPolicy: undefined,
            controls: true,
            disableKBcontrols: false,
            enableIFrameApi: false,
            endTime: 0,
            // height: 480,
            interfaceLanguage: undefined,
            ivLoadPolicy: 0,
            loop: false,
            modestBranding: false,
            HTMLAttributes: {},
            inline: false,
            nocookie: false,
            origin: '',
            playlist: '',
            progressBarColor: undefined,
            // width: 640,
            rel: 1,
        };
    },
    inline() {
        return this.options.inline;
    },
    group() {
        return this.options.inline ? 'inline' : 'block';
    },
    draggable: true,
    addAttributes() {
        return {
            src: {
                default: null,
            },
            start: {
                default: 0,
            },
            width: {
                default: null,
            },
            height: {
                default: null,
            },
        };
    },
    parseHTML() {
        return [
            {
                tag: 'div[data-youtube-video] iframe',
            },
        ];
    },
    addCommands() {
        return {
            setYoutubeVideo: (options) => ({ commands }) => {
                if (!isValidYoutubeUrl(options.src)) {
                    return false;
                }
                return commands.insertContent({
                    type: this.name,
                    attrs: options,
                });
            },
        };
    },
    addPasteRules() {
        if (!this.options.addPasteHandler) {
            return [];
        }
        return [
            nodePasteRule({
                find: YOUTUBE_REGEX_GLOBAL,
                type: this.type,
                getAttributes: match => {
                    return { src: match.input };
                },
            }),
        ];
    },
    renderHTML({ HTMLAttributes }) {
        const embedUrl = getEmbedUrlFromYoutubeUrl({
            url: HTMLAttributes.src,
            allowFullscreen: this.options.allowFullscreen,
            autoplay: this.options.autoplay,
            ccLanguage: this.options.ccLanguage,
            ccLoadPolicy: this.options.ccLoadPolicy,
            controls: this.options.controls,
            disableKBcontrols: this.options.disableKBcontrols,
            enableIFrameApi: this.options.enableIFrameApi,
            endTime: this.options.endTime,
            interfaceLanguage: this.options.interfaceLanguage,
            ivLoadPolicy: this.options.ivLoadPolicy,
            loop: this.options.loop,
            modestBranding: this.options.modestBranding,
            nocookie: this.options.nocookie,
            origin: this.options.origin,
            playlist: this.options.playlist,
            progressBarColor: this.options.progressBarColor,
            startAt: HTMLAttributes.start || 0,
            rel: this.options.rel,
        });
        HTMLAttributes.src = embedUrl;
        return [
            'div',
            { 'data-youtube-video': '' },
            [
                'iframe',
                mergeAttributes(this.options.HTMLAttributes, {
                    width: this.options.width,
                    height: this.options.height,
                    allowfullscreen: this.options.allowFullscreen,
                    autoplay: this.options.autoplay,
                    ccLanguage: this.options.ccLanguage,
                    ccLoadPolicy: this.options.ccLoadPolicy,
                    disableKBcontrols: this.options.disableKBcontrols,
                    enableIFrameApi: this.options.enableIFrameApi,
                    endTime: this.options.endTime,
                    interfaceLanguage: this.options.interfaceLanguage,
                    ivLoadPolicy: this.options.ivLoadPolicy,
                    loop: this.options.loop,
                    modestBranding: this.options.modestBranding,
                    origin: this.options.origin,
                    playlist: this.options.playlist,
                    progressBarColor: this.options.progressBarColor,
                    rel: this.options.rel,
                }, HTMLAttributes),
            ],
        ];
    },
});

const Vimeo = Node.create({
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
        return this.options.inline;
    },
    group() {
        return this.options.inline ? 'inline' : 'block';
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
            setVimeoVideo: (options) => ({ commands }) => {
                if (!isValidVimeoUrl(options.src))
                    return false;
                return commands.insertContent({
                    type: this.name,
                    attrs: options,
                });
            },
        };
    },
    addPasteRules() {
        if (!this.options.addPasteHandler)
            return [];
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
                mergeAttributes(this.options.HTMLAttributes, {
                    width: this.options.width,
                    height: this.options.height,
                }, HTMLAttributes),
            ],
        ];
    },
});

const Tiktok = Node.create({
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
            setTiktokVideo: (options) => ({ commands }) => {
                if (!isValidTiktokUrl(options.src))
                    return false;
                return commands.insertContent({
                    type: this.name,
                    attrs: options,
                });
            },
        };
    },
    addPasteRules() {
        if (!this.options.addPasteHandler)
            return [];
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
                mergeAttributes(this.options.HTMLAttributes, {
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
                }, HTMLAttributes),
            ],
        ];
    },
});

const Facebook = Node.create({
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
            setFacebookVideo: (options) => ({ commands }) => {
                if (!isValidFacebookUrl(options.src))
                    return false;
                return commands.insertContent({
                    type: this.name,
                    attrs: options,
                });
            },
        };
    },
    addPasteRules() {
        if (!this.options.addPasteHandler)
            return [];
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
            height: this.options.height});
        HTMLAttributes.src = embedUrl;
        return [
            'div',
            {
                'data-facebook-video': '',
            },
            [
                'iframe',
                mergeAttributes(this.options.HTMLAttributes, {
                    src: embedUrl,
                }, HTMLAttributes),
            ],
        ];
    },
});

var index = [Vimeo, Youtube, Tiktok, Facebook];

export { Facebook, Tiktok, Vimeo, Youtube, index as default };
//# sourceMappingURL=index.js.map
