import {PicGoSrc} from '@src/constants/t';
import {useEffect, useState} from 'react';
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

const useFile = (image: PicGoSrc) => {
  let file: PicGoFile = {
    type: PicGoFileType.Image,
    src: {uri: image.url},
  };
  if (image.mimeType?.startsWith('image')) {
    file = {
      type: PicGoFileType.Image,
      src: {uri: image.url},
    };
  } else if (image.mimeType?.startsWith('video')) {
    file = {
      type: PicGoFileType.Video,
      src: require('@src/assets/images/common/file_video.png'),
    };
  } else {
    file = {
      type: PicGoFileType.Other,
      src: require('@src/assets/images/common/file_other.png'),
    };
  }
  return {file};
};

export default useFile;
