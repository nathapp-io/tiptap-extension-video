export const YOUTUBE_REGEX = /^((?:https?:)?\/\/)?((?:www|m|music)\.)?((?:youtube\.com|youtu.be|youtube-nocookie\.com))(\/(?:[\w-]+\?v=|embed\/|v\/)?)([\w-]+)(\S+)?$/
export const YOUTUBE_REGEX_GLOBAL = /^((?:https?:)?\/\/)?((?:www|m|music)\.)?((?:youtube\.com|youtu.be|youtube-nocookie\.com))(\/(?:[\w-]+\?v=|embed\/|v\/)?)([\w-]+)(\S+)?$/g

export const VIMEO_REGEX = /^(https?:\/\/)?(www\.)?(vimeo\.com\/(video\/)?|player\.vimeo\.com\/video\/)(\d+)(\?.*)?$/;
export const VIMEO_REGEX_GLOBAL = /^(https?:\/\/)?(www\.)?(vimeo\.com\/(video\/)?|player\.vimeo\.com\/video\/)(\d+)(\?.*)?$/g;

export const FACEBOOK_REGEX = /^(https?:\/\/)?(www\.)?facebook\.com\/.+\/(videos|reel)\/\d+/;
export const FACEBOOK_REGEX_GLOBAL = /^(https?:\/\/)?(www\.)?facebook\.com\/.+\/(videos|reel)\/\d+/g;

export const TIKTOK_REGEX = /^(https?:\/\/)?(www\.)?tiktok\.com\/@.+\/video\/\d+/;
export const TIKTOK_REGEX_GLOBAL = /^(https?:\/\/)?(www\.)?tiktok\.com\/@.+\/video\/\d+/g;


export const isValidYoutubeUrl = (url: string) => {
  return url && url.match(YOUTUBE_REGEX)
}

export const isValidVimeoUrl = (url: string) => {
  return url && url.match(VIMEO_REGEX);
};

export const isValidFacebookUrl = (url: string) => {
  return url && url.match(FACEBOOK_REGEX);
};

export const isValidTiktokUrl = (url: string) => {
  return url && url.match(TIKTOK_REGEX);
};

