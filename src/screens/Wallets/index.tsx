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
import {calculateWalletFormSum, WalletMaps} from '@src/constants/c';

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

  const loadItem = (info: ListRenderItemInfo<TWallet>) => {
    const {item} = info;
    return (
      <TouchableOpacity
        style={styles.item}
        activeOpacity={0.8}
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
          <Text style={{color: theme, fontSize: 16}}>
            {calculateWalletFormSum(item)}
            <Text style={{fontSize: 14}}>{` k`}</Text>
          </Text>
        </Flex>
        <View style={{height: 10}} />
        <Text style={{color: '#ccc', fontSize: 14}}>{item.id}</Text>
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
                  ? `[${item[it].map(it => `${it} k`).join(' & ')}]`
                  : `${item[it]}k`
              }`}</Text>
            </Flex>
          ))}
        </Flex>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.view}>
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
        ItemSeparatorComponent={() => <View style={{height: 6}} />}
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
