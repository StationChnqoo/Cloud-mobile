import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Modal as RNModal,
  TouchableWithoutFeedback,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export interface ModalProps {
  isVisible: boolean;
  children: React.ReactNode;
  onBackdropPress?: () => void;
  onBackButtonPress?: () => void;
  backdropOpacity?: number;
  style?: any;
}

const Modal: React.FC<ModalProps> = ({
  isVisible = false,
  children,
  onBackdropPress,
  onBackButtonPress,
  backdropOpacity = 0.2,
  style,
}) => {
  const [visible, setVisible] = useState(isVisible);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    setVisible(isVisible);
  }, [isVisible]);

  const handleBackdropPress = () => {
    if (onBackdropPress) {
      onBackdropPress();
    }
  };

  return (
    <RNModal
      visible={visible}
      transparent={true}
      animationType='fade'
      onRequestClose={onBackButtonPress}
    >
      <TouchableWithoutFeedback onPress={handleBackdropPress}>
        <View style={[styles.backdrop, {opacity: backdropOpacity}]} />
      </TouchableWithoutFeedback>
      <View style={[styles.container, style]}>
        <TouchableWithoutFeedback onPress={() => {}}>
          <View style={[styles.content]}>
            {children}
          </View>
        </TouchableWithoutFeedback>
      </View>
    </RNModal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'black',
  },
  container: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  content: {
    backgroundColor: '#fff',
  },
});

export default Modal;
