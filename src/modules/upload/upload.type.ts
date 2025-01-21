// 限制上传的文件类型
export const acceptImages = [
  // 图片
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/bmp',
  'image/webp',
];

export const acceptVideos = [
  // 视频
  'video/mp4',
  'video/x-flv',
  'video/ogg',
  'video/webm',
];

export const acceptAudios = [
  // 音频
  'audio/mpeg',
  'audio/ogg',
];

export const acceptDocs = [
  // 文档
  'application/msword',
  'application/vnd.ms-excel',
  'application/vnd.ms-powerpoint',
  'application/pdf',
  'text/plain',
];

export const acceptTypes = [...acceptImages, ...acceptAudios, ...acceptVideos, ...acceptDocs];

/** 文件类型 */
export enum EMaterialType {
  IMAGE = 'image',
  VIDEO = 'video',
  AUDIO = 'audio',
  FILE = 'file',
  OTHER = 'other',
}

/** oss类型 */
export enum EOssType {
  QINIU = 'qiniu',
  OTHER = 'other',
}

/** 文件存储文件夹 */
export enum EFolder {
  /** 根目录 */
  ROOT = '',
  /** 用户头像 */
  AVATAR = 'avatar',
  /** Banner */
  BANNER = 'banner',
  /** 图标 */
  ICON = 'icon',
  /** 内容，富文本 */
  CONTENT = 'content',
  /** 用户内容 */
  USERCONTENT = 'usercontent',
  /** 视频 */
  VIDEO = 'video',
  /** 文件 */
  FILE = 'file',
  /** 音频 */
  AUDIO = 'audio',
  /** 其他 */
  OTHER = 'other',
  /** 素材 */
  MATERIAL = 'material',
}
