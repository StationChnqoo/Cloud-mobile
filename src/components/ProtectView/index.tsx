import {useCaches} from '@src/stores';
import React, {useEffect, useState} from 'react';
import {Image, StyleSheet, Text, TextInput, View} from 'react-native';

interface MyProps {
  onPassed?: () => void;
}

const ProtectView: React.FC<MyProps> = props => {
  const {onPassed} = props;
  const {password, theme} = useCaches();
  const [text, setText] = useState('');

  useEffect(() => {
    if (text === password) {
      onPassed?.();
    }
  }, [password, text]);

  return (
    <View style={{flex: 1, backgroundColor: '#fff'}}>
      <View style={{height: 32}} />
      <View style={{alignItems: 'center'}}>
        <Image
          source={require('@src/assets/images/other/protect_lock.png')}
          style={{height: 64, width: 64, tintColor: theme}}
        />
        <View style={{height: 24}} />
        <Text style={{fontSize: 16, color: '#333'}}>请输入密码</Text>
        <View style={{height: 10}} />
        <Text style={{fontSize: 14, color: '#666'}}>
          此内容受密码保护，请输入密码后查看
        </Text>
        <TextInput
          style={styles.input}
          placeholder={'请输入密码'}
          onChangeText={setText}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    padding: 0,
    height: 36,
    fontSize: 16,
    borderColor: '#ccc',
    borderRadius: 10,
    paddingHorizontal: 5,
    margin: 16,
    width: 144,
    textAlign: 'center',
  },
});

export default ProtectView;
