import {
  Breakpoint as BreakpointType,
  InputImage as InputImageType,
} from './types';
import { LqipOptions as LqipOptionsType } from './processingPrimitives';
import { ProcessedImage as ProcessedImageType } from './processImage';

export { default } from './processImage';
export { MimeType } from './types';
export { generateLqip, getAspectRatio } from './processingPrimitives';
export {
  filePathToBuffer,
  generateSrcSet,
  getMimeType,
  getBasename,
  getExtension,
  getHash,
  generateSizes,
  generateImageWidths,
} from './utils';

export type ProcessedImage = ProcessedImageType;
export type LqipOptions = LqipOptionsType;
export type Breakpoint = BreakpointType;
export type InputImage = InputImageType;

// export { LqipOptions, Breakpoint, InputImage, MimeType }
