import {RouteProp, useIsFocused} from '@react-navigation/native';
import Flex from '@src/components/Flex';
import ToolBar from '@src/components/ToolBar';
import {PaginationProps, TWallet} from '@src/constants/t';
import Services from '@src/services';
import {useCaches} from '@src/stores';
import {useInfiniteQuery, useQueryClient} from '@tanstack/react-query';
import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';
import React, {memo, useEffect} from 'react';
import {
  FlatList,
  Image,
  ListRenderItemInfo,
  Platform,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {RootStacksParams, RootStacksProp} from '..';
import {WalletMaps} from '@src/constants/c';

dayjs.extend(isoWeek);

interface MyProps {
  navigation?: RootStacksProp;
  route?: RouteProp<RootStacksParams, 'Wallets'>;
  onWalletPress?: (item: TWallet) => void;
}

const Wallets: React.FC<MyProps> = memo(props => {
  const {navigation, route, onWalletPress} = props;
  const {theme, token} = useCaches();
  const queryClient = useQueryClient();
  const focused = useIsFocused();
  const logined = useCaches().token ? true : false;

  const loadDatas = async (params: PaginationProps) => {
    let result = await new Services().selectWallets(params);
    return result.data;
  };

  const walletsQuery = useInfiniteQuery({
    initialPageParam: {currentPage: 1},
    queryKey: ['walletsQuery'],
    retryOnMount: false,
    refetchOnMount: false,
    enabled: focused && logined,
    queryFn: params =>
      loadDatas({currentPage: params.pageParam.currentPage, pageSize: 10}),
    getNextPageParam: (lastPage, pages) => {
      return lastPage.hasNextPage
        ? {currentPage: lastPage.currentPage + 1, pageSize: 10}
        : undefined;
    },
  });

  console.log(walletsQuery.data);

  useEffect(() => {
    walletsQuery.refetch();
    return function () {};
  }, [focused]);

  const count = (item: TWallet) => {
    let s: number = Object.keys(WalletMaps).reduce((total, key) => {
      const value = item[key];
      if (Array.isArray(value)) {
        return (
          total +
          value.reduce((sum, item) => {
            return sum + parseFloat(item);
          }, 0)
        );
      } else if (!isNaN(value)) {
        return total + parseFloat(value);
      }
      return total;
    }, 0);
    return s.toFixed(1);
  };

  const loadItem = (info: ListRenderItemInfo<TWallet>) => {
    const {item} = info;
    return (
      <TouchableOpacity
        style={styles.item}
        activeOpacity={0.7}
        onPress={() => {
          onWalletPress(item);
        }}>
        <Flex horizontal justify={'space-between'}>
          <Text style={{fontSize: 16, color: '#333'}}>
            {`${dayjs(item.settleOn).format('YYYY年')}${dayjs(
              item.settleOn,
            ).isoWeek()}周`}
          </Text>
          {/* <Text style={{fontSize: 14, color: '#999'}}>{count(item)}</Text> */}
          <Text style={{color: theme, fontSize: 16}}>{count(item)}K</Text>
        </Flex>
        <View style={{height: 10}} />
        <Flex
          horizontal
          style={{flexWrap: 'wrap', gap: 10}}
          justify={'flex-start'}>
          {Object.keys(WalletMaps).map((it, i) => (
            <Flex horizontal justify="flex-start" key={i}>
              <Text
                style={{
                  fontSize: 14,
                  color: '#333',
                }}>{`${WalletMaps[it]}: `}</Text>
              <Text style={{fontSize: 14, color: '#999'}}>{`${
                Array.isArray(item[it])
                  ? `[${item[it].map(it => `${it}K`).join(' & ')}]`
                  : `${item[it]}K`
              }`}</Text>
            </Flex>
          ))}
        </Flex>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.view}>
      {/* <ToolBar
        onBackPress={() => {
          navigation.goBack();
        }}
        title={'钱包'}
      /> */}
      <FlatList
        ListHeaderComponent={() => <View style={{height: 8}} />}
        refreshControl={
          <RefreshControl
            refreshing={
              walletsQuery.isFetching &&
              walletsQuery.data?.pages?.[0]?.page === 1
            }
            onRefresh={() => {
              queryClient.resetQueries({queryKey: ['walletsQuery']});
              walletsQuery.refetch();
            }}
          />
        }
        data={walletsQuery.data?.pages.map(it => it.records).flat() || []}
        onEndReached={() => {
          walletsQuery.fetchNextPage();
        }}
        renderItem={loadItem}
        keyExtractor={(it, i) => `${it.id}:${i}`}
        onEndReachedThreshold={0.2}
        removeClippedSubviews={false}
        ItemSeparatorComponent={() => <View style={{height: 5}} />}
        ListEmptyComponent={
          <Flex>
            <Image
              source={require('@src/assets/images/empty/wallet.png')}
              style={{height: 128, width: 128}}
            />
          </Flex>
        }
        ListFooterComponent={
          <Flex style={{marginVertical: 12}}>
            <Text style={{fontSize: 12, color: '#999'}}>滑动到底了</Text>
          </Flex>
        }
      />
      <View
        style={{
          height: Platform.select({
            ios: useSafeAreaInsets().bottom,
            android: 10,
          }),
          backgroundColor: 'white',
        }}
      />
    </View>
  );
});

const styles = StyleSheet.create({
  view: {
    backgroundColor: '#f1f2f3',
    flex: 1,
  },
  item: {
    backgroundColor: 'white',
    marginVertical: 1,
    marginHorizontal: 12,
    padding: 12,
    borderRadius: 10,
  },
});

export default Wallets;
