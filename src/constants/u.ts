import {Dimensions, Platform, ToastAndroid} from 'react-native';
import {NativeModules} from 'react-native';

const {Toast} = NativeModules;
const {width} = Dimensions.get('window');

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

export const getFile = (image: PicGoSrc): PicGoFile => {
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

export const toast = (s: string) => {
  switch (Platform.OS) {
    case 'android':
      ToastAndroid.show(s, ToastAndroid.SHORT);
      break;
    case 'ios':
      Toast.show(s, 1);
      break;
    default:
      break;
  }
};

export const renderUpOrDown = (n: number) => {
  let label = n > 0 ? '↑' : n < 0 ? '↓' : '';
  let color = n > 0 ? '#f20c00' : n < 0 ? '#0c8918' : 'gray';
  return {label, color};
};

export const hex2Rgba = (hex: string, alpha: number) => {
  return `rgba(${parseInt(hex.slice(1, 3), 16)}, ${parseInt(
    hex.slice(3, 5),
    16,
  )}, ${parseInt(hex.slice(5, 7), 16)}, ${alpha})`;
};

export function fs(size: number) {
  if (width >= 430) return size + 2;   // iPhone12 Plus/Pro Max
  if (width >= 390) return size + 1;   // iPhone12/Pro
  return size;                         // SE
}

export const dip2px = (dip: number) => {
  const scale = Dimensions.get('window').width / 375;
  return Math.round(dip * scale);
};

export const links = {
  previewPdf: (url: string) =>
    `https://mozilla.github.io/pdf.js/web/viewer.html?file=${url}`,
  stockDetail: (code: string) =>
    `https://wap.eastmoney.com/quote/stock/${code}.html`,
  fundDetail: (code: string) =>
    `https://h5.1234567.com.cn/app/fund-details/?fCode=${code}`,
  /**
   * 走势曲线
   * @param code 0.799050
   * @returns
   */
  previewStockChart: (code: string, imageType?: string) =>
    `https://webquotepic.eastmoney.com/GetPic.aspx?imageType=${
      imageType || ''
    }&type=&nid=${code}&_${new Date().getTime()}`,
};
