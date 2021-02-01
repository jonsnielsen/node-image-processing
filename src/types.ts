import { WebpOptions, JpegOptions, PngOptions } from 'sharp';

export type Breakpoint = {
  imageWidth: number;
  breakpoint: number;
};

export enum MimeType {
  Jpeg = 'image/jpeg',
  Png = 'image/png',
  Webp = 'image/webp',
}

export type ImageInfo = {
  /**
   * The src used to generate srcSet
   */
  src: string;
  /**
   * The path where to save the image
   */
  imagePath: string;
  format: string;
  imageWidth: number;
  formatOptions?: WebpOptions | JpegOptions | PngOptions;
};

/**
 * Either a local file path, or a Buffer
 */
export type InputImage = Buffer | string;
