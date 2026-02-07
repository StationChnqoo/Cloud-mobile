import React, {useState, useEffect} from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  View,
  Keyboard,
} from 'react-native';
import Modal from '@src/components/Modal';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

interface MyProps {
  children: React.ReactNode;
  show: boolean;
  onClose: () => void;
  onShow?: () => void;
  onHide?: () => void;
}
const BottomSheet: React.FC<MyProps> = props => {
  const {children, show, onClose, onHide, onShow} = props;
  const insets = useSafeAreaInsets();

  return (
    <Modal
      isVisible={show}
      onBackdropPress={onClose}
      onBackButtonPress={onClose}
      onShow={onShow}
      onModalHide={onHide}
      animationIn="slideInUp"
      animationOut="slideOutDown"
      backdropOpacity={0.2}
      style={{
        padding: 0,
        ...styles.view,
      }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={0}
        style={{flex: 1, justifyContent: 'flex-end'}}>
        <View>{children}</View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  view: {},
});

export default BottomSheet;
