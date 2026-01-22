import React, {useState} from 'react';
import {Alert, StyleSheet, Text, TouchableOpacity, View} from 'react-native';

import Flex from '@src/components/Flex';
import {Envs} from '@src/constants/env';
import {RootStacksProp} from '@src/screens';
import {useCaches} from '@src/stores';
import Config from 'react-native-config';
import Card from '../Card';

interface MyProps {
  navigation?: RootStacksProp;
}

const Setting: React.FC<MyProps> = props => {
  const {theme, setTheme} = useCaches();
  const [colors, setColors] = useState([]);
  const {token} = useCaches();
  const {navigation} = props;

  const onYahooAuthPress = () => {
    navigation.navigate('YahooAuth');
  };

  const onClearPress = () => {
    Alert.alert('提示', '确认要清除数据缓存吗？', [
      {text: '取消', onPress: () => {}},
      {
        text: '确认',
        onPress: () => {},
      },
    ]);
  };

  return (
    <Card title={'设置'}>
      <View style={{height: 10}} />
      <Flex justify={'space-between'} horizontal>
        <Flex horizontal>
          <Text style={{fontSize: 14, color: '#333'}}>主题</Text>
          <View style={{width: 12}} />
          <Flex horizontal>
            {colors.map((it, i) => (
              <TouchableOpacity
                onPress={() => {
                  setTheme(it.value);
                }}
                key={i}>
                <View style={{...styles.dotColor, backgroundColor: it.value}} />
              </TouchableOpacity>
            ))}
          </Flex>
        </Flex>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => {
            // setColors(shuffle(x.COLORS).slice(0, 5));
          }}
          hitSlop={12}>
          <Text style={{color: theme, fontSize: 14}}>换一批</Text>
        </TouchableOpacity>
      </Flex>
      <View style={{height: 10}} />
      <Flex justify={'space-between'} horizontal>
        <Text style={{fontSize: 14, color: '#333'}}>清除数据缓存</Text>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={onClearPress}
          hitSlop={8}>
          <Text style={{color: theme, fontSize: 14}}>清除</Text>
        </TouchableOpacity>
      </Flex>
      <View style={{height: 10}} />
      <Flex horizontal justify="space-between">
        <Text style={{fontSize: 14, color: '#333'}}>系统变量</Text>
      </Flex>
      <View style={{height: 10}} />
      <Flex justify={'space-between'} horizontal>
        <Text style={{fontSize: 14, color: '#333'}}>Yahoo Auth</Text>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={onYahooAuthPress}
          hitSlop={8}>
          <Text style={{color: theme, fontSize: 14}}>设置</Text>
        </TouchableOpacity>
      </Flex>
      <View style={{height: 5}} />
      {Object.keys(new Envs().all()).map((it, i) => (
        <Flex
          key={i}
          horizontal
          justify="space-between"
          style={{marginVertical: 4}}>
          <Text style={{fontSize: 12, color: '#000'}}>{it}</Text>
          <View style={{width: 12}} />
          <Text
            style={{fontSize: 12, color: '#666', flex: 1, textAlign: 'right'}}
            numberOfLines={2}>
            {String(Config[it]) || 'N/A'}
          </Text>
        </Flex>
      ))}
    </Card>
  );
};

const styles = StyleSheet.create({
  dotColor: {
    height: 24,
    width: 24,
    borderRadius: 12,
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    margin: 1,
    padding: 1,
  },
  button: {
    height: 32,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
});

export default Setting;
