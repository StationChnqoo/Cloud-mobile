import React, {useEffect, useState} from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from 'react-native';

import {RouteProp, useIsFocused} from '@react-navigation/native';
import Button from '@src/components/Button';
import DeleteableTags from '@src/components/DeleteableTags';
import FileUploader from '@src/components/FileUploader';
import Flex from '@src/components/Flex';
import InputDialog from '@src/components/InputDialog';
import MoreButton from '@src/components/MoreButton';
import ToolBar from '@src/components/ToolBar';
import {CategorySchema, Post, PostSchema} from '@src/constants/t';
import Services from '@src/services';
import {useCaches} from '@src/stores';
import {useQuery} from '@tanstack/react-query';
import dayjs from 'dayjs';
import {produce} from 'immer';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import z from 'zod';
import {RootStacksParams, RootStacksProp} from '..';

interface MyProps {
  navigation?: RootStacksProp;
  route?: RouteProp<RootStacksParams, 'EditPost'>;
}

const PostSchemaForm = PostSchema.extend({
  categoryId: z.string().min(1, '请选择分类'),
  title: z.string().min(1, '请填写标题'),
});

const EditPost: React.FC<MyProps> = props => {
  const {navigation, route} = props;
  const {theme, setCategory, category} = useCaches();
  const [form, setForm] = useState<Post>(PostSchema.parse({}));
  const focused = useIsFocused();
  const [isOpenInputer, setIsOpenInputer] = useState(false);
  const insets = useSafeAreaInsets();
  const updateForm = <K extends keyof Post>(key: K, value: Post[K]) => {
    let _form = produce(form, draft => {
      draft[key] = value;
    });
    setForm(_form);
  };

  const onDelete = async () => {
    Alert.alert('提示', '删除后不可恢复，请谨慎操作', [
      {text: '取消', onPress: () => {}},
      {
        text: '确定',
        onPress: async () => {
          const result = await new Services().deletePost(form.id);
          navigation.goBack();
        },
      },
    ]);
  };

  const onSave = async () => {
    let result = PostSchemaForm.safeParse(form);
    if (result.success) {
      await new Services().mergePost(form);
      navigation.goBack();
    } else {
      Alert.alert('提示', result.error.message, [
        {text: '确定', onPress: () => {}},
      ]);
    }
  };

  const loadLine = () => <View style={styles.line} />;

  const loadPost = async () => {
    let _form = JSON.parse(JSON.stringify(form)) as Post;
    if (route.params?.id) {
      let result = await new Services().selectPost(route.params.id);
      _form = result.data;
    }
    _form.updateAt = dayjs().format('YYYY-MM-DD HH:mm:ss');
    setForm(_form);
  };

  const categoryQuery = useQuery({
    enabled: focused,
    queryKey: ['categoryQuery', form.categoryId],
    queryFn: () => new Services().selectCategory(form.categoryId),
  });

  const onTagsAppend = (s: string) => {
    updateForm('tags', [...form.tags, s]);
    setIsOpenInputer(false);
  };

  const onTagsDelete = (index: number) => {
    let _tags = [...form.tags];
    _tags.splice(index, 1);
    updateForm('tags', _tags);
  };

  useEffect(() => {
    loadPost();
    return function () {
      setCategory(CategorySchema.parse({}));
    };
  }, []);

  useEffect(() => {
    if (focused && category?.id) {
      updateForm('categoryId', category.id);
    }
    return function () {};
  }, [focused, category?.id]);

  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      <ToolBar
        title={`${route.params?.id ? '编辑' : '新增'}笔记`}
        onBackPress={() => {
          navigation.goBack();
        }}
      />
      <View style={{height: 1, backgroundColor: '#eee'}} />
      <ScrollView style={{flex: 1}}>
        <View style={{padding: 15}}>
          <Flex horizontal justify="space-between">
            <Text style={styles.label}>是否公开</Text>
            <Switch
              value={form.isPublic == 1}
              onValueChange={() => {
                updateForm('isPublic', -form.isPublic + 1);
              }}
              thumbColor={['#999', theme][form.isPublic]}
              // style={{transform: [{scaleX: 0.7}, {scaleY: 0.7}]}}
              trackColor={{
                false: '#999',
                true: '#eee',
              }}
            />
          </Flex>
          {loadLine()}
          <View>
            <Flex horizontal justify="space-between">
              <Text style={styles.label}>分类</Text>
              <MoreButton
                onPress={() => {
                  navigation.navigate('ChooseCategory', {
                    id: form.categoryId,
                  });
                }}
                label={
                  form.categoryId ? categoryQuery.data?.data?.title : '请选择'
                }
              />
            </Flex>
          </View>
          {loadLine()}
          <Flex horizontal justify="space-between">
            <Text style={styles.label}>标题</Text>
            <View style={{width: 12}} />
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
            <View style={{width: 12}} />
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
            <Text style={styles.label}>标签</Text>
            <MoreButton
              onPress={() => {
                setIsOpenInputer(true);
              }}
              label={'请填写标签'}
            />
          </Flex>
          <View style={{height: form.tags.length == 0 ? 0 : 5}} />
          <DeleteableTags datas={form.tags} onDelete={onTagsDelete} />
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
          <FileUploader
            images={form.images}
            setImages={i => {
              updateForm('images', i);
            }}
          />
          <View style={{height: '5%'}} />
        </View>
        <View style={{height: 100}} />
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
      <InputDialog
        title="提示"
        message="请填写标签"
        show={isOpenInputer}
        onClose={() => {
          setIsOpenInputer(false);
        }}
        onConfirm={onTagsAppend}
      />
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
  input: {
    fontSize: 16,
    lineHeight: 20,
    flex: 1,
    padding: 0,
    height: 24,
    width: '33%',
  },
});

export default EditPost;