export interface GetEmbedUrlOptions {
  url: string;
  allowFullscreen?: boolean;
  autoplay?: boolean;
  ccLanguage?:string;
  ccLoadPolicy?:boolean;
  controls?: boolean;
  disableKBcontrols?: boolean,
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

export const getYoutubeEmbedUrl = (nocookie?: boolean) => {
  return nocookie ? 'https://www.youtube-nocookie.com/embed/' : 'https://www.youtube.com/embed/'
}

export const getEmbedUrlFromYoutubeUrl = (options: GetEmbedUrlOptions) => {
  const {
    url,
    allowFullscreen,
    autoplay,
    ccLanguage,
    ccLoadPolicy,
    controls,
    disableKBcontrols,
    enableIFrameApi,
    endTime,
    interfaceLanguage,
    ivLoadPolicy,
    loop,
    modestBranding,
    nocookie,
    origin,
    playlist,
    progressBarColor,
    startAt,
    rel,
  } = options

  if (!isValidYoutubeUrl(url)) {
    return null
  }

  // if is already an embed url, return it
  if (url.includes('/embed/')) {
    return url
  }

  // if is a youtu.be url, get the id after the /
  if (url.includes('youtu.be')) {
    const id = url.split('/').pop()

    if (!id) {
      return null
    }
    return `${getYoutubeEmbedUrl(nocookie)}${id}`
  }

  const videoIdRegex = /(?:v=|shorts\/)([-\w]+)/gm
  const matches = videoIdRegex.exec(url)

  if (!matches || !matches[1]) {
    return null
  }

  let outputUrl = `${getYoutubeEmbedUrl(nocookie)}${matches[1]}`

  const params: string[] = []

  if (allowFullscreen === false) {
    params.push('fs=0')
  }

  if (autoplay) {
    params.push('autoplay=1')
  }

  if (ccLanguage) {
    params.push(`cc_lang_pref=${ccLanguage}`)
  }

  if (ccLoadPolicy) {
    params.push('cc_load_policy=1')
  }

  if (!controls) {
    params.push('controls=0')
  }

  if (disableKBcontrols) {
    params.push('disablekb=1')
  }

  if (enableIFrameApi) {
    params.push('enablejsapi=1')
  }

  if (endTime) {
    params.push(`end=${endTime}`)
  }

  if (interfaceLanguage) {
    params.push(`hl=${interfaceLanguage}`)
  }

  if (ivLoadPolicy) {
    params.push(`iv_load_policy=${ivLoadPolicy}`)
  }

  if (loop) {
    params.push('loop=1')
  }

  if (modestBranding) {
    params.push('modestbranding=1')
  }

  if (origin) {
    params.push(`origin=${origin}`)
  }

  if (playlist) {
    params.push(`playlist=${playlist}`)
  }

  if (startAt) {
    params.push(`start=${startAt}`)
  }

  if (progressBarColor) {
    params.push(`color=${progressBarColor}`)
  }

  if (rel !== undefined) {
    params.push(`rel=${rel}`)
  }

  if (params.length) {
    outputUrl += `?${params.join('&')}`
  }

  return outputUrl
}

export const getEmbedUrlFromVimeoUrl = (options: GetEmbedVimeoUrlOptions) => {

  const { 
    url, 
    allowFullscreen,
    autoplay,
    controls,
    loop,
    byline,
    closedCaptions,
    endTime,
    startTime,
    showLogo,
    responsive,
    portrait,
    title
   } = options

  if (!isValidVimeoUrl(url)) return null;

  const match = url.match(/^(https?:\/\/)?(www\.)?(vimeo\.com\/(video\/)?|player\.vimeo\.com\/video\/)(\d+)(\?.*)?$/)

  if(!match) return null;
  const videoId = match[5]

  const outputUrl = `https://player.vimeo.com/video/${videoId}`

  const params: string[] = []

  if(!allowFullscreen) {
    console.log('allowFullscreen', allowFullscreen)
    params.push(`fullscreen=0`)
  }

  if(autoplay) {
    params.push('autoplay=1')
  }

  if (!controls) {
    params.push('controls=0')
  }

  if (loop) {
    params.push('loop=1')
  }

  if(!closedCaptions) {
    params.push('cc=0')
  }

  if (endTime) {
    params.push(`end_time=${endTime}`)
  }

  if(startTime) {
    params.push(`start_time=${startTime}`)
  }

  if(!showLogo) {
    params.push(`vimeo_logo=0`)
  }

  if(responsive) {
    params.push(`responsive=1`)
  }

  if (!title) {
    params.push(`title=0`)
  }
  if (!byline) {
    params.push(`byline=0`)
  }
  if (!portrait) {
    params.push(`portrait=0`)
  }
  if (params.length) {
    return `${outputUrl}?${params.join('&')}`
  }
  return outputUrl
}

export const getEmbedUrlFromFacebookUrl = (options: GetEmbedUrlOptions) => {
  const { url } = options
  const showText = 0;

  if (!isValidFacebookUrl(url)) return null;

  const outputUrl = 'https://www.facebook.com/plugins/video.php'

  const params: string[] = []

  params.push(`href=${encodeURIComponent(url)}`)

  if (showText) {
    params.push(`show_text=${showText}`)
  }

  if (params.length) {
    return `${outputUrl}?${params.join('&')}`
  }
  return outputUrl
}

export const getEmbedUrlFromTiktokUrl = (options: GetEmbedTiktokUrlOptions) => {
  const {
    url,
    allowFullscreen,
    autoplay,
    controls,
    loop,
    rel,
    musicInfo,
    nativeContextMenu,
    closedCaptions,
  } = options

  if (!isValidTiktokUrl(url)) return null;

  const videoId = url.split('/video/')[1].split('?')[0]

  if (!videoId) return null;

  const outputUrl = `https://www.tiktok.com/player/v1/${videoId}`

  const params: string[] = []

  params.push(`url=${encodeURIComponent(url)}`)

  if (autoplay) {
    params.push(`autoplay=1`)
  }
  if (loop) {
    params.push(`loop=1`)
  }

  if (rel !== undefined) {
    params.push(`rel=${rel}`)
  }

  if(!allowFullscreen) {
    params.push(`fullscreen_button=0`)
  }

  if(!controls) {
    params.push(`controls=0`)
  }

  if(!musicInfo) {
    params.push(`music_info=0`)
  }

  if(!nativeContextMenu) {
    params.push(`native_context_menu=0`)
  }

  if(!closedCaptions) {
    params.push(`closed_captions=0`)
  }

  if (params.length) {
    return `${outputUrl}?${params.join('&')}`
  }
  return outputUrl
}