import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import relativeTime from 'dayjs/plugin/relativeTime';
import {useEffect} from 'react';
import {AppRegistry, StatusBar, View} from 'react-native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import 'react-native-get-random-values';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import Reactotron from 'reactotron-react-native';
import {reactotronRedux} from 'reactotron-redux';
import {name as appName} from './app.json';
import Screens from './src/screens';
import {Envs} from './src/constants/env';
import 'react-native-get-random-values';
import {nanoid} from 'nanoid';

dayjs.extend(relativeTime);
dayjs.locale('zh-cn');

const Cloud = () => {
  useEffect(() => {
    console.log('Config:', new Envs().all());
    for(let i = 0; i < 9; i++) {
      console.log('nanoid:', nanoid());
    }
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
              translucent={true}
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
