
import {useCaches} from '@src/stores';
import {useState} from 'react';
import {StyleSheet, Text, TextInput, View} from 'react-native';
import Button from '../Button';
import BottomSheet from '../BottomSheet';
import Flex from '../Flex';

interface MyProps {
  show: boolean;
  onClose: () => void;
  onHide: () => void;
  onConfirm: (result: boolean) => void;
}

const ConfirmModal = (props: MyProps) => {
  const {onHide, onConfirm} = props;
  const {theme} = useCaches();
  const [text, setText] = useState('');
  const [code, setCode] = useState('');

  const onShow = async () => {
    setCode((Math.ceil(Math.random() * 8999) + 1000).toString());
  };

  // console.log('jiraUsedPeopleQuery: ', jiraUsedPeopleQuery.data);

  return (
    <BottomSheet {...props} onShow={onShow}>
      <View
        style={{
          ...styles.views,
        }}>
        <Text style={{color: '#333', fontWeight: '500', fontSize: 16}}>
          防误操作弹窗
        </Text>
        <View style={{height: 12}} />
        <Text
          style={{fontSize: 14, color: '#666'}}>{`请输入口令 -> ${code}`}</Text>
        <View style={{height: 12}} />
        <TextInput
          style={styles.input}
          placeholder={'请输入口令'}
          underlineColorAndroid={'transparent'}
          onChangeText={setText}
          keyboardType="numeric"
          value={text}
        />
        <View style={{height: 24}} />
        <Flex horizontal justify={'flex-end'}>
          <Button
            disabled={text.length == 0}
            style={{...styles.saveButton, backgroundColor: theme}}
            textStyle={{color: '#fff'}}
            onPress={() => {
              onConfirm(text == code);
            }}
            title={'确认'}
          />
        </Flex>
      </View>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  views: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 16,
    margin: 24,
  },
  saveButton: {
    height: 36,
    paddingHorizontal: 16,
    borderRadius: 16,
  },
  input: {
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    height: 36,
    paddingVertical: 0,
    paddingHorizontal: 5,
    fontSize: 16,
  },
  tag: {
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
});

export default ConfirmModal;
