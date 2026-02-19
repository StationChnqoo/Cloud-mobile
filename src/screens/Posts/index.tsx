import React, {useEffect, useState} from 'react';
import {
  FlatList,
  Image,
  ListRenderItemInfo,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import {useIsFocused} from '@react-navigation/native';
import Flex from '@src/components/Flex';
import {Category, Post} from '@src/constants/t';
import Services from '@src/services';
import {useCaches} from '@src/stores';
import {
  useInfiniteQuery,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import {RootStacksProp} from '..';
import {Router} from '@src/navigation';
import getFile from '@src/hooks/useFile';
import {dip2px} from '@src/constants/u';

interface MyProps {
  navigation?: RootStacksProp;
}

const Posts: React.FC<MyProps> = props => {
  const {navigation} = props;
  const {theme} = useCaches();
  const focused = useIsFocused();
  const [categoryId, setCategoryId] = useState('');
  const [isPassed, setIsPassed] = useState(false);

  useEffect(() => {
    setIsPassed(false);
    return () => {};
  }, [focused]);

  const categoryQuery = useQuery({
    queryKey: ['categoryQuery'],
    queryFn: () =>
      new Services().selectCategories({pageSize: 100, currentPage: 1}),
  });

  const postsQuery = useInfiniteQuery({
    initialPageParam: {currentPage: 1},
    queryKey: ['postsQuery', categoryId],
    retryOnMount: false,
    refetchOnMount: false,
    enabled: focused,
    queryFn: params => loadDatas(params.pageParam.currentPage),
    getNextPageParam: (lastPage, pages) => {
      return lastPage.hasNextPage
        ? {currentPage: lastPage.currentPage + 1}
        : undefined;
    },
  });

  const queryClient = useQueryClient();

  const loadDatas = async (currentPage: number) => {
    let result = await new Services().selectPosts(
      {
        currentPage,
        pageSize: 10,
      },
      categoryId,
    );
    // datas.value = result.data.data;
    return result.data;
  };

  useEffect(() => {
    postsQuery.refetch();
    return function () {};
  }, [focused]);

  const loadItem = (info: ListRenderItemInfo<Post>) => {
    const {item} = info;
    return (
      <TouchableOpacity
        style={styles.item}
        activeOpacity={0.8}
        onPress={() => {
          Router.navigate('EditPost', {id: item.id});
        }}>
        <Flex justify="space-between" horizontal>
          <Text
            style={{fontSize: 16, color: '#333', fontWeight: '500', flex: 1}}
            numberOfLines={1}>
            {item.title}
          </Text>
        </Flex>
        {item.content ? (
          <Text
            style={{fontSize: 14, color: '#666', lineHeight: 20, marginTop: 5}}
            numberOfLines={2}>
            {item.content}
          </Text>
        ) : null}
        {item.tags.length > 0 ? (
          <View style={styles.tags}>
            {item.tags.map((it, i) => (
              <View key={i} style={[styles.tag, {borderColor: '#ccc'}]}>
                <Text style={{fontSize: 12, color: '#999'}}>{it}</Text>
              </View>
            ))}
          </View>
        ) : null}
        {item.images.length > 0 ? (
          <Flex
            horizontal
            align="flex-end"
            justify="space-between"
            style={{marginTop: 12}}>
            <Flex horizontal style={{gap: 4, flex: 1}} justify="flex-start">
              {item.images.slice(0, 3).map((it, i) => {
                const file = getFile(it);
                return (
                  <View key={i} style={{position: 'relative'}}>
                    <Image key={i} source={file.src} style={styles.src} />
                  </View>
                );
              })}
            </Flex>
            <View style={{width: 10}} />
            <Text
              style={{
                color: theme,
                textDecorationLine: 'underline',
                fontSize: 14,
              }}>
              {item.images.length}附件
            </Text>
          </Flex>
        ) : null}
        <View style={{height: 10}} />
        <Flex
          justify="space-between"
          horizontal
          style={styles.itemBottomContainer}>
          <Flex horizontal>
            <Text style={{color: theme, fontSize: 14}}>
              [{['私密', '公开'][item.isPublic]}]
            </Text>
            <View style={{width: 2}} />
            <Text style={{fontSize: 14, color: '#333'}}>
              {item.categoryTitle || '默认分类'}
            </Text>
            {/* {item.isPublic == 1 ? null : (
              <Image
                source={require('@src/assets/images/common/lock.png')}
                style={{height: 16, width: 16, tintColor: theme}}
              />
            )} */}
          </Flex>
          <Text style={{fontSize: 12, color: '#999'}}>{item.updateAt}</Text>
        </Flex>
      </TouchableOpacity>
    );
  };

  return (
    <View style={{flex: 1, backgroundColor: '#f0f0f0'}}>
      <View style={{height: 1, backgroundColor: '#fff'}} />
      <View style={{flex: 1, flexDirection: 'row'}}>
        <View style={{flex: 3}}>
          <ScrollView
            style={{backgroundColor: '#fff'}}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={categoryQuery.isFetching}
                onRefresh={() => {
                  categoryQuery.refetch();
                }}
              />
            }>
            {(
              [
                {id: '', title: '全部分类'},
                ...(categoryQuery.data?.data?.records || []),
              ] as Category[]
            ).map((it, i) => {
              let checked = it.id == categoryId;
              return (
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => {
                    setCategoryId(it.id);
                  }}
                  key={it.id}>
                  <Flex
                    style={{
                      paddingVertical: 10,
                      paddingHorizontal: 12,
                      backgroundColor: checked ? '#eee' : '#fff',
                    }}>
                    <Text
                      style={[
                        {
                          fontSize: 14,
                        },
                        checked
                          ? {fontWeight: '500', color: '#333'}
                          : {color: '#666'},
                      ]}
                      numberOfLines={1}>
                      {it.title}
                    </Text>
                  </Flex>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
        <View style={{width: 1}} />
        <View style={{flex: 8}}>
          <FlatList
            style={{flex: 1}}
            refreshControl={
              <RefreshControl
                refreshing={
                  postsQuery.isFetching &&
                  postsQuery.data?.pages?.[0]?.page === 1
                }
                onRefresh={() => {
                  queryClient.resetQueries({queryKey: ['postQuery']});
                  postsQuery.refetch();
                }}
              />
            }
            // ListHeaderComponent={<View style={{height: 8}} />}
            data={postsQuery.data?.pages.map(it => it.records).flat() || []}
            onEndReached={() => {
              postsQuery.fetchNextPage();
            }}
            renderItem={loadItem}
            removeClippedSubviews={true}
            keyExtractor={(it, i) => `${it.id}:${i}`}
            onEndReachedThreshold={0.1}
            ItemSeparatorComponent={() => <View style={{height: 1}} />}
            ListEmptyComponent={
              <Flex>
                <Image
                  source={require('@src/assets/images/empty/money.png')}
                  style={{height: 128, width: 128}}
                />
              </Flex>
            }
            ListFooterComponent={
              <Flex style={{marginVertical: 12}}>
                <Text style={{fontSize: 12, color: '#999'}}>
                  {postsQuery.isFetching ? '加载中' : '到底啦'}
                </Text>
              </Flex>
            }
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  item: {
    // marginHorizontal: '3%',
    // borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
  },
  src: {
    height: dip2px(52),
    width: dip2px(52),
    borderRadius: 5,
  },
  tags: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 5,
  },
  tag: {
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 4,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 2,
  },
  input: {
    borderRadius: 10,
    borderWidth: 1,
    height: 32,
    fontSize: 16,
    paddingVertical: 0,
    borderColor: '#ccc',
    paddingHorizontal: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  hintMorePics: {
    height: 58,
    width: 58,
    borderRadius: 4,
    backgroundColor: 'rgba(0, 0, 0, 0.28)',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    position: 'absolute',
    padding: 4,
    top: 0,
    left: 0,
  },
  itemBottomContainer: {
    paddingHorizontal: 8,
    paddingVertical: 6,
    backgroundColor: 'rgba(0, 0, 0, 0.04)',
    borderRadius: 10,
  },
});

export default Posts;
