import React, {useEffect, useRef} from 'react';
import {StyleSheet, View} from 'react-native';
import Modal from 'react-native-modal';
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
      // animationInTiming={618}
      // animationOutTiming={618 * 2}
      isVisible={show}
      onBackdropPress={onClose}
      onBackButtonPress={onClose}
      onShow={onShow}
      onModalHide={onHide}
      animationIn={'fadeInUp'}
      animationOut={'fadeOutDown'}
      hideModalContentWhileAnimating={true}
      animationInTiming={100}
      animationOutTiming={100}
      useNativeDriver={false}
      style={{
        marginBottom: insets.bottom + 12,
        padding: 0,
        justifyContent: 'flex-end',
        ...styles.view,
      }}>
      <View>{children}</View>
      {/* <View style={{height: useSafeAreaInsets().bottom}} /> */}
    </Modal>
  );
};

const styles = StyleSheet.create({
  view: {},
});

export default BottomSheet;
