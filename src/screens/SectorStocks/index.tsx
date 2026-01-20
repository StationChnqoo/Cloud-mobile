import React, {useState} from 'react';
import {
  Dimensions,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import {RouteProp} from '@react-navigation/native';
import CommonStockCard from '@src/components/CommonStockCard';
import PreloadImage from '@src/components/PreloadImage';
import ToolBar from '@src/components/ToolBar';
import DfcfService from '@src/services/DfcfService';
import {useCaches} from '@src/stores';
import {useQuery} from '@tanstack/react-query';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {RootStacksParams, RootStacksProp} from '..';

interface MyProps {
  navigation?: RootStacksProp;
  route?: RouteProp<RootStacksParams, 'SectorStocks'>;
}

const SectorStocks: React.FC<MyProps> = props => {
  const {navigation, route} = props;
  const {theme} = useCaches();
  const {code, name} = route.params;
  const insets = useSafeAreaInsets();
  const kTabs = [
    {label: '日K', value: ''},
    {label: '周K', value: 'W'},
    {label: '月K', value: 'M'},
  ];
  const sectorStocksQuery = useQuery({
    queryFn: () => new DfcfService().selectStocksOfSector(code),
    queryKey: ['sectorStocksQuery', code],
    refetchInterval: 10000,
    placeholderData: {data: {diff: []}},
  });
  const [kTab, setKTab] = useState('');
  const {data} = sectorStocksQuery;
  // console.log('sectorStocksQuery: ', data.data.diff);
  const kLineUrl = `https://webquoteklinepic.eastmoney.com/GetPic.aspx?nid=90.${code}&type=${kTab}&unitWidth=-6&ef=&formula=RSI&AT=1&imageType=KXL&timespan=${Math.floor(
    new Date().getTime() / 1000,
  )}`;

  return (
    <View style={{flex: 1, backgroundColor: '#fff'}}>
      <ToolBar
        title={name}
        onBackPress={() => {
          navigation.goBack();
        }}
      />
      <View style={{height: 1, backgroundColor: '#d8d8d8'}} />
      <ScrollView style={{paddingHorizontal: 12}}>
        <PreloadImage
          uri={kLineUrl}
          style={{
            width: Dimensions.get('window').width - 30,
            height: (Dimensions.get('window').width - 30) * 0.72,
          }}
        />
        <View style={{height: 12}} />
        <View style={styles.tabs}>
          {kTabs.map((it, i) => (
            <TouchableOpacity
              key={i}
              activeOpacity={0.8}
              style={{alignItems: 'center'}}
              onPress={() => {
                setKTab(it.value);
              }}>
              <View
                style={[
                  {height: 2, width: 12, borderRadius: 1},
                  {backgroundColor: it.value == kTab ? theme : 'transparent'},
                ]}
              />
              <View style={{height: 2}} />
              <Text
                style={[
                  {fontSize: 14},
                  {color: it.value == kTab ? theme : '#666'},
                ]}>
                {it.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        {(data.data.diff || []).map((it, i) => {
          return (
            <CommonStockCard
              key={i}
              item={{
                code: it.f12,
                name: it.f14,
                zdf: typeof it.f3 == 'number' ? it.f3 : 0,
                currentPrice: it?.f2,
                market: it.f13,
                updateTime: it.f124 * 1000,
              }}
              onPress={() => {}}
            />
          );
        })}
      </ScrollView>
      <View
        style={{
          height: Platform.select({
            ios: insets.bottom,
            android: 10,
          }),
          backgroundColor: '#fff',
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  view: {},
  tabs: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'flex-end',
    paddingHorizontal: 12,
  },
});

export default SectorStocks;
