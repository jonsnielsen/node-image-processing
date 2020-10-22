import { Breakpoint, MimeType } from './types';
import * as crypto from 'crypto';
import axios from 'axios';
import fs from 'fs';
import path from 'path';

interface IGenerateImageWidths {
  imageWidths: number[];
  multipliers: number[];
}

export function generateImageWidths({
  imageWidths,
  multipliers,
}: IGenerateImageWidths): number[] {
  const generatedImageWidths = imageWidths.reduce((acc, imageWidth) => {
    acc.add(imageWidth);
    multipliers.forEach(multiplier => {
      acc.add(imageWidth * multiplier);
    });
    return acc;
  }, new Set<number>());

  let result = Array.from(generatedImageWidths);
  result.sort((a, b) => a - b);

  return result;
}

/**
 * Generates a string to be used as the `sizes` attribute in the `source` element.
 *
 */
export function generateSizes(breakpoints: Breakpoint[]): string {
  const sizes = breakpoints.map(({ breakpoint, imageWidth }, index) => {
    const imageWidthPercent = Math.ceil((imageWidth / breakpoint) * 100);
    if (index === breakpoints.length - 1) {
      return `${imageWidthPercent}vw`;
    }
    return `(max-width: ${breakpoint}px) ${imageWidthPercent}vw`;

    // //  ? `, ${imageWidth}px` : '';
    // const fallbackSize =
    //   index === breakpoints.length - 1 ? `, ${imageWidth}px` : '';
    // return `(max-width: ${breakpoint}px) ${imageWidthPercent}vw` + fallbackSize;
  });

  const result = sizes.join(', ');
  return result;
}

export const filePathToBuffer = async (filePath: string) => {
  const isRemoteFile =
    filePath.startsWith('http') || filePath.startsWith('https');

  return isRemoteFile
    ? ((await axios.get(filePath, { responseType: 'arraybuffer' }))
        .data as Buffer)
    : fs.readFileSync(filePath);
};

/**
 * Calculates a hash for the given image and query string
 *
 * */
export const getHash = (buffer: Buffer): string => {
  const hash = crypto.createHash('md4');
  hash.update(buffer);
  return hash.digest('hex');
};

export const getBasename = (url: string) => {
  const result = path.basename(url, path.extname(url));
  return result;
};

export const getExtension = (url: string) => {
  const result = path.extname(url).slice(1);
  return result;
};

export const getMimeType = (extension: string) => {
  switch (extension) {
    case 'jpeg':
    case 'jpg':
      return MimeType.Jpeg;
    case 'png':
      return MimeType.Png;
    case 'webp':
      return MimeType.Webp;
    default:
      throw new Error(
        `extension "${extension}" didn't resolve to any mime type`
      );
  }
};

export const generateSrcSet = (sources: string[]) => {
  const result = sources.join(', ');
  return result;
};
