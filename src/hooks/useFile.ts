import {PicGoSrc} from '@src/constants/t';
import {ImageRequireSource, ImageURISource} from 'react-native';

export enum PicGoFileType {
  Image = 'Image',
  Video = 'Video',
  Other = 'Other',
}

interface PicGoFile {
  type: PicGoFileType;
  src: ImageRequireSource | ImageURISource;
}

const getFile = (image: PicGoSrc): PicGoFile => {
  if (image.mimeType?.startsWith('image')) {
    return {
      type: PicGoFileType.Image,
      src: {uri: image.url},
    };
  } else if (image.mimeType?.startsWith('video')) {
    return {
      type: PicGoFileType.Video,
      src: require('@src/assets/images/common/file_video.png'),
    };
  }
  return {
    type: PicGoFileType.Other,
    src: require('@src/assets/images/common/file_other.png'),
  };
};

export default getFile;
