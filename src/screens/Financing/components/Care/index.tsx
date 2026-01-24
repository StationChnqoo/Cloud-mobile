import CommonStockCard from '@src/components/CommonStockCard';
import {useCaches} from '@src/stores';
import {RealTimePrice, StandardStock} from '@src/constants/t';
import React, {memo} from 'react';
import {ActivityIndicator, StyleSheet, View} from 'react-native';

interface MyProps {
  datas: RealTimePrice[];
  onPress: (ss: StandardStock) => void;
}

const Care: React.FC<MyProps> = memo(props => {
  const {datas, onPress} = props;
  const {theme} = useCaches();

  return (
    <View style={{position: 'relative', ...styles.view}}>
      <View style={{}}>
        {datas.length == 0 ? (
          <ActivityIndicator color={theme} />
        ) : (
          datas.map((it, i) => (
            <CommonStockCard
              key={i}
              item={{
                code: it.f57,
                name: it.f58,
                zdf: it.f170 / 100,
                currentPrice: it.f43 / Math.pow(10, it.f59),
                market: it.f107,
                updateTime: it.f86 * 1000,
              }}
              onPress={onPress}
            />
          ))
        )}
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  view: {
    backgroundColor: 'white',
    // borderRadius: 12,
    paddingHorizontal: 12,
    marginBottom: 1,
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
  dots: {
    position: 'absolute',
    right: 0,
    top: 0,
    // borderRadius: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.58)',
    justifyContent: 'center',
    alignItems: 'center',
    borderTopRightRadius: 10,
    borderBottomLeftRadius: 10,
    height: 20,
    width: 36,
  },
});

export default Care;
