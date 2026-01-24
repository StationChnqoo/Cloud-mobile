import Flex from '@src/components/Flex';
import {RealtimeCount} from '@src/constants/t';
import {renderUpOrDown} from '@src/constants/u';
import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';

interface MyProps {
  diff: RealtimeCount[];
}

const Counts: React.FC<MyProps> = props => {
  const {diff} = props;
  const [datas, setDatas] = useState(Array(3).fill(1));
  const [sum, setSum] = useState(1);

  useEffect(() => {
    if (diff.length > 0) {
      let _datas = [
        diff[0].f104 + diff[1].f104,
        diff[0].f105 + diff[1].f105,
        diff[0].f106 + diff[1].f106,
      ];
      setDatas(_datas);
      setSum(_datas.reduce((count, it) => count + it) || 1);
    }
    return function () {};
  }, [diff]);

  const myPercent = (n: number) => n / sum;

  return (
    <View style={styles.view}>
      <View style={styles.viewCounts}>
        {datas.map((it, index) => (
          <Text
            key={index}
            style={{
              fontSize: 14,
              color: ['red', 'green', 'gray'][index],
            }}>{`${it}家${['↑', '↓', ''][index]} ${myPercent(it * 100).toFixed(
            2,
          )}%`}</Text>
        ))}
      </View>
      <View style={{height: 10}} />
      <Flex style={{flexDirection: 'row', alignItems: 'center', gap: 1}}>
        {datas.map((it, index) => (
          <View
            key={index}
            style={[
              styles.viewProgressBar,
              {
                backgroundColor: ['red', 'green', 'gray'][index],
                flex: myPercent(it || 1),
              },
            ]}
          />
        ))}
      </Flex>
    </View>
  );
};

const styles = StyleSheet.create({
  view: {
    backgroundColor: 'white',
    // borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginBottom: 1,
    // marginHorizontal: '3%',
    // borderRadius: 12,
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
});

export default Counts;
