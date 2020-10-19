import sharp from 'sharp';
import { MimeType, InputImage } from './types';

interface IGenerateLqip {
  inputImage: InputImage;
  mimeType: MimeType;
  options: {
    /**
     * default width is 20
     */
    width?: number;
    /**
     * if no height is provided, the height is auto
     */
    height?: number;
  };
}
export async function generateLqip({
  inputImage,
  mimeType,
  options: { width = 20, height },
}: IGenerateLqip): Promise<string> {
  return new Promise(resolve => {
    sharp(inputImage)
      .resize({ width, height })
      .toBuffer()
      .then(result => {
        const resultString = result.toString('base64');
        resolve(`data:${mimeType};base64,${resultString}`);
      });
  });
}

interface IGetAspectRatio {
  inputImage: InputImage;
}
export async function getAspectRatio({ inputImage }: IGetAspectRatio) {
  const { width, height } = await sharp(inputImage).metadata();

  if (width === undefined || height === undefined) {
    throw new Error(`Couldn't read width or height from the input`);
  }

  const aspectRatio = height / width;
  return aspectRatio;
}
