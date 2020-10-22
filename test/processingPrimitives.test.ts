import { generateLqip, getAspectRatio } from '../src/processingPrimitives';
import { filePathToBuffer } from '../src/utils';
import { MimeType } from '../src/types';
import { CAT_ASPECT_RATIO, CAT_PATH } from './globals';
const sizeOf = require('image-size');

test('generateLqip - local filepath, custom width', async () => {
  const lqipWidth = 15;
  const expectedheight = Math.floor(CAT_ASPECT_RATIO * lqipWidth);

  const lqip = await generateLqip({
    inputImage: CAT_PATH,
    mimeType: MimeType.Jpeg,
    options: {
      width: lqipWidth,
    },
  });

  const imgBuffer = Buffer.from(lqip.substr(23), 'base64');
  const dimensions = sizeOf(imgBuffer);

  expect(dimensions.width).toBe(lqipWidth);
  expect(dimensions.height).toBe(expectedheight); //
});

test('generateLqip - buffer, default width', async () => {
  const lqipWidth = 15;
  const expectedheight = Math.floor(CAT_ASPECT_RATIO * lqipWidth);

  const imageBuffer = await filePathToBuffer(CAT_PATH);

  const lqip = await generateLqip({
    inputImage: imageBuffer,
    mimeType: MimeType.Jpeg,
    options: {
      width: lqipWidth,
    },
  });

  const imgBuffer = Buffer.from(lqip.substr(23), 'base64');
  const dimensions = sizeOf(imgBuffer);

  expect(dimensions.width).toBe(lqipWidth);
  expect(dimensions.height).toBe(expectedheight);
});

test('getAspectRatio - buffer input', async () => {
  const expectedAspectRatio = CAT_ASPECT_RATIO;
  const delta = 0.01; // allow for one percent uncertainty of measurement

  const inputImageBuffer = await filePathToBuffer(CAT_PATH);

  const aspectRatio = await getAspectRatio({ inputImage: inputImageBuffer });

  expect(aspectRatio).toBeGreaterThan(expectedAspectRatio - delta);
  expect(aspectRatio).toBeLessThan(expectedAspectRatio + delta);
});

test('getAspectRatio - local filepath input', async () => {
  const expectedAspectRatio = CAT_ASPECT_RATIO;
  const delta = 0.01; // allow for one percent uncertainty of measurement

  const aspectRatio = await getAspectRatio({ inputImage: CAT_PATH });

  expect(aspectRatio).toBeGreaterThan(expectedAspectRatio - delta);
  expect(aspectRatio).toBeLessThan(expectedAspectRatio + delta);
});
