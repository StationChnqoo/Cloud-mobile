import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import {AppRegistry, StatusBar, View} from 'react-native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import 'react-native-get-random-values';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {name as appName} from './app.json';
import Screens from './src/screens';
import {useEffect} from 'react';
import Config from 'react-native-config';
import {useCaches} from './src/stores';
import {MMKV} from 'react-native-mmkv';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import relativeTime from 'dayjs/plugin/relativeTime';
import Reactotron from 'reactotron-react-native';
import {reactotronRedux} from 'reactotron-redux';

dayjs.extend(relativeTime);
dayjs.locale('zh-cn');

const Cloud = () => {
  const {setConfig} = useCaches();

  useEffect(() => {
    console.log('Config:', Config.getConstants());
    setConfig(Config.getConstants());
  }, []);

  useEffect(() => {
    if (__DEV__) {
      Reactotron.configure().useReactNative().use(reactotronRedux()).connect();
    }
  }, []);
  return (
    <QueryClientProvider client={new QueryClient({})}>
      <GestureHandlerRootView style={{flex: 1}}>
        <SafeAreaProvider>
          <View style={{flex: 1}}>
            <StatusBar
              translucent={false}
              backgroundColor="transparent"
              barStyle="dark-content"
            />
            <Screens />
          </View>
        </SafeAreaProvider>
      </GestureHandlerRootView>
    </QueryClientProvider>
  );
};

AppRegistry.registerComponent(appName, () => Cloud);
