export declare const YOUTUBE_REGEX: RegExp;
export declare const YOUTUBE_REGEX_GLOBAL: RegExp;
export declare const VIMEO_REGEX: RegExp;
export declare const VIMEO_REGEX_GLOBAL: RegExp;
export declare const FACEBOOK_REGEX: RegExp;
export declare const FACEBOOK_REGEX_GLOBAL: RegExp;
export declare const TIKTOK_REGEX: RegExp;
export declare const TIKTOK_REGEX_GLOBAL: RegExp;
export declare const isValidYoutubeUrl: (url: string) => RegExpMatchArray;
export declare const isValidVimeoUrl: (url: string) => RegExpMatchArray;
export declare const isValidFacebookUrl: (url: string) => RegExpMatchArray;
export declare const isValidTiktokUrl: (url: string) => RegExpMatchArray;
export interface GetEmbedUrlOptions {
    url: string;
    allowFullscreen?: boolean;
    autoplay?: boolean;
    ccLanguage?: string;
    ccLoadPolicy?: boolean;
    controls?: boolean;
    disableKBcontrols?: boolean;
    enableIFrameApi?: boolean;
    endTime?: number;
    interfaceLanguage?: string;
    ivLoadPolicy?: number;
    loop?: boolean;
    modestBranding?: boolean;
    nocookie?: boolean;
    origin?: string;
    playlist?: string;
    progressBarColor?: string;
    startAt?: number;
    rel?: number;
}
export interface GetEmbedTiktokUrlOptions {
    url: string;
    allowFullscreen?: boolean;
    autoplay?: boolean;
    controls?: boolean;
    loop?: boolean;
    rel?: number;
    musicInfo?: boolean;
    nativeContextMenu?: boolean;
    closedCaptions?: boolean;
}
export interface GetEmbedVimeoUrlOptions {
    url: string;
    allowFullscreen?: boolean;
    autoplay?: boolean;
    controls?: boolean;
    loop?: boolean;
    byline?: boolean;
    closedCaptions?: boolean;
    endTime?: number;
    startTime?: number;
    showLogo?: boolean;
    responsive?: boolean;
    portrait?: boolean;
    title?: boolean;
}
export interface GetEmbedFacebookUrlOptions {
    url: string;
    showText?: boolean;
    width?: number;
    height?: number;
}
export declare const getYoutubeEmbedUrl: (nocookie?: boolean) => "https://www.youtube-nocookie.com/embed/" | "https://www.youtube.com/embed/";
export declare const getEmbedUrlFromYoutubeUrl: (options: GetEmbedUrlOptions) => string;
export declare const getEmbedUrlFromVimeoUrl: (options: GetEmbedVimeoUrlOptions) => string;
export declare const getEmbedUrlFromFacebookUrl: (options: GetEmbedFacebookUrlOptions) => string;
export declare const getEmbedUrlFromTiktokUrl: (options: GetEmbedTiktokUrlOptions) => string;
