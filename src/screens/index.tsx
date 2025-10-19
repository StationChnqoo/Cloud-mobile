import {
  createNavigationContainerRef,
  NavigationContainer,
} from '@react-navigation/native';
import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from '@react-navigation/native-stack';

import * as React from 'react';
import Login from './Login';
import App from '../../App';
import EditWallet from './EditWallet';
import Wallets from './Wallets';
import BottomTabs from '@src/services/BottomTabs';
import Home from './Home';
import My from './My';

export type RootStacksParams = {
  BottomTabs: undefined;
  Login: undefined;
  App: undefined;
  EditWallet: {id: string};
  Wallets: undefined;
  My: undefined;
  Home: undefined;
};

const RootStack = createNativeStackNavigator<RootStacksParams>();

export type RootStacksProp = NativeStackNavigationProp<RootStacksParams>;
export const navigationRef = createNavigationContainerRef<RootStacksParams>();

export default function Screens() {
  // const navigator = useNavigationContainerRef();
  // useFlipper(navigator);
  return (
    <NavigationContainer ref={navigationRef}>
      <RootStack.Navigator
        id={undefined}
        screenOptions={{
          animation: 'slide_from_right',
          animationDuration: 618,
          headerShown: false,
        }}>
        <RootStack.Screen name="BottomTabs" component={BottomTabs} />
        <RootStack.Screen name="Home" component={Home} />
        <RootStack.Screen name="App" component={App} />
        <RootStack.Screen name="Login" component={Login} />
        <RootStack.Screen name="EditWallet" component={EditWallet} />
        <RootStack.Screen name="Wallets" component={Wallets} />
        <RootStack.Screen name="My" component={My} />
      </RootStack.Navigator>
    </NavigationContainer>
  );
}
