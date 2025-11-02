import React, {useEffect, useState} from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
// import {BarChart} from 'react-native-charts-wrapper';
import {RealTimePrice} from '@src/constants/t';
import ETFDetailModal from '../ETFDetailModal';
import Flex from '@src/components/Flex';
import {useCaches} from '@src/stores';

interface MyProps {
  datas: RealTimePrice[];
}

const ETF: React.FC<MyProps> = props => {
  const {datas} = props;
  const {theme} = useCaches();
  const [isShowDetailModal, setIsShowDetailModal] = useState(false);

  const [average, setAverage] = useState(0);
  const [usefulDatas, setUsefulDatas] = useState([]);

  useEffect(() => {
    let sum = 0;
    let _datas = [...datas].filter(it => typeof it?.f170 == 'number');
    for (let i = 0; i < _datas.length; i++) {
      sum += _datas[i]?.f170;
    }
    if (_datas.length > 0) {
      setAverage(sum / _datas.length);
    }
    setUsefulDatas(_datas);
    return function () {};
  }, [datas]);

  return (
    <View style={styles.view}>
      <Flex
        horizontal
        justify={'space-between'}
        style={{
          position: 'relative',
        }}>
        <Text style={styles.textTitle}>债券</Text>
        {/* <Image
          source={require('@src/assets/images/other/vip_year_card.png')}
          style={{height: 24, width: 40}}
        /> */}
        <View style={{height: 4}} />
        <Text
          style={{fontSize: 12, color: '#999'}}>{`估算均值 | ${average.toFixed(
          2,
        )}%`}</Text>
        <Text
          style={{
            fontSize: 12,
            color: '#999',
          }}>{`有效数据 | ${usefulDatas.length} / ${datas.length}`}</Text>
        <TouchableOpacity
          // style={{position: 'absolute', right: 0, top: 0}}
          onPress={() => {
            setIsShowDetailModal(!isShowDetailModal);
          }}
          activeOpacity={0.8}
          hitSlop={6}>
          <Image
            source={require('../../assets/info.png')}
            style={{
              height: 16,
              width: 16,
              tintColor: '#999',
            }}
          />
        </TouchableOpacity>
      </Flex>
      <ETFDetailModal
        show={isShowDetailModal}
        datas={datas}
        onClosePress={() => {
          setIsShowDetailModal(!isShowDetailModal);
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  view: {
    backgroundColor: 'white',
    paddingVertical: 10,
    paddingHorizontal: 16,
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

export default ETF;
