import {NativeModules, Platform} from 'react-native';

interface KeyboardModuleInterface {
  setSoftInputMode: (mode: 'adjustResize' | 'adjustPan' | 'adjustNothing') => void;
  getSoftInputMode: () => Promise<string>;
}

const {KeyboardModule} = NativeModules;

export const setKeyboardMode = (mode: 'adjustResize' | 'adjustPan' | 'adjustNothing') => {
  if (Platform.OS === 'android' && KeyboardModule) {
    KeyboardModule.setSoftInputMode(mode);
  }
};

export const getKeyboardMode = async (): Promise<string> => {
  if (Platform.OS === 'android' && KeyboardModule) {
    return await KeyboardModule.getSoftInputMode();
  }
  return 'unspecified';
};
