import {useCaches} from '@src/constants/store';
import React from 'react';
import {
  Image,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';

interface MyProps {
  checked: boolean;
  size?: number;
}

const Radio: React.FC<MyProps> = props => {
  const {checked, size = 16} = props;
  const {theme} = useCaches();

  return (
    <Image
      key={`${checked}`}
      source={
        checked
          ? require('./assets/checked.png')
          : require('./assets/unchecked.png')
      }
      style={{height: size, width: size, tintColor: checked ? theme : '#999'}}
    />
  );
};

const styles = StyleSheet.create({
  view: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 14,
  },
});

export default Radio;
