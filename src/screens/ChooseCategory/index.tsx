import React, {useState} from 'react';
import {
  FlatList,
  ListRenderItemInfo,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import {RouteProp, useIsFocused} from '@react-navigation/native';
import Button from '@src/components/Button';
import ToolBar from '@src/components/ToolBar';

import Flex from '@src/components/Flex';
import Radio from '@src/components/Radio';
import {useCaches} from '@src/stores';
import {Category} from '@src/constants/t';
import Services from '@src/services';
import {useQuery} from '@tanstack/react-query';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {RootStacksParams, RootStacksProp} from '..';

interface MyProps {
  navigation?: RootStacksProp;
  route?: RouteProp<RootStacksParams, 'ChooseCategory'>;
}

const ChooseCategory: React.FC<MyProps> = props => {
  const {navigation, route} = props;
  const {theme, category, setCategory} = useCaches();
  const focused = useIsFocused();

  const categoriesQuery = useQuery({
    queryKey: ['categoriesQuery', category.id],
    enabled: focused,
    queryFn: () =>
      new Services().selectCategories({
        pageSize: 100,
        currentPage: 1,
      }),
  });

  const onSave = async () => {
    navigation.goBack();
  };

  const loadItem = (info: ListRenderItemInfo<Category>) => {
    const {item} = info;
    return (
      <TouchableOpacity
        activeOpacity={0.7}
        style={styles.item}
        onPress={() => {
          setCategory(item);
        }}>
        <Flex horizontal>
          <Radio checked={category.id == item.id} size={24} />
          <View style={{width: 10}} />
          <View style={{flex: 1}}>
            <Flex horizontal justify="space-between">
              <Text
                style={{fontSize: 14, color: '#333', fontWeight: '500'}}
                numberOfLines={1}>
                {item.title}
              </Text>
              <Button
                title={'详情'}
                style={[
                  styles.detailButton,
                  {
                    borderColor: theme,
                  },
                ]}
                textStyle={{color: theme}}
                onPress={() => {
                  navigation.navigate('EditCategory', {id: item.id});
                }}
              />
            </Flex>
          </View>
        </Flex>
      </TouchableOpacity>
    );
  };

  return (
    <View style={{flex: 1}}>
      <ToolBar
        title={'选择分类'}
        onBackPress={() => {
          navigation.goBack();
        }}
      />
      <View style={{height: 0}} />
      <FlatList
        bounces={false}
        style={{flex: 1}}
        removeClippedSubviews={false}
        data={categoriesQuery.data?.data?.records || []}
        renderItem={loadItem}
        extraData={category}
        initialNumToRender={10}
        keyExtractor={item => item.id}
        ListHeaderComponent={<View style={{height: 1}} />}
        ItemSeparatorComponent={() => <View style={{height: 1}} />}
      />
      <Flex
        horizontal
        justify={'flex-end'}
        style={{
          paddingHorizontal: 15,
          paddingVertical: 10,
          backgroundColor: '#fff',
        }}>
        <Button
          title={'新建'}
          style={{
            borderColor: theme,
            ...styles.newButton,
          }}
          textStyle={{color: theme}}
          onPress={() => {
            navigation.navigate('EditCategory');
          }}
        />
        <View style={{width: 12}} />
        <Button
          title={'保存'}
          disabled={!category.id}
          style={{
            backgroundColor: theme,
            ...styles.saveButton,
          }}
          textStyle={{color: '#fff'}}
          onPress={onSave}
        />
      </Flex>
      <View
        style={{height: useSafeAreaInsets().bottom, backgroundColor: 'white'}}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  item: {
    paddingVertical: 12,
    backgroundColor: '#fff',
    // marginTop: 6,
    borderColor: '#ccc',
    // marginBottom: 6,
    paddingHorizontal: 15,
  },
  newButton: {
    height: 36,
    borderWidth: 1,
    paddingHorizontal: 16,
    borderRadius: 16,
  },
  saveButton: {
    height: 36,
    paddingHorizontal: 16,
    borderRadius: 16,
  },
  detailButton: {
    height: 24,
    borderWidth: 1,
    paddingHorizontal: 5,
    borderRadius: 5,
  },
});

export default ChooseCategory;
