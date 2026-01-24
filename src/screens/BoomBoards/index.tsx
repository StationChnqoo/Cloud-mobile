import Flex from '@src/components/Flex';
import ToolBar from '@src/components/ToolBar';
import {Fonts} from '@src/constants/c';
import {BoardItem} from '@src/constants/t';
import {links, renderUpOrDown} from '@src/constants/u';
import DfcfService from '@src/services/DfcfService';
import {useCaches} from '@src/stores';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import {useEffect, useRef, useState} from 'react';

import {
  FlatList,
  Image,
  ListRenderItemInfo,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {RootStacksProp} from '..';

dayjs.extend(isBetween);

const ImageStyle = {
  height: 60,
  width: 100,
};

interface MyProps {
  navigation?: RootStacksProp;
}

const BoomBoards: React.FC<MyProps> = props => {
  const {navigation} = props;
  const {theme} = useCaches();
  const [date, setDate] = useState(dayjs().format('YYYYMMDD'));
  const [datas, setDatas] = useState([]);
  const insets = useSafeAreaInsets();
  const listView = useRef<FlatList<BoardItem>>(null);
  const [r, setR] = useState(0);
  const [sortKey, setSortKey] = useState('zdp');
  const sortNames = {tshare: '总市值', p: '价格', zdp: '涨幅', hs: '换手率'};

  const loadBoomBoards = async () => {
    const result = await new DfcfService().selectBoomBoards(date);
    setDatas(
      (result?.data?.pool || [])?.sort(
        (a: any, b: any) => b[sortKey] - a[sortKey],
      ),
    );
  };

  const onDatePress = (change: number) => {
    const next = dayjs(date).add(change, 'day');
    const weekStart = dayjs().startOf('week').add(0, 'day'); // 周一
    const weekEnd = weekStart.add(6, 'day'); // 周天

    if (next.isBetween(weekStart, weekEnd, 'day', '[]')) {
      const newDate = next.format('YYYYMMDD');
      setDate(newDate);
    }
  };

  const renderItem = (info: ListRenderItemInfo<BoardItem>) => {
    const {item, index} = info;
    const rud = renderUpOrDown(item?.zdp || 0);
    return (
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('Webviewer', {
            url: links.stockDetail(`${item.m}.${item.c}`),
            title: `${item.c} ${item.n}`,
          });
        }}
        activeOpacity={0.8}>
        <Flex
          horizontal
          justify="space-between"
          style={{
            backgroundColor: '#fff',
            paddingVertical: 5,
            paddingHorizontal: 12,
          }}>
          <View
            style={{
              height: ImageStyle.height,
              flex: 1,
              justifyContent: 'space-around',
            }}>
            <Flex horizontal justify="space-between">
              <Text style={styles.name} numberOfLines={1}>
                <Text style={{color: '#999', fontSize: 16}}>
                  #{index + 1}.{' '}
                </Text>
                <Text style={{color: '#333', fontSize: 14, fontWeight: '500'}}>
                  {item.c} | {item.n}
                </Text>
              </Text>
              <Text style={{fontSize: 14, color: rud.color}}>
                {`${item.zdp.toFixed(2)}%${rud.label}`}
              </Text>
            </Flex>
            <Flex horizontal justify="space-between" align="baseline">
              <Text
                style={{
                  fontSize: 28,
                  fontFamily: Fonts.Digital,
                  color: rud.color,
                }}>
                {(item.p / 1000).toFixed(2)}
              </Text>
              <Text style={{fontSize: 12, color: '#333'}}>
                <Text style={{color: '#999'}}>市值:</Text>{' '}
                {(item.tshare / Math.pow(10, 8)).toFixed(1)}亿
                <Text style={{color: '#ccc'}}> | </Text>
                <Text style={{color: '#999'}}>换手率: </Text>{' '}
                {item.hs.toFixed(2)}%
              </Text>
            </Flex>
          </View>
          <View style={{width: 10}} />
          <View
            style={{
              ...ImageStyle,
              position: 'relative',
              borderWidth: 1,
              borderColor: '#eee',
            }}>
            {dayjs().format('YYYYMMDD') == date ? (
              <Image
                source={{
                  uri: links.previewStockChart(`${item.m}.${item.c}`, 'RTOPSH'),
                }}
                style={ImageStyle}
                resizeMode="stretch"
              />
            ) : null}
            <View style={styles.badgeContainer}>
              <Text style={{color: '#fff', fontSize: 12}}>{item.hybk}</Text>
            </View>
          </View>
        </Flex>
      </TouchableOpacity>
    );
  };

  useEffect(() => {
    listView.current?.scrollToOffset({animated: false, offset: 0});
    loadBoomBoards();
  }, [date, r, sortKey]);

  return (
    <View style={{flex: 1, backgroundColor: '#fff'}}>
      <ToolBar
        title={'炸板'}
        onBackPress={() => {
          navigation.goBack();
        }}
      />
      <View style={{height: 1, backgroundColor: '#eee'}} />
      <FlatList
        ref={listView}
        style={{flex: 1}}
        data={datas}
        renderItem={renderItem}
        initialNumToRender={datas.length}
        refreshControl={
          <RefreshControl
            refreshing={false}
            onRefresh={() => {
              setR(Math.random());
            }}
          />
        }
        keyExtractor={(item, index) => item?.c + '-' + index}
        ItemSeparatorComponent={() => <View style={styles.line} />}
      />
      <View style={{height: 1, backgroundColor: '#eee'}} />
      <View style={{padding: 15, backgroundColor: '#fff'}}>
        <Flex horizontal justify="flex-end">
          <View style={{alignItems: 'flex-end'}}>
            <Text
              style={{
                color: '#333',
                fontSize: 14,
              }}>
              排序方式↓
            </Text>
            <View style={{height: 5}} />
            <Flex horizontal style={{gap: 10}}>
              {Object.keys(sortNames).map(key => (
                <TouchableOpacity
                  key={key}
                  activeOpacity={0.8}
                  onPress={() => {
                    setSortKey(key);
                  }}>
                  <Text
                    style={[
                      {
                        fontSize: 14,
                      },
                      key == sortKey
                        ? {
                            color: theme,
                            textDecorationLine: 'underline',
                            fontWeight: '500',
                          }
                        : {color: '#999'},
                    ]}>
                    {sortNames[key as keyof typeof sortNames]}
                  </Text>
                </TouchableOpacity>
              ))}
            </Flex>
          </View>
        </Flex>
        <View style={{height: 5}} />
        <Flex horizontal justify="space-between">
          <Text style={{fontSize: 14, color: '#333', lineHeight: 24}}>
            共<Text style={{fontSize: 24, color: theme}}>{datas.length}</Text>
            只炸板股
          </Text>
          <Flex horizontal justify="flex-end">
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                onDatePress(-1);
              }}
              hitSlop={10}>
              <Image
                source={require('@src/assets/images/common/arrow_left.png')}
                style={{width: 16, height: 16, tintColor: theme}}
              />
            </TouchableOpacity>
            <Text style={{fontSize: 14, color: '#666', marginHorizontal: 10}}>
              {dayjs(date).format(`YYYY-MM-DD dddd`)}
            </Text>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                onDatePress(1);
              }}
              hitSlop={10}>
              <Image
                source={require('@src/assets/images/common/arrow_right.png')}
                style={{
                  width: 16,
                  height: 16,
                  tintColor: theme,
                }}
              />
            </TouchableOpacity>
          </Flex>
        </Flex>
      </View>
      <View style={{height: insets.bottom, backgroundColor: '#fff'}} />
    </View>
  );
};

const styles = StyleSheet.create({
  line: {height: 1, backgroundColor: '#eee', marginHorizontal: 12},
  name: {
    fontSize: 14,
    lineHeight: 16,
    color: '#999',
    flex: 1,
    marginRight: 10,
  },
  badgeContainer: {
    position: 'absolute',
    backgroundColor: 'rgba(0, 0, 0, 0.18)',
    width: '100%',
    bottom: 0,
    justifyContent: 'center',
    padding: 2,
    flexDirection: 'row',
  },
});

export default BoomBoards;
