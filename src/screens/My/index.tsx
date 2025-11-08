import React, {useEffect} from 'react';
import {Alert, ScrollView, StyleSheet, View} from 'react-native';

import {useIsFocused} from '@react-navigation/native';
import {useCaches} from '@src/stores';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Global from './components/Global';
import Profile from './components/Profile';
import Setting from './components/Setting';
import Stocks from './components/Stocks';
import Services from '@src/services';
import {RootStacksProp} from '..';

interface MyProps {
  navigation?: RootStacksProp;
}

const My: React.FC<MyProps> = props => {
  const {navigation} = props;
  const {setUser, token, setToken} = useCaches();
  const focused = useIsFocused();

  const loadUser = async () => {
    let result = await new Services().selectUser();
    if (result?.data) {
      setUser(result.data);
    }
  };

  useEffect(() => {
    if (focused && token) {
      loadUser();
    }
    return function () {};
  }, [focused, token]);

  const onLoginPress = (logined: boolean) => {
    if (logined) {
      Alert.alert('提示', '确认要退出登录吗？', [
        {text: '取消'},
        {
          text: '确认',
          onPress: () => {
            setTimeout(() => {
              navigation.navigate('Login');
            }, 1000);
          },
        },
      ]);
    } else {
      navigation.navigate('Login');
    }
  };

  return (
    <View style={{flex: 1}}>
      <View
        style={{height: useSafeAreaInsets().top, backgroundColor: '#fff'}}
      />
      <ScrollView removeClippedSubviews={false} bounces={false}>
        <View style={{flex: 1}}>
          <View style={{height: 1}} />
          {[
            <Profile onLoginPress={onLoginPress} />,
            <Stocks
              onNewStockPress={() => {
                // navigation.navigate('ChooseStock');
              }}
            />,
            <Global
              onPress={() => {
                navigation.navigate('ChooseGlobal');
              }}
            />,
            // <Color />,
            <Setting {...props} />,
          ].map((it, i) => (
            <View key={i} style={{marginVertical: 1}}>
              {it}
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({});

export default My;
