import {useIsFocused} from '@react-navigation/native';
import {RealTimePrice} from '@src/constants/t';
import DfcfService from '@src/services/DfcfService';
import {useCaches} from '@src/stores';
import {useQueries, useQuery} from '@tanstack/react-query';
import React, {useMemo} from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';

import {RootStacksProp} from '..';
import Care from './components/Care';
import ContinuedTrading from './components/ContinuedTrading';
import Counts from './components/Counts';
import ETF from './components/ETF';
import Global from './components/Global';
import News from './components/News';
import Ranks from './components/Ranks';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface MyProps {
  navigation?: RootStacksProp;
}

const Financing: React.FC<MyProps> = props => {
  const {navigation} = props;
  const {cared, global} = useCaches();
  const focused = useIsFocused();
  const insets = useSafeAreaInsets();

  const countsQuery = useQuery({
    enabled: focused,
    queryKey: ['countsQuery'],
    queryFn: () => new DfcfService().selectDfcfFundCounts(),
    refetchInterval: 10000,
  });

  const quickNewsQuery = useQuery({
    enabled: focused,
    queryKey: ['quickNewsQuery'],
    queryFn: () => new DfcfService().selectQuickNews(),
    refetchInterval: 10000,
  });

  const etfQuery = useQueries({
    queries: [
      '0.159649', // 国开债ETF
      '0.159972', // 5年地债ETF
      '1.511010', // 国债ETF
      '1.511020', // 活跃国债ETF
      '1.511030', // 公司债ETF
      '1.511060', // 5年地方债ETF
      '1.511090', // 30年国债ETF
      '1.511100', // 基准国债ETF
      '1.511220', // 城投债ETF
      '1.511260', // 十年国债ETF
      '1.511270', // 十年地方债ETF
      '1.511130', // 30年国债指数ETF
    ].map(it => ({
      queryKey: ['etfQuery', it],
      queryFn: () => new DfcfService().selectRealtimePrice(it),
      enabled: focused,
      refetchInterval: 10000,
      placeholderData: {data: {datas: []}},
    })),
  });

  const caredQueries = useQueries<RealTimePrice[]>({
    queries: cared.map(it => ({
      enabled: focused,
      queryKey: ['caredQuery', it],
      refetchInterval: 10000,
      queryFn: () => new DfcfService().selectRealtimePrice(it),
    })),
  });

  const ranksQuery = useQuery({
    queryKey: ['ranksQuery'],
    enabled: focused,
    refetchInterval: 10000,
    queryFn: () => new DfcfService().selectFundRanks(),
    placeholderData: {data: {diff: []}},
  });

  // console.log('ranksQuery: ', ranksQuery)

  const globalQueries = useQueries<RealTimePrice[]>({
    queries: global.map(it => ({
      enabled: focused,
      queryKey: ['globalQueries', it],
      refetchInterval: 10000,
      queryFn: () => new DfcfService().selectRealtimePrice(it),
      placeholderData: [],
    })),
  });

  // console.log('ranksQuery: ', ranksQuery.data.data.diff);
  const toStockDetail = (code: string) => {
    navigation.navigate('Webviewer', {
      title: code,
      url: `https://quote.eastmoney.com/sz${code}.html`,
    });
  };

  return (
    <View style={{flex: 1, backgroundColor: '#f0f0f0', position: 'relative'}}>
      <View style={{height: insets.top, backgroundColor: '#fff'}} /> 
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        bounces={false}
        removeClippedSubviews={false}>
        <View style={{}}>
          {/* <View style={{height: 4}} /> */}
          {[
            <ContinuedTrading
              onPress={fd => toStockDetail(`${fd.f107}.${fd.f57}`)}
            />,
            <Counts diff={countsQuery.data?.data?.diff || []} />,
            <ETF
              datas={etfQuery
                .filter(it => it.isFetched)
                .map(it => it.data?.data)}
            />,
            <Global
              datas={globalQueries
                .filter(it => it.isFetched)
                .map(it => (it.data as any)?.data)
                .filter((it): it is RealTimePrice => it !== undefined)}
              onPress={fd => toStockDetail(`${fd.f107}.${fd.f57}`)}
            />,

            <Care
              datas={caredQueries
                .filter(it => it.isFetched)
                .map(it => (it.data as any)?.data)
                .filter((it): it is RealTimePrice => it !== undefined)}
              onPress={ss => toStockDetail(`${ss.market}.${ss.code}`)}
            />,
            <Ranks
              diff={ranksQuery.data?.data?.diff || []}
              onPress={item => {
                // log.debug('Ranks onPress: ', item);
                navigation.navigate('SectorStocks', {
                  code: item.f12,
                  name: item.f14,
                });
              }}
            />,
            <News
              datas={quickNewsQuery.data?.data || []}
              onPress={news => {
                navigation.navigate('Webviewer', {
                  title: news.title,
                  url: news.url.replace('http://', 'https://'),
                });
              }}
            />,
          ].map((it, i) => (
            <View key={i} style={{marginBottom: 1}}>
              {it}
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({});

export default Financing;
