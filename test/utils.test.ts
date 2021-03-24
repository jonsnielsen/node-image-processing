import {
  generateSizes,
  filePathToBuffer,
  generateAllImageInfo,
  getHash,
  getBasename,
  getExtension,
  getMimeType,
  generateSrcSet,
} from '../src/utils';
import { CAT_PATH } from './globals';
import { MimeType } from '../src/types';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

/**
 * generateSizes Tests
 */
test('with multiplier and duplicated values', () => {
  const result = generateSizes([
    { imageWidth: 400, breakpoint: 500 },
    { imageWidth: 600, breakpoint: 800 },
    { imageWidth: 800, breakpoint: 900 },
  ]);
  const expected = `(max-width: 500px) 80vw, (max-width: 800px) 75vw, 89vw`;
  expect(result).toEqual(expected);
});

test('Only one breakpoint', () => {
  const result = generateSizes([{ imageWidth: 400, breakpoint: 500 }]);
  const expected = `80vw`;
  expect(result).toEqual(expected);
});

/**
 * filePathToBuffer Tests
 */
test('filePathToBuffer works with remote and local filepath', async () => {
  const localFilePath = CAT_PATH;
  const remoteFilePath =
    'https://images.unsplash.com/photo-1461988320302-91bde64fc8e4?ixid=2yJhcHBfaWQiOjEyMDd9&&fm=jpg&w=400&fit=max';

  const localFilePathBuffer = await filePathToBuffer(localFilePath);

  mockedAxios.get.mockResolvedValue({ data: Buffer.alloc(10, 1) });
  const remoteFilePathBuffer = await filePathToBuffer(remoteFilePath);

  expect(localFilePathBuffer.byteLength).toBeGreaterThan(1);
  expect(remoteFilePathBuffer.byteLength).toBeGreaterThan(1);
});

/**
 * getHash Tests
 */
test('getHash', async () => {
  const imageBuffer = await filePathToBuffer(CAT_PATH);
  const hash = getHash(imageBuffer);
  const expected = '65b6d8ea46b255f5f981b9825a0285bb';
  expect(hash).toBe(expected);
});

/**
 * getHash Tests
 */
test('getBasename', () => {
  const localUrl =
    '/Users/jsparvath/Documents/programming/npm-packages/node-image-processing-tsdx/test/assets/localUrl.jpg';
  const remoteUrl = 'https://test.com/images/remoteUrl.png';
  const remoteUrlWithQueryParams =
    'https://test.com/images/remoteUrlWithQuery.png?w=400&fm=auto';

  const localUrlResult = getBasename(localUrl);
  const remoteUrlResult = getBasename(remoteUrl);
  const remoteUrlWithQueryParamsResult = getBasename(remoteUrlWithQueryParams);

  const localUrlExpected = 'localUrl';
  const remoteUrlExpected = 'remoteUrl';
  const remoteUrlWithQueryParamsExpected = 'remoteUrlWithQuery';
  // const result = getBasename();
  expect(localUrlResult).toBe(localUrlExpected);
  expect(remoteUrlResult).toBe(remoteUrlExpected);
  expect(remoteUrlWithQueryParamsResult).toBe(remoteUrlWithQueryParamsExpected);
});

/**
 * getExtension Tests
 */
test('getExtension', () => {
  const localUrl =
    '/Users/jsparvath/Documents/programming/npm-packages/node-image-processing-tsdx/test/assets/localUrl.jpg';
  const remoteUrl = 'https://test.com/images/remoteUrl.png';
  const withQueryParams = 'https://test.com/images/remoteUrl.png?time=1';

  const localUrlResult = getExtension(localUrl);
  const remoteUrlResult = getExtension(remoteUrl);
  const withQueryParamsResult = getExtension(withQueryParams);

  const localUrlExpected = 'jpg';
  const remoteUrlExpected = 'png';
  const withQueryParamsExpected = 'png';

  expect(localUrlResult).toBe(localUrlExpected);
  expect(remoteUrlResult).toBe(remoteUrlExpected);
  expect(withQueryParamsResult).toBe(withQueryParamsExpected);
});

/**
 * getMimeType Tests
 */
test('getMimeType', () => {
  const jpg = 'jpg';
  const jpeg = 'jpeg';
  const png = 'png';
  const webp = 'webp';
  const unknownType: any = 'something';

  const resultJpg = getMimeType(jpg);
  const resultJpeg = getMimeType(jpeg);
  const resultPng = getMimeType(png);
  const resultWebp = getMimeType(webp);
  const resultUnknown = () => getMimeType(unknownType);

  const expectedJpg = MimeType.Jpeg;
  const expectedJpeg = MimeType.Jpeg;
  const expectedPng = MimeType.Png;
  const expectedWebp = MimeType.Webp;

  expect(resultJpg).toBe(expectedJpg);
  expect(resultJpeg).toBe(expectedJpeg);
  expect(resultPng).toBe(expectedPng);
  expect(resultWebp).toBe(expectedWebp);
  expect(resultUnknown).toThrow();
});

/**
 * generateSrcSet Tests
 */
test('generateSrcSet', () => {
  const input = [
    '/folder/anotherfolder/cat-500.webp 500w',
    '/folder/anotherfolder/cat-1000.webp 1000w',
    '/folder/anotherfolder/cat-1500.webp 1500w',
  ];
  const result = generateSrcSet(input);
  const expected =
    '/folder/anotherfolder/cat-500.webp 500w, /folder/anotherfolder/cat-1000.webp 1000w, /folder/anotherfolder/cat-1500.webp 1500w';

  expect(result).toBe(expected);
});
