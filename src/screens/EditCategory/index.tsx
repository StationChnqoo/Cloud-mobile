import React, {useEffect, useState} from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import {RouteProp} from '@react-navigation/native';
import Button from '@src/components/Button';
import Flex from '@src/components/Flex';
import ToolBar from '@src/components/ToolBar';
import {Category, CategorySchema} from '@src/constants/t';
import {toast} from '@src/constants/u';
import Services from '@src/services';
import {useCaches} from '@src/stores';
import dayjs from 'dayjs';
import {produce} from 'immer';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {RootStacksParams, RootStacksProp} from '..';

interface MyProps {
  navigation?: RootStacksProp;
  route?: RouteProp<RootStacksParams, 'EditCategory'>;
}

const EditCategory: React.FC<MyProps> = props => {
  const {navigation, route} = props;
  const {theme, setCategory} = useCaches();
  const [form, setForm] = useState<Category>(CategorySchema.parse({}));
  const insets = useSafeAreaInsets();
  const updateForm = <K extends keyof Category>(key: K, value: Category[K]) => {
    let _form = produce(form, draft => {
      draft[key] = value;
    });
    setForm(_form);
  };

  const onDelete = async () => {
    Alert.alert('提示', '删除后不可恢复，请谨慎操作。', [
      {text: '取消', onPress: () => {}},
      {
        text: '确定',
        onPress: async () => {
          const result = await new Services().deleteCategory(form.id);
          navigation.goBack();
        },
      },
    ]);
  };

  const onSave = async () => {
    await new Services().mergeCategory(form);
    toast('操作成功');
    navigation.goBack();
  };

  const loadLine = (n?: string) => <View style={{...styles.line}} />;

  const loadCategory = async () => {
    let _form = JSON.parse(JSON.stringify(form)) as Category;
    if (route.params?.id) {
      let result = await new Services().selectCategory(route.params.id);
      _form = result.data;
    }
    _form.updateAt = dayjs().format('YYYY-MM-DD HH:mm:ss');
    setForm(_form);
  };

  useEffect(() => {
    loadCategory();
    return function () {};
  }, []);

  return (
    <View style={{flex: 1, backgroundColor: '#fff'}}>
      <ToolBar
        title={`${route.params?.id ? '编辑' : '新增'}分类`}
        onBackPress={() => {
          navigation.goBack();
        }}
      />
      <View style={{height: 1, backgroundColor: '#eee'}} />
      <ScrollView
        bounces={false}
        style={{flex: 1}}
        removeClippedSubviews={false}>
        <View style={{padding: 15}}>
          <Flex horizontal justify="space-between">
            <Text style={styles.label}>标题</Text>
            <TextInput
              placeholder="标题"
              style={{...styles.input, height: undefined}}
              textAlign={'right'}
              multiline
              value={form.title}
              onChangeText={t => updateForm('title', t)}
            />
          </Flex>
          {loadLine()}
          <Flex horizontal justify="space-between">
            <Text style={styles.label}>描述</Text>
            <TextInput
              placeholder="描述"
              style={{...styles.input, height: undefined}}
              textAlign={'right'}
              multiline
              value={form.content}
              onChangeText={t => updateForm('content', t)}
            />
          </Flex>
          {loadLine()}
          <Flex horizontal justify="space-between">
            <Text style={styles.label}>创建时间</Text>
            <Text style={{color: '#333', fontSize: 16}}>{form.createAt}</Text>
          </Flex>
          {loadLine()}
          <Flex horizontal justify="space-between">
            <Text style={styles.label}>修改时间</Text>
            <Text style={{color: '#333', fontSize: 16}}>{form.updateAt}</Text>
          </Flex>
          {loadLine()}
        </View>
      </ScrollView>
      <View style={{height: 1, backgroundColor: '#ccc'}} />
      <Flex
        horizontal
        justify={'flex-end'}
        style={{paddingHorizontal: 15, paddingVertical: 10}}>
        <Button
          title={'删除'}
          style={{
            borderColor: theme,
            ...styles.deleteButton,
          }}
          textStyle={{color: theme}}
          onPress={onDelete}
        />
        <View style={{width: 16}} />
        <Button
          title={'保存'}
          style={{
            backgroundColor: theme,
            ...styles.saveButton,
          }}
          textStyle={{color: '#fff'}}
          onPress={onSave}
        />
      </Flex>
      <View style={{height: insets.bottom, backgroundColor: 'white'}} />
    </View>
  );
};

const styles = StyleSheet.create({
  label: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
    fontWeight: '500',
    textAlignVertical: 'center',
  },
  value: {
    fontSize: 14,
    color: '#666',
  },
  deleteButton: {
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
  line: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 12,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 5,
    marginTop: 5,
  },
  tag: {
    borderRadius: 10,
    height: 32,
    borderWidth: 1,
    borderColor: '#ccc',
    paddingHorizontal: 4,
  },
  input: {
    fontSize: 16,
    lineHeight: 20,
    flex: 1,
    padding: 0,
    height: 24,
  },
});

export default EditCategory;
