import { hex2Rgba } from '@src/constants/u';
import React from 'react';
import {ActivityIndicator, StyleSheet, Text, View} from 'react-native';
import Modal from 'react-native-modal';

interface MyProps {
  visible: boolean;
  text: string;
}

const Spinner: React.FC<MyProps> = props => {
  const {visible, text} = props;

  return (
    <Modal style={styles.view} isVisible={visible}>
      <ActivityIndicator size={'large'} color={'#fff'} />
      <View style={{height: 32}} />
      <Text style={{color: '#fff', fontSize: 14}}>{text}</Text>
    </Modal>
  );
};

const styles = StyleSheet.create({
  view: {
    justifyContent: 'center',
    alignItems: 'center',
    margin: 0,
    padding: 0,
    flex: 1,
    backgroundColor: hex2Rgba('#666666', 0.1),
  },
  text: {
    fontSize: 14,
  },
});

export default Spinner;
