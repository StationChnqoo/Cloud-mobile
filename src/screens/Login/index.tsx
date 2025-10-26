import {toast} from '@src/constants/u';
import Services from '@src/services';
import {useCaches} from '@src/stores';
import {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {RootStacksProp} from '..';
import ToolBar from '@src/components/ToolBar';

interface MyProps {
  navigation: RootStacksProp;
}

const LoginScreen: React.FC<MyProps> = ({navigation}) => {
  const {setToken} = useCaches();

  useEffect(() => {}, []);

  const [params, setParams] = useState({
    mobile: '',
    password: '',
  });

  const onSubmit = async () => {
    // navigation.navigate('Home');
    if (params.mobile && params.password) {
      let result = await new Services().login(params);
      if (result.data) {
        setToken(result.data);
      }
      toast(result.data ? '登录成功' : '登录失败');
      navigation.goBack();
    } else {
      toast('请填写正确手机和密码');
    }
  };

  return (
    <View style={{flex: 1}}>
      <ToolBar
        title={'登录'}
        onBackPress={() => {
          navigation.goBack();
        }}
      />
      <View style={{height: 1, backgroundColor: '#ccc'}} />
      <View style={styles.view}>
        <View style={{height: 15}} />
        <TextInput
          style={styles.input}
          placeholder="手机"
          underlineColorAndroid={'trasparent'}
          value={params.mobile}
          onChangeText={s => {
            setParams({...params, mobile: s});
          }}
        />
        <View style={styles.line} />
        <TextInput
          style={styles.input}
          placeholder="密码"
          secureTextEntry
          underlineColorAndroid={'trasparent'}
          value={params.password}
          onChangeText={s => {
            setParams({...params, password: s});
          }}
        />
        <View style={{height: 16}} />
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={onSubmit}
          style={styles.button}>
          <Text style={{color: '#fff', fontSize: 14}}>登录</Text>
        </TouchableOpacity>
      </View>
      <View style={{height: 16}} />
    </View>
  );
};

const styles = StyleSheet.create({
  view: {
    paddingHorizontal: 15,
    backgroundColor: '#fff',
    flex: 1,
  },
  input: {
    height: 36,
    padding: 0,
    margin: 0,
    backgroundColor: '#eee',
    paddingVertical: 0,
    paddingHorizontal: 12,
    borderRadius: 5,
    fontSize: 16,
  },
  line: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 5,
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#987123',
    borderRadius: 5,
    height: 44,
  },
});

export default LoginScreen;
