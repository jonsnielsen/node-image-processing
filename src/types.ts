import {
  WebpOptions,
  JpegOptions,
  PngOptions,
  FormatEnum,
  AvailableFormatInfo,
} from 'sharp';

export type Breakpoint = {
  imageWidth: number;
  breakpoint: number;
};

export enum MimeType {
  Jpeg = 'image/jpeg',
  Png = 'image/png',
  Webp = 'image/webp',
}

export type Format = keyof FormatEnum | AvailableFormatInfo;

export type ImageInfo = {
  /**
   * The src of the image in the public directory (without width descriptor)
   */
  src: string;
  /**
   * The src used to generate srcSet (width the width descriptor in the end)
   */
  srcSetSrc: string;
  /**
   * The path where to save the image
   */
  imagePath: string;
  format: Format;
  imageWidth: number;
  formatOptions?: WebpOptions | JpegOptions | PngOptions;
};

/**
 * Either a local file path, or a Buffer
 */
export type InputImage = Buffer | string;
