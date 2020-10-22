import { Breakpoint } from './types';
import {
  filePathToBuffer,
  generateImageWidths,
  generateSizes,
  getHash,
  getBasename,
  getExtension,
  getMimeType,
  generateSrcSet,
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

interface IImageProcessing {
  /**
   * an absolute file path - local or remote
   */
  imageUrl: string;
  breakpoints: Breakpoint[];
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

const processImage = async ({
  imageUrl,
  breakpoints,
  withWebp,
  withLqip,
  lqipOptions,
  webpOptions,
  orgOptions,
  dir,
  publicDir,
}: IImageProcessing): Promise<ProcessedImage> => {
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
  const aspectRatio = await getAspectRatio({ inputImage: imageBuffer });

  // create directory if it doesn't already exist
  if (!fs.existsSync(imageFileDir)) {
    fs.mkdirSync(imageFileDir, { recursive: true });
  }

  const allImageWidths = generateImageWidths({
    imageWidths: breakpoints.map(({ imageWidth }) => imageWidth),
    multipliers: [2],
  });

  const lqip = withLqip
    ? await generateLqip({
        inputImage: imageBuffer,
        options: lqipOptions,
        mimeType,
      })
    : undefined;

  if (withWebp) {
    await sharp(imageBuffer)
      .toFormat('webp', webpOptions)
      .resize({ width: allImageWidths[allImageWidths.length - 1] })
      .toFile(`${imageFileDir}/${imageName}.webp`);
  }
  const webpSrc = !withWebp ? undefined : `${imagePublicDir}/${imageName}.webp`;

  const webpSources = !withWebp
    ? undefined
    : await Promise.all(
        allImageWidths.map(async imageWidth => {
          const savedImagePath = `${imageFileDir}/${imageName}-${imageWidth}.webp`;

          await sharp(imageBuffer)
            .toFormat('webp', webpOptions)
            .resize({ width: imageWidth })
            .toFile(savedImagePath);

          const src = `${imagePublicDir}/${imageName}-${imageWidth}.webp ${imageWidth}w`;
          return src;
        })
      );

  await sharp(imageBuffer)
    .toFormat(imageExtension, webpOptions)
    .resize({ width: allImageWidths[allImageWidths.length - 1] })
    .toFile(`${imageFileDir}/${imageName}.${imageExtension}`);
  const orgSrc = `${imagePublicDir}/${imageName}.${imageExtension}`;

  const orgSources = await Promise.all(
    allImageWidths.map(async imageWidth => {
      const savedImagePath = `${imageFileDir}/${imageName}-${imageWidth}.${imageExtension}`;

      await sharp(imageBuffer)
        .toFormat(imageExtension, orgOptions)
        .resize({ width: imageWidth })
        .toFile(savedImagePath);

      const src = `${imagePublicDir}/${imageName}-${imageWidth}.${imageExtension} ${imageWidth}w`;
      return src;
    })
  );

  const sizes = generateSizes(breakpoints);

  return {
    src: orgSrc,
    srcSet: generateSrcSet(orgSources),
    srcWebp: webpSrc,
    srcSetWebp: webpSources && generateSrcSet(webpSources),
    lqip,
    aspectRatio,
    sizes,
  };
};

export default processImage;
