import { generateSizes, filePathToBuffer } from '../src/utils';
import { CAT_PATH } from './globals';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

/**
 * generateSizes Tests
 */
test('with multiplier and duplicated values', () => {
  const result = generateSizes({
    imageSizes: [
      { imageWidth: 400, breakpoint: 500 },
      { imageWidth: 600, breakpoint: 800 },
      { imageWidth: 800, breakpoint: 900 },
    ],
    multipliers: [2],
  });
  const expected = [400, 600, 800, 1200, 1600];
  expect(result).toEqual(expected);
});

test('no duplicated sizes', () => {
  const result = generateSizes({
    imageSizes: [
      { imageWidth: 400, breakpoint: 500 },
      { imageWidth: 600, breakpoint: 800 },
      { imageWidth: 800, breakpoint: 900 },
    ],
    multipliers: [2],
  });
  const expected = [400, 600, 800, 800, 1200, 1600];
  expect(result).not.toEqual(expected);
});

test('with no multipliers', () => {
  const result = generateSizes({
    imageSizes: [
      { imageWidth: 400, breakpoint: 500 },
      { imageWidth: 600, breakpoint: 800 },
      { imageWidth: 800, breakpoint: 900 },
    ],
    multipliers: [],
  });
  const expected = [400, 600, 800];
  expect(result).toEqual(expected);
});

test('with 1x multiplier included (which does nothing extra)', () => {
  const result = generateSizes({
    imageSizes: [
      { imageWidth: 400, breakpoint: 500 },
      { imageWidth: 600, breakpoint: 800 },
      { imageWidth: 800, breakpoint: 900 },
    ],
    multipliers: [1, 2],
  });
  const expected = [400, 600, 800, 1200, 1600];
  expect(result).toEqual(expected);
});

/**
 * filePathToBuffer Tests
 */
test('filePathToBuffer works with remote and local filepath', async () => {
  const localFilePath = CAT_PATH;
  const remoteFilePath =
    'https://images.unsplash.com/photo-1461988320302-91bde64fc8e4?ixid=2yJhcHBfaWQiOjEyMDd9&&fm=jpg&w=400&fit=max';

  const localFilePathBuffer = await filePathToBuffer({
    filePath: localFilePath,
  });

  mockedAxios.get.mockResolvedValue({ data: Buffer.alloc(10, 1) });
  const remoteFilePathBuffer = await filePathToBuffer({
    filePath: remoteFilePath,
  });

  expect(localFilePathBuffer.byteLength).toBeGreaterThan(1);
  expect(remoteFilePathBuffer.byteLength).toBeGreaterThan(1);
});
