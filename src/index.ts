import { InputImage } from './types';

interface IImageProcessing {
  /**
   * Either a local file path, or a Buffer
   */
  inputImage: InputImage;
}
const imageProcessing = ({ inputImage }: IImageProcessing) => {
  /**
   * * convert inputImage to buffer. local filepath, remote filepath or buffer.
   *
   * * Save image to cache
   *
   * * Save image to specified folder
   *
   * * return
   */
};

interface IProcessImage {
  width?: number;
  height?: number;
  format: 'webp' | 'jpg' | 'png';
}
// return the processed buffer thing to be saved in another function
const processImage = () => {};

interface ISaveImage {}
const saveImage = () => {};
export default imageProcessing;
