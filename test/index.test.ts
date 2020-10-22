import processImage from '../src/index';
import { Breakpoint } from '../src/types';
import { CAT_PATH } from './globals';

const breakpoints: Breakpoint[] = [
  {
    imageWidth: 400,
    breakpoint: 500,
  },
  {
    imageWidth: 500,
    breakpoint: 600,
  },
];

test('processImage', async () => {
  const imageResult = await processImage({
    imageUrl: CAT_PATH,
    dir: `${__dirname}/../testDist`,
    publicDir: '/testDist',
    withWebp: true,
    webpOptions: {
      quality: 100,
    },
    orgOptions: {
      quality: 80,
    },
    withLqip: true,
    breakpoints,
  });
  console.log({ imageResult });
  expect(true).toBe(true);
});
