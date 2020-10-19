import { ImageSize } from './types';
import axios from 'axios';
import fs from 'fs';

interface IGenerateSizes {
  imageSizes: ImageSize[];
  multipliers: number[];
}

export function generateSizes({
  imageSizes,
  multipliers,
}: IGenerateSizes): number[] {
  const sizes = imageSizes.reduce((acc, { imageWidth }) => {
    acc.add(imageWidth);
    multipliers.forEach(multiplier => {
      acc.add(imageWidth * multiplier);
    });
    return acc;
  }, new Set<number>());

  let result = Array.from(sizes);
  result.sort((a, b) => a - b);

  return result;
}

interface IFilePathToBuffer {
  /**
   * Either remote or local filepath
   */
  filePath: string;
}
export const filePathToBuffer = async ({ filePath }: IFilePathToBuffer) => {
  const isRemoteFile =
    filePath.startsWith('http') || filePath.startsWith('https');

  return isRemoteFile
    ? ((await axios.get(filePath, { responseType: 'arraybuffer' }))
        .data as Buffer)
    : fs.readFileSync(filePath);
};
