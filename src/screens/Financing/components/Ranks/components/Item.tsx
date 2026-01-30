import Flex from '@src/components/Flex';
import {useCaches} from '@src/stores';

import {hex2Rgba, renderUpOrDown} from '@src/constants/u';
import React from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

interface MyProps {
  it: any;
  max: number;
  onPress: (item: any) => void;
  onLongPress?: (item: any) => void;
}

const Item: React.FC<MyProps> = props => {
  const {it, onPress, max, onLongPress} = props;
  const {theme, cared} = useCaches();

  return (
    <TouchableOpacity
      activeOpacity={0.88}
      onPress={() => {
        onPress(it);
      }}
      onLongPress={() => {
        onLongPress(it);
      }}>
      <Flex
        style={{
          ...styles.itemContainer,
          backgroundColor: hex2Rgba(
            renderUpOrDown(it.f3).color,
            Math.max(max, 0.28),
          ),
        }}>
        <Text
          style={{
            fontSize: 16,
            color: 'white',
          }}>
          {it.f3}%
        </Text>
        <View style={{height: 4}} />
        <Text style={{fontSize: 12, color: 'white'}} numberOfLines={1}>
          {it.f14}
        </Text>
      </Flex>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    paddingVertical: 6,
    paddingHorizontal: 2,
    width: (Dimensions.get('window').width - 32 - 12) / 4,
    borderRadius: 4,
    // height: (x.WIDTH - 32) / 5 - 2,
  },
});

export default Item;
