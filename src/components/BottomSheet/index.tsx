import Modal from '@src/components/Modal';
import React from 'react';
import {StyleSheet, View} from 'react-native';
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
      backdropOpacity={0.2}
      style={{
        padding: 0,
        ...styles.view,
      }}>
      <View>{children}</View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  view: {},
});

export default BottomSheet;
