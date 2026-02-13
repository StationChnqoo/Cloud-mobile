import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Modal as RNModal,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export interface ModalProps {
  visible: boolean;
  children: React.ReactNode;
  onBackdropPress?: () => void;
  onBackButtonPress?: () => void;
  backdropOpacity?: number;
  style?: any;
  onShow?: () => void;
  onDismiss?: () => void;
}

/**
 * KeyboardAvoidingView -> 如果不用他包裹，iOS键盘就把Modal盖住了
 * animationType -> slide会把黑色遮罩一起从底部顶上去
 * @param param0 
 * @returns 
 */
const Modal: React.FC<ModalProps> = ({
  visible = false,
  children,
  onBackdropPress,
  onBackButtonPress,
  backdropOpacity = 0.2,
  style,
  onShow,
  onDismiss
}) => {
  const insets = useSafeAreaInsets();

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
      onShow={onShow}
      onDismiss={onDismiss}
    >
      <TouchableWithoutFeedback onPress={handleBackdropPress}>
        <View style={[styles.backdrop, {opacity: backdropOpacity}]} />
      </TouchableWithoutFeedback>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={[styles.container, style]}
      >
        <TouchableWithoutFeedback onPress={() => {}}>
          <View style={[styles.content]}>
            {children}
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
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
