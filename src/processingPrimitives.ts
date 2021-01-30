import sharp from 'sharp';
import { MimeType, InputImage } from './types';
import { filePathToBuffer } from './utils';

export type LqipOptions = {
  /**
   * default width is 20
   */
  width?: number;
  /**
   * if no height is provided, the height is auto
   */
  height?: number;
};

export interface IGenerateLqip {
  inputImage: InputImage;
  mimeType: MimeType;
  options?: LqipOptions;
}
export async function generateLqip({
  inputImage,
  mimeType,
  options: { width, height } = { width: 20 },
}: IGenerateLqip): Promise<string> {
  const input =
    typeof inputImage === 'string'
      ? await filePathToBuffer(inputImage)
      : inputImage;

  return new Promise(resolve => {
    sharp(input)
      .resize({ width, height })
      .toBuffer()
      .then(result => {
        const resultString = result.toString('base64');
        resolve(`data:${mimeType};base64,${resultString}`);
      });
  });
}

export interface IGetAspectRatio {
  inputImage: InputImage;
}
export async function getAspectRatio({ inputImage }: IGetAspectRatio) {
  const input =
    typeof inputImage === 'string'
      ? await filePathToBuffer(inputImage)
      : inputImage;

  const { width, height } = await sharp(input).metadata();

  if (width === undefined || height === undefined) {
    throw new Error(`Couldn't read width or height from the input`);
  }

  const aspectRatio = height / width;
  return aspectRatio;
}
