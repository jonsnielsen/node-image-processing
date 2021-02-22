import { Breakpoint } from './types';
import {
  filePathToBuffer,
  generateSizes,
  getHash,
  getBasename,
  getExtension,
  getMimeType,
  generateSrcSet,
  generateAllImageInfo,
  generateImageWidths,
} from './utils';
import {
  generateLqip,
  LqipOptions,
  getAspectRatio,
} from './processingPrimitives';
import fs from 'fs';
import sharp, { WebpOptions, JpegOptions, PngOptions } from 'sharp';

export type ProcessedImage = {
  src: string;
  srcSet: string;
  srcWebp?: string;
  srcSetWebp?: string;
  sizes?: string;
  aspectRatio: number;
  lqip?: string;
};

export interface IProcessImage {
  /**
   * an absolute file path - local or remote
   */
  imageUrl: string;
  breakpoints: Breakpoint[];
  multipliers?: number[];
  withLqip?: boolean;
  withWebp?: boolean;
  lqipOptions?: LqipOptions;
  webpOptions?: WebpOptions;
  orgOptions?: JpegOptions | PngOptions;
  /**
   * Absolute directory path that the processed images should be saved to
   */
  dir: string;
  /**
   * The dir that the images will be accessed from. TODO: explain more
   */
  publicDir: string;
}

export async function processImage({
  imageUrl,
  breakpoints,
  multipliers = [2],
  withWebp,
  withLqip,
  lqipOptions,
  webpOptions,
  orgOptions,
  dir,
  publicDir,
}: IProcessImage): Promise<ProcessedImage> {
  // if (typeof window === 'undefined')
  //   throw new Error('node-image-processing must be run in the server.');

  const startTime = new Date();
  const imageBuffer = await filePathToBuffer(imageUrl);

  // get hash of the input image that will be used as cache key and as folder name
  const hash = getHash(imageBuffer);

  // TODO: check if the image already exists. in cache
  // TODO: check in the cache if the same parameters were used

  const imageFileDir = `${dir}/${hash}`;
  const imagePublicDir = `${publicDir}/${hash}`;

  const imageName = getBasename(imageUrl);
  const imageExtension = getExtension(imageUrl);
  const mimeType = getMimeType(imageExtension);

  const allImageInfo = generateAllImageInfo({
    imageWidths: generateImageWidths(
      breakpoints.map(breakpoint => breakpoint.imageWidth),
      multipliers
    ),
    format: imageExtension,
    formatOptions: orgOptions,
    imageName,
    imageFileDir,
    imagePublicDir,
  });

  const allImageInfoWebP = !withWebp
    ? []
    : generateAllImageInfo({
        imageWidths: breakpoints.map(breakpoint => breakpoint.imageWidth),
        format: 'webp',
        formatOptions: webpOptions,
        imageName,
        imageFileDir,
        imagePublicDir,
      });

  // Make the default src the same as the largest image generated
  const orgSrc = allImageInfo[allImageInfo.length - 1].src;
  const webpSrc = allImageInfoWebP.length
    ? allImageInfoWebP[allImageInfoWebP.length - 1].src
    : undefined;

  const lqip = withLqip
    ? await generateLqip({
        inputImage: imageBuffer,
        options: lqipOptions,
        mimeType,
      })
    : undefined;

  const sizes = generateSizes(breakpoints);
  const srcSet = generateSrcSet(
    allImageInfo.map(imageInfo => imageInfo.srcSetSrc)
  );
  const srcSetWebp = withWebp
    ? generateSrcSet(allImageInfoWebP.map(imageInfo => imageInfo.srcSetSrc))
    : undefined;

  const aspectRatio = await getAspectRatio({ inputImage: imageBuffer });

  // check if all of the paths exist
  let isAllImagesCached = allImageInfo.every(imageInfo =>
    fs.existsSync(imageInfo.imagePath)
  );
  isAllImagesCached =
    !withWebp || !isAllImagesCached
      ? isAllImagesCached
      : allImageInfoWebP.every(imageInfo => fs.existsSync(imageInfo.imagePath));

  if (isAllImagesCached) {
    const endTime = new Date();
    console.log(
      `Skipping image: ${imageName} since it is already generated. Total elapsed time ${endTime.getTime() -
        startTime.getTime()}ms of ${imageUrl}`
    );
  } else {
    // create directory
    if (!fs.existsSync(imageFileDir)) {
      fs.mkdirSync(imageFileDir, { recursive: true });
    }

    // Generate images in original file extension
    await Promise.all(
      allImageInfo.map(
        async ({ imagePath, format, imageWidth, formatOptions }) => {
          await sharp(imageBuffer)
            .toFormat(format, formatOptions)
            .resize({ width: imageWidth })
            .toFile(imagePath);
        }
      )
    );

    await Promise.all(
      allImageInfoWebP.map(
        async ({ imagePath, format, imageWidth, formatOptions }) => {
          await sharp(imageBuffer)
            .toFormat(format, formatOptions)
            .resize({ width: imageWidth })
            .toFile(imagePath);
        }
      )
    );

    const endTime = new Date();
    console.log(
      `Generated ${allImageInfo.length +
        allImageInfoWebP.length} versions, in ${endTime.getTime() -
        startTime.getTime()}ms of ${imageUrl}`
    );
  }

  return {
    src: orgSrc,
    srcSet,
    srcWebp: webpSrc,
    srcSetWebp,
    lqip,
    aspectRatio,
    sizes,
  };
}
