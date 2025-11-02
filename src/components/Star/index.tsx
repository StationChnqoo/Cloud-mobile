import {useCaches} from '@src/stores';
import React from 'react';
import {Image, StyleSheet, TouchableOpacity} from 'react-native';
import Flex from '../Flex';

interface MyProps {
  value: number;
  onPress: (value: number) => void;
}

const Star: React.FC<MyProps> = props => {
  const {value, onPress} = props;
  const {theme} = useCaches();

  return (
    <Flex horizontal style={{gap: 4}} justify={'flex-start'}>
      {Array.from({length: 5}, (_, i) => (
        <TouchableOpacity
          activeOpacity={0.8}
          key={i}
          onPress={() => {
            onPress(i + 1);
          }}>
          {i < value ? (
            <Image
              source={require('./assets/checked.png')}
              style={{height: 16, width: 16, tintColor: theme}}
            />
          ) : (
            <Image
              source={require('./assets/unchecked.png')}
              style={{height: 16, width: 16, tintColor: '#ccc'}}
            />
          )}
        </TouchableOpacity>
      ))}
    </Flex>
  );
};

const styles = StyleSheet.create({});

export default Star;
