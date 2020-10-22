export type Breakpoint = {
  imageWidth: number;
  breakpoint: number;
};

export enum MimeType {
  Jpeg = 'image/jpeg',
  Png = 'image/png',
  Webp = 'image/webp',
}

/**
 * Either a local file path, or a Buffer
 */
export type InputImage = Buffer | string;
