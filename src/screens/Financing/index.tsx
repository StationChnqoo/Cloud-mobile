import {useIsFocused} from '@react-navigation/native';
import {RealTimePrice} from '@src/constants/t';
import DfcfService from '@src/services/DfcfService';
import {useCaches} from '@src/stores';
import {useQueries, useQuery} from '@tanstack/react-query';
import React from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';

import {RefreshInterval} from '@src/constants/config';
import {links} from '@src/constants/u';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {RootStacksProp} from '..';
import Care from './components/Care';
import ContinuedTrading from './components/ContinuedTrading';
import Counts from './components/Counts';
import Global from './components/Global';
import News from './components/News';
import Ranks from './components/Ranks';
import LimitBoard from './components/LimitBoard';

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
    refetchInterval: RefreshInterval,
  });

  const quickNewsQuery = useQuery({
    enabled: focused,
    queryKey: ['quickNewsQuery'],
    queryFn: () => new DfcfService().selectQuickNews(),
    refetchInterval: RefreshInterval,
  });

  const boomBoardQuery = useQuery({
    enabled: focused,
    queryKey: ['boomBoardQuery'],
    queryFn: () => new DfcfService().selectBoomBoards(),
    refetchInterval: RefreshInterval,
  });

  const caredQueries = useQueries<RealTimePrice[]>({
    queries: cared.map(it => ({
      enabled: focused,
      queryKey: ['caredQuery', it],
      refetchInterval: RefreshInterval,
      queryFn: () => new DfcfService().selectRealtimePrice(it),
    })),
  });

  const ranksQuery = useQuery({
    queryKey: ['ranksQuery'],
    enabled: focused,
    refetchInterval: RefreshInterval,
    queryFn: () => new DfcfService().selectFundRanks(),
    placeholderData: {data: {diff: []}},
  });

  // console.log('ranksQuery: ', ranksQuery)

  const globalQueries = useQueries<RealTimePrice[]>({
    queries: global.map(it => ({
      enabled: focused,
      queryKey: ['globalQueries', it],
      refetchInterval: RefreshInterval,
      queryFn: () => new DfcfService().selectRealtimePrice(it),
      placeholderData: [],
    })),
  });

  // console.log('ranksQuery: ', ranksQuery.data.data.diff);
  const toStockDetail = (code: string) => {
    if (code == '100.VNINDEX') {
      navigation.navigate('VnFundDetail');
    } else {
      navigation.navigate('Webviewer', {
        title: code,
        url: links.stockDetail(code),
      });
    }
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
          <ContinuedTrading
            onPress={fd => toStockDetail(`${fd.f107}.${fd.f57}`)}
          />
          <Counts diff={countsQuery.data?.data?.diff || []} />
          <LimitBoard
            datas={boomBoardQuery.data?.data?.pool}
            onPress={() => {
              navigation.navigate('BoomBoards');
            }}
          />
          <Global
            datas={globalQueries
              .filter(it => it.isFetched)
              .map(it => (it.data as any)?.data)
              .filter((it): it is RealTimePrice => it !== undefined)}
            onPress={fd => toStockDetail(`${fd.f107}.${fd.f57}`)}
          />
          <Care
            datas={caredQueries
              .filter(it => it.isFetched)
              .map(it => (it.data as any)?.data)
              .filter((it): it is RealTimePrice => it !== undefined)}
            onPress={ss => toStockDetail(`${ss.market}.${ss.code}`)}
          />
          <Ranks
            diff={ranksQuery.data?.data?.diff || []}
            onPress={item => {
              // log.debug('Ranks onPress: ', item);
              navigation.navigate('SectorStocks', {
                code: item.f12,
                name: item.f14,
              });
            }}
          />
          <News
            datas={quickNewsQuery.data?.data || []}
            onPress={news => {
              navigation.navigate('Webviewer', {
                title: news.title,
                url: news.url.replace('http://', 'https://'),
              });
            }}
          />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({});

export default Financing;
