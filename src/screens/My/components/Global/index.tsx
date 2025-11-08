import React from 'react';
import {
  Image,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import Card from '../Card';
import {useCaches} from '@src/stores';
import {RootStacksProp} from '@src/screens';
import Flex from '@src/components/Flex';

interface MyProps {
  navigation?: RootStacksProp;
  onPress: () => void;
}

const Global: React.FC<MyProps> = props => {
  const {global} = useCaches();
  const {onPress} = props;

  return (
    <Card title={'自选指数'}>
      <View style={{height: 6}} />

      <TouchableOpacity style={{}} onPress={onPress} activeOpacity={0.8}>
        <Flex horizontal justify="space-between">
          <Text
            style={{
              fontSize: 14,
              color: '#333',
            }}>{`已选${global.length}个指数`}</Text>
          <Image
            source={require('@src/assets/images/common/arrow_right.png')}
            style={{height: 16, width: 16, tintColor: '#999'}}
          />
        </Flex>
      </TouchableOpacity>
    </Card>
  );
};

const styles = StyleSheet.create({});

export default Global;
