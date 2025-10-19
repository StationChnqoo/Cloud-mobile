import React, {useEffect, useRef} from 'react';
import {StyleSheet} from 'react-native';
import {Modalize} from 'react-native-modalize';
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
  const modalizeRef = useRef<Modalize>(null);

  useEffect(() => {
    if (show) {
      modalizeRef.current?.open();
    } else {
      modalizeRef.current?.close();
    }
  }, [show]);
  return (
    <Modalize
      ref={modalizeRef}
      // animationInTiming={618}
      // animationOutTiming={618 * 2}
      onClose={onClose}
      onOpened={onShow}
      onClosed={onHide}
      adjustToContentHeight={true}
      closeOnOverlayTap={true}
      handlePosition="inside"
      panGestureComponentEnabled={false}
      panGestureEnabled={false}
      modalStyle={{
        marginHorizontal: 12,
        marginBottom: useSafeAreaInsets().bottom + 12,
        padding: 0,
        justifyContent: 'flex-end',
        ...styles.view
      }}>
      {children}
      {/* <View style={{height: useSafeAreaInsets().bottom}} /> */}
    </Modalize>
  );
};

const styles = StyleSheet.create({
  view: {
    borderRadius: 12,
    backgroundColor: 'white',
  },
});

export default BottomSheet;
