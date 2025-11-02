import {useFocusEffect} from '@react-navigation/native';
import Flex from '@src/components/Flex';
import {TWallet} from '@src/constants/t';
import {useCaches} from '@src/stores';
import {useCallback, useMemo, useState} from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Popover from 'react-native-popover-view';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {RootStacksProp} from '..';
import Posts from '../Posts';
import Wallets from '../Wallets';
import Tabs from '@src/components/Tabs';

interface MyProps {
  navigation: RootStacksProp;
}

const Data: React.FC<MyProps> = ({navigation}) => {
  const {token, setToken, theme} = useCaches();
  const [tabIndex, setTabIndex] = useState(0);
  const [newPopover, setNewPopover] = useState(false);

  useFocusEffect(
    useCallback(() => {
      if (token) {
      } else {
        navigation.navigate('Login');
      }
    }, [token]),
  );

  const onWalletPress = (item: TWallet) => {
    navigation.navigate('EditWallet', {id: item.id});
  };

  const menus = [
    {icon: require('./assets/wallet.png'), label: '记资产'},
    {icon: require('./assets/notepad.png'), label: '记笔记'},
  ];

  const onNewPress = (index: number) => {
    setNewPopover(false);
    let handlers = {
      0: () => {
        navigation.navigate('EditWallet');
      },
      1: () => {
        navigation.navigate('EditPost');
      },
    };
    handlers[index]();
  };

  const currentComponent = useMemo(() => {
    return [<Wallets onWalletPress={onWalletPress} />, <Posts />][tabIndex];
  }, [tabIndex]);
  return (
    <View style={styles.view}>
      <View style={{height: useSafeAreaInsets().top}} />
      <Flex
        horizontal
        justify={'space-between'}
        style={{paddingHorizontal: 16}}>
        <Tabs
          tabs={[
            {label: '钱包', value: 1},
            {label: '笔记', value: 2},
          ]}
          onPress={setTabIndex}
          index={tabIndex}
        />
        <Popover
          isVisible={newPopover}
          backgroundStyle={{backgroundColor: 'transparent'}}
          onRequestClose={() => setNewPopover(false)}
          popoverStyle={{backgroundColor: 'rgba(0, 0, 0, 0.9)', padding: 12}}
          from={
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                setNewPopover(true);
              }}>
              <Image
                source={require('./assets/add.png')}
                style={{height: 16, width: 16, tintColor: theme}}
              />
            </TouchableOpacity>
          }>
          {menus.map((it, i) => (
            <TouchableOpacity
              key={i}
              activeOpacity={0.8}
              onPress={() => {
                onNewPress(i);
              }}>
              <Flex horizontal>
                <Image
                  source={it.icon}
                  style={{height: 18, width: 18, tintColor: '#fff'}}
                />
                <View style={{width: 12}} />
                <Text style={{color: '#fff', fontSize: 16}}>{it.label}</Text>
              </Flex>
              {i == menus.length - 1 ? null : (
                <View
                  style={{
                    marginVertical: 10,
                    height: 1,
                    backgroundColor: '#999',
                  }}
                />
              )}
            </TouchableOpacity>
          ))}
        </Popover>
      </Flex>
      {/* <View style={{height: 1, backgroundColor: 'ccc'}} /> */}
      {currentComponent}
    </View>
  );
};

const styles = StyleSheet.create({
  view: {
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

export default Data;
