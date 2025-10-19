import {useCaches} from '@src/stores';
import {useEffect} from 'react';
import {StyleSheet, View} from 'react-native';
import {RootStacksProp} from '..';

interface MyProps {
  navigation: RootStacksProp;
}

const My: React.FC<MyProps> = ({navigation}) => {
  const {setToken} = useCaches();

  useEffect(() => {}, []);

  return <View style={styles.view}></View>;
};

const styles = StyleSheet.create({
  view: {},
});

export default My;
