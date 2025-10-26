import React, {useEffect, useMemo, useState} from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import {RouteProp} from '@react-navigation/native';
import isoWeek from 'dayjs/plugin/isoWeek';
import InputDialog from '@src/components/InputDialog';
import ToolBar from '@src/components/ToolBar';
import {useCaches} from '@src/stores';
import {produce} from 'immer';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {RootStacksParams, RootStacksProp} from '..';
import _ from 'lodash';
import dayjs from 'dayjs';
import {TWallet} from '@src/constants/t';
import Services from '@src/services';
import Flex from '@src/components/Flex';
import MoreButton from '@src/components/MoreButton';
import DeleteableTags from '@src/components/DeleteableTags';
import Button from '@src/components/Button';
import DatePicker from '@src/components/DatePicker';
import {toast} from '@src/constants/u';
import {useMutation} from '@tanstack/react-query';
import {WalletMaps} from '@src/constants/c';

dayjs.extend(isoWeek);

interface MyProps {
  navigation?: RootStacksProp;
  route?: RouteProp<RootStacksParams, 'EditWallet'>;
}

const EditWallet: React.FC<MyProps> = props => {
  const {navigation, route} = props;
  const {theme} = useCaches();

  const [form, setForm] = useState<TWallet>({
    fund: [],
    carpool: [],
    settleOn: dayjs().format('YYYY-MM-DD'),
  } as any);
  const [timePicker, setTimePicker] = useState(false);

  const [inputerDialog, setInputerDialog] = useState({
    title: '提示',
    message: '',
    name: '',
    show: false,
    value: '',
  });

  const updateForm = <K extends keyof TWallet>(key: K, value: TWallet[K]) => {
    let _form = produce(form, draft => {
      draft[key] = value;
    });
    setForm(_form);
  };

  const calculateSelectedSum = useMemo(() => {
    let s: number = Object.keys(WalletMaps).reduce((total, key) => {
      const value = form[key];
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
    return s.toFixed(2);
  }, [form]);

  const onDelete = async () => {
    Alert.alert('提示', '删除后不可恢复，请谨慎操作', [
      {text: '取消', onPress: () => {}},
      {
        text: '确定',
        onPress: async () => {
          const result = await new Services().deleteWallet({id: form.id});
          navigation.goBack();
        },
      },
    ]);
  };

  const deleteTag = (key: string, index: number) => {
    let _form = produce(form, draft => {
      draft[key].splice(index, 1);
    });
    setForm(_form);
  };

  const submitMutation = useMutation({
    mutationKey: ['submitForm', form?.id],
    mutationFn: (payload: TWallet) => new Services().mergeWallet(payload),
  });

  const onSave = async () => {
    if (checkForm) {
      if (submitMutation.isPending) {
        toast('操作过快');
      } else {
        submitMutation.mutate(form, {
          onSettled: data => {
            toast('操作成功');
            navigation.goBack();
          },
        });
      }
    } else {
      toast('请检查表单后重试');
    }
  };

  const checkForm = useMemo(() => {
    return Object.keys(WalletMaps)
      .map(it => form[it])
      .filter(it => !Array.isArray(it))
      .every(it => (it ? true : false));
  }, [form]);

  const loadLine = (n?: string) => <View style={{...styles.line}} />;

  const loadWallet = async () => {
    console.log('id: ', route.params?.id);
    let _form = _.cloneDeep(form);
    if (route.params?.id) {
      let result = await new Services().selectWallet({id: route.params.id});
      _form = result.data;
    } else {
      _form.createAt = dayjs().format('YYYY-MM-DD HH:mm:ss');
    }
    _form.updateAt = dayjs().format('YYYY-MM-DD HH:mm:ss');
    setForm(_form);
    console.log('loadWallet: ', {_form, form});
  };

  const closeInputerDialog = () => {
    setInputerDialog(
      produce(inputerDialog, draft => {
        draft.show = false;
      }),
    );
  };

  const onAppend = async (s: string) => {
    let _form = produce(form, draft => {
      draft[inputerDialog.name] = [...draft[inputerDialog.name], s];
    });
    closeInputerDialog();
    setForm(_form);
  };

  useEffect(() => {
    loadWallet();
    return function () {};
  }, []);

  return (
    <View style={{flex: 1, backgroundColor: '#fff'}}>
      <ToolBar
        title={`${route.params?.id ? '编辑' : '新增'}钱包`}
        onBackPress={() => {
          navigation.goBack();
        }}
      />
      <View style={{height: 1, backgroundColor: '#ccc'}} />
      <ScrollView
        bounces={false}
        style={{flex: 1}}
        removeClippedSubviews={false}>
        <View style={{padding: 15}}>
          {Object.keys(WalletMaps).map((it, i) => (
            <View key={i}>
              {Array.isArray(form[it]) ? (
                <View>
                  <Flex horizontal justify="space-between">
                    <Text style={styles.label}>{WalletMaps?.[it]}</Text>
                    <MoreButton
                      onPress={() => {
                        setInputerDialog(
                          produce(inputerDialog, draft => {
                            draft.name = it;
                            draft.message = `请输入${WalletMaps[it]}`;
                            draft.show = true;
                          }),
                        );
                      }}
                      label={
                        form[it].length > 0
                          ? `已填写${form[it].length}项`
                          : '请填写'
                      }
                    />
                  </Flex>
                  {form[it].length > 0 && (
                    <View style={{marginTop: 5}}>
                      <DeleteableTags
                        datas={form[it]}
                        onDelete={index => {
                          deleteTag(it, index);
                        }}
                      />
                    </View>
                  )}
                </View>
              ) : (
                <Flex horizontal justify="space-between">
                  <Text style={styles.label}>{WalletMaps[it]}</Text>
                  <TextInput
                    placeholder={WalletMaps[it] + ' / k'}
                    style={{...styles.input, height: undefined}}
                    textAlign={'right'}
                    multiline
                    value={`${form?.[it] || ''}`}
                    // @ts-ignore
                    onChangeText={t => updateForm(it, t)}
                  />
                </Flex>
              )}
              {loadLine()}
            </View>
          ))}
          <Flex horizontal justify="space-between">
            <Text style={styles.label}>创建时间</Text>
            <Text style={{color: '#333', fontSize: 16}}>{form?.createAt}</Text>
          </Flex>
          {loadLine()}
          <Flex horizontal justify="space-between">
            <Text style={styles.label}>结算周期</Text>
            <MoreButton
              onPress={() => {
                setTimePicker(true);
              }}
              label={
                form.settleOn
                  ? dayjs(form.settleOn).format('YYYY年') +
                    dayjs(form.settleOn).isoWeek() +
                    '周'
                  : '请选择'
              }
            />
          </Flex>
          {loadLine()}
        </View>
      </ScrollView>
      <View style={{height: 1, backgroundColor: '#ccc'}} />
      <Flex
        horizontal
        justify={'space-between'}
        style={{paddingHorizontal: 15, paddingVertical: 10}}>
        <Text style={{color: '#ff5252', fontSize: 20}}>
          {calculateSelectedSum}
          <Text style={{fontSize: 14}}>{` k `}</Text>
        </Text>
        <Flex horizontal justify={'flex-start'}>
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
            disabled={!checkForm}
            textStyle={{color: '#fff'}}
            onPress={onSave}
          />
        </Flex>
      </Flex>
      <View
        style={{height: useSafeAreaInsets().bottom, backgroundColor: 'white'}}
      />
      <InputDialog
        onClose={closeInputerDialog}
        {...inputerDialog}
        onConfirm={onAppend}
      />
      <DatePicker
        date={form?.settleOn}
        show={timePicker}
        onCancel={() => {
          setTimePicker(false);
        }}
        onConfirm={s => {
          updateForm('settleOn', s);
          setTimePicker(false);
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  label: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
    // fontWeight: '500',
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
    flex: 1,
    padding: 0,
    height: 24,
  },
});

export default EditWallet;
