import Flex from '@src/components/Flex';
import PreloadImage from '@src/components/PreloadImage';
import ZDView from '@src/components/ZdView';

import {StandardStock} from '@src/constants/t';
import { renderUpOrDown } from '@src/constants/u';

import React, {memo} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import dayjs from 'dayjs';
import { Fonts } from '@src/constants/c';

interface MyProps {
  item: StandardStock;
  onPress: (ss: StandardStock) => void;
}

const CommonStockCard: React.FC<MyProps> = memo(props => {
  const {onPress, item} = props;
  const zdf = typeof item?.zdf == 'number' ? item.zdf : 0;

  return (
    <View style={{position: 'relative', ...styles.view}}>
      <TouchableOpacity
        activeOpacity={0.8}
        style={{paddingHorizontal: 0}}
        onPress={() => {
          onPress(item);
        }}>
        <Flex horizontal justify={'space-between'} align={'flex-end'}>
          <ZDView value={zdf} style={{flex: 1, padding: 4, borderRadius: 4}}>
            <View style={{justifyContent: 'space-between'}}>
              <Text
                style={{
                  fontSize: 14,
                  color: '#333',
                  fontWeight: '500',
                }}
                numberOfLines={1}>
                {`${item.code} | ${item.name}`}
              </Text>
              <View style={{height: 5}} />
              <Text style={{color: '#999', fontSize: 12}}>
                {`${dayjs(item.updateTime)
                  .fromNow()
                  .replace(' ', '')} | ${dayjs(item.updateTime).format(
                  'YYYY/MM/DD HH:mm',
                )}`}
              </Text>
              <View style={{height: 10}} />
              <Flex horizontal justify={'space-between'} align={'baseline'}>
                <Text
                  style={{
                      fontFamily: Fonts.Digital,
                    fontSize: 36,
                    color: renderUpOrDown(zdf).color,
                  }}>
                  {typeof item?.currentPrice == 'number'
                    ? item.currentPrice.toFixed(2)
                    : '--'}
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    color: renderUpOrDown(zdf).color,
                  }}>
                  {zdf.toFixed(2)}%{renderUpOrDown(zdf).label}
                </Text>
              </Flex>
            </View>
          </ZDView>
          <View style={{width: 5}} />
          <PreloadImage
            uri={`https://webquotepic.eastmoney.com/GetPic.aspx?nid=${
              item.market
            }.${item.code}&imageType=RTOPSH&_${Math.ceil(
              new Date().getTime() / 10000,
            )}`}
            style={{height: 68, width: 122}}
          />
        </Flex>
      </TouchableOpacity>
    </View>
  );
});

const styles = StyleSheet.create({
  view: {
    backgroundColor: 'white',
    // borderRadius: 12,
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

export default CommonStockCard;
