import {Dimensions, Platform, ToastAndroid} from 'react-native';
import {NativeModules} from 'react-native';

const {Toast} = NativeModules;

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
  let label = n > 0 ? '↗' : n < 0 ? '↘' : '';
  let color = n > 0 ? '#f20c00' : n < 0 ? '#0c8918' : 'gray';
  return {label, color};
};

export const hex2Rgba = (hex: string, alpha: number) => {
  return `rgba(${parseInt(hex.slice(1, 3), 16)}, ${parseInt(
    hex.slice(3, 5),
    16,
  )}, ${parseInt(hex.slice(5, 7), 16)}, ${alpha})`;
};
