import {RouteProp} from '@react-navigation/native';
import Flex from '@src/components/Flex';
import ToolBar from '@src/components/ToolBar';
import YahooService from '@src/services/YahooService';
import {useCaches} from '@src/stores';
import _ from 'lodash';
import {useState} from 'react';
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {RootStacksParams, RootStacksProp} from '..';

interface MyProps {
  navigation: RootStacksProp;
  route?: RouteProp<RootStacksParams, 'YahooAuth'>;
}

const YahooAuth: React.FC<MyProps> = ({navigation, route}) => {
  const {setToken, yahoo, setYahoo, theme} = useCaches();
  const insets = useSafeAreaInsets();
  const [myYahoo, setMyYahoo] = useState(_.cloneDeep(yahoo));

  /** https://finance.yahoo.com/quote/FPT.VN/ */
  // 随便找个请求，复制Header里面的Cookie ...
  const onSavePress = async () => {
    try {
      let result = await new YahooService().selectVnFunds(
        myYahoo.cookies,
        myYahoo.crumb,
        'FPT.VN',
      );
      if (result?.quoteResponse?.result?.length > 0) {
        setYahoo(myYahoo);
        navigation.goBack();
      }
    } catch (e) {
      Alert.alert('提示', 'Cookie 或 Crumb 有误，请重新填写', [{text: '确认'}]);
      console.log('YahooAuth onSavePress error: ', e);
    }
  };
  return (
    <View style={{flex: 1}}>
      <ToolBar
        title={'Yahoo Cookies Auth'}
        onBackPress={() => {
          navigation.goBack();
        }}
      />
      <View style={{height: 1, backgroundColor: '#d8d8d8'}} />
      <View style={styles.view}>
        <Text style={{fontSize: 16, color: '#333', fontWeight: '500'}}>
          Yahoo Crumb
        </Text>
        <TextInput
          style={styles.input}
          value={myYahoo.crumb}
          onChangeText={text => setMyYahoo({...myYahoo, crumb: text})}
        />
        <View style={{height: 20}} />
        <Text style={{fontSize: 16, color: '#333', fontWeight: '500'}}>
          Yahoo Cookie
        </Text>
        <TextInput
          style={[styles.input, {flex: 1}]}
          multiline={true}
          value={myYahoo.cookies}
          onChangeText={text => setMyYahoo({...myYahoo, cookies: text})}
        />
      </View>
      <Flex horizontal>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => {
            setMyYahoo({cookies: '', crumb: ''});
          }}
          style={{
            ...styles.button,
            margin: 15,
            borderColor: theme,
            borderWidth: 1,
          }}>
          <Text style={{color: theme, fontSize: 16}}>清空</Text>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={onSavePress}
          style={{...styles.button, margin: 15, backgroundColor: theme}}>
          <Text style={{color: '#fff', fontSize: 16}}>保存</Text>
        </TouchableOpacity>
      </Flex>
      <View style={{height: insets.bottom, backgroundColor: '#fff'}} />
    </View>
  );
};

const styles = StyleSheet.create({
  view: {
    backgroundColor: '#fff',
    flex: 1,
    padding: 15,
  },
  line: {
    height: 1,
    backgroundColor: '#eee',
  },
  button: {
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    flex: 1,
  },
  input: {
    textAlignVertical: 'top',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginTop: 12,
    fontSize: 14,
    color: '#333',
  },
});

export default YahooAuth;
