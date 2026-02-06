import Modal from '@src/components/Modal';
import React from 'react';
import {StyleSheet, View} from 'react-native';

interface MyProps {
  children: React.ReactNode;
  show: boolean;
  onClose: () => void;
  onShow?: () => void;
  onHide?: () => void;
}
const BottomSheet: React.FC<MyProps> = props => {
  const {children, show, onClose, onHide, onShow} = props;

  return (
    <Modal
      isVisible={show}
      onBackdropPress={onClose}
      onBackButtonPress={onClose}
      onShow={onShow}
      onModalHide={onHide}
      animationIn={'slideInUp'}
      animationOut={'slideOutDown'}
      hideModalContentWhileAnimating={false}
      animationInTiming={300}
      animationOutTiming={300}
      style={{
        padding: 0,
        justifyContent: 'flex-end',
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
