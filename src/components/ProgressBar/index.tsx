import { useCaches } from '@src/constants/store';
import React from 'react';
import {StyleSheet, View} from 'react-native';

interface MyProps {
  progress: number;
  height?: number;
  activeColor?: string;
  inactiveColor?: string;
}

const ProgressBar: React.FC<MyProps> = props => {
  const {progress, height = 2, activeColor, inactiveColor = '#ccc'} = props;
  const {theme} = useCaches();
  return (
    <View style={{}}>
      <View
        style={{
          flex: progress * 100,
          backgroundColor: activeColor || theme,
          height,
        }}
      />
      <View
        style={[
          {height},
          {flex: (1 - progress) * 100},
          {backgroundColor: inactiveColor},
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({});

export default ProgressBar;
