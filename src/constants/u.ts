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
