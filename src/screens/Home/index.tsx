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
import Wallets from '../Wallets';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {TWallet} from '@src/constants/t';
import Button from '@src/components/Button';

interface MyProps {
  navigation: RootStacksProp;
}

const Home: React.FC<MyProps> = ({navigation}) => {
  const {setToken, theme} = useCaches();

  useEffect(() => {}, []);

  const onWalletPress = (item: TWallet) => {
    navigation.navigate('EditWallet', {id: item.id});
  };
  return (
    <View style={styles.view}>
      <View style={{height: useSafeAreaInsets().top}} />
      <Wallets onWalletPress={onWalletPress} />
      <Button
        title={'新增'}
        style={{
          backgroundColor: theme,
          height: 44,
          borderRadius: 10,
          margin: 12,
        }}
        textStyle={{color: '#fff'}}
        onPress={() => {
          navigation.navigate('EditWallet');
        }}
      />
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

export default Home;
