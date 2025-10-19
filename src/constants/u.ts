import {Dimensions} from 'react-native';
import Toast from 'react-native-simple-toast';

export const toast = (s: string) => {
  Toast.showWithGravityAndOffset(
    s,
    // '[Privacy Manifest Aggregation] Appending aggregated reasons to existing PrivacyInfo.xcprivacy file.',
    Toast.SHORT,
    1,
    0,
    Dimensions.get('screen').height * 0.618,
  );
};
