import React from 'react';
import {
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';

interface MyProps {
  title: String;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  disabled?: boolean;
}

const Button: React.FC<MyProps> = props => {
  const {title, onPress, style, textStyle, disabled} = props;
  return (
    <TouchableOpacity
      style={[styles.view, style, disabled ? {backgroundColor: '#ccc'} : {}]}
      activeOpacity={0.9}
      onPress={onPress}
      disabled={disabled}>
      <Text style={[styles.text, textStyle]}>{title}</Text>
    </TouchableOpacity>
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

export default Button;
