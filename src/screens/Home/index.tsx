import {StyleSheet, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {RootStacksProp} from '..';

interface MyProps {
  navigation: RootStacksProp;
}

const Home: React.FC<MyProps> = ({navigation}) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.view}>
      <View style={{height: insets.top, backgroundColor: '#fff'}} />
    </View>
  );
};

const styles = StyleSheet.create({
  view: {
    backgroundColor: '#fff',
    flex: 1,
  },
});

export default Home;
