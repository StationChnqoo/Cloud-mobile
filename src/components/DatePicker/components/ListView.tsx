import {useEffect, useRef} from 'react';
import {
  FlatList,
  ListRenderItemInfo,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import {ListViewOption} from '../constants/t';
import { ITEM_HEIGHT } from '../constants/c';

interface MyProps {
  data: ListViewOption[];
  onChange: (index: number) => void;
  index: number;
}

const ListView = (props: MyProps) => {
  const {index, data, onChange} = props;
  const listView = useRef<FlatList>(null);

  useEffect(() => {
    setTimeout(() => {
      listView.current?.scrollToIndex({
        index: Math.max(0, index),
        animated: true,
        viewPosition: 0,
      });
    }, 1);

    return function () {};
  }, [index, data]);

  const renderItem = (info: ListRenderItemInfo<ListViewOption>) => {
    let checked = index == info.index;
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => {
          onChange(info.index);
        }}
        style={[
          styles.itemContainer,
          checked ? [styles.activeContainer] : [styles.inactiveContainer],
        ]}>
        <Text
          style={[
            {paddingHorizontal: 4},
            checked ? [styles.activeItem] : [styles.inactiveItem],
          ]}
          numberOfLines={1}>
          {info.item.label}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <FlatList
      ref={listView}
      bounces={false}
      data={data}
      renderItem={renderItem}
      extraData={index}
      keyExtractor={(item, index) => `${item.value}: ${index}`}
      getItemLayout={(data, index) => ({
        length: ITEM_HEIGHT,
        offset: ITEM_HEIGHT * index,
        index,
      })}
      ListFooterComponent={() => <View style={{height: ITEM_HEIGHT * 5}} />}
      nestedScrollEnabled={true}
      // scrollEnabled={false}
    />
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    height: ITEM_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeContainer: {
    backgroundColor: '#e6f4ff',
    borderRadius: 4,
  },
  inactiveContainer: {},
  activeItem: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  inactiveItem: {
    fontSize: 16,
    color: '#999',
  },
});

export default ListView;
