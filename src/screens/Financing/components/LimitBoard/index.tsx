import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
// import {BarChart} from 'react-native-charts-wrapper';
import Flex from '@src/components/Flex';
import {BoardItem} from '@src/constants/t';
import {useCaches} from '@src/stores';

interface MyProps {
  datas: BoardItem[];
  onPress?: () => void;
}

const LimitBoard: React.FC<MyProps> = props => {
  const {datas, onPress} = props;
  const {theme} = useCaches();

  useEffect(() => {
    console.log('BoomBoard: ', datas);
    return function () {};
  }, [datas]);

  return (
    <TouchableOpacity style={styles.view} activeOpacity={0.8} onPress={onPress}>
      <Flex
        horizontal
        justify={'space-between'}
        style={{
          position: 'relative',
        }}>
        <Text style={styles.textTitle}>涨跌停</Text>
        <Text style={{fontSize: 14, color: '#999'}}>
          {`${datas?.length || 0}`}家炸板
        </Text>
      </Flex>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  view: {
    backgroundColor: 'white',
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginBottom: 1,
  },
  viewCounts: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  viewProgressBar: {
    height: 4,
    borderRadius: 2,
    marginHorizontal: 2,
  },
  textTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
});

export default LimitBoard;
