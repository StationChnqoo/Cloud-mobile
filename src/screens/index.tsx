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
import BottomTabs from '@src/screens/BottomTabs';
import Home from './Home';
import My from './My';
import EditPost from './EditPost';
import Posts from './Posts';
import ChooseCategory from './ChooseCategory';
import EditCategory from './EditCategory';
import Webviewer from './Webviewer';
import SectorStocks from './SectorStocks';
import ChooseGlobal from './ChooseGlobal';

export type RootStacksParams = {
  BottomTabs: undefined;
  Login: undefined;
  App: undefined;
  EditWallet: {id: string};
  Wallets: undefined;
  My: undefined;
  Home: undefined;
  EditPost: {id: string};
  Posts: undefined;
  ChooseCategory: {id: string};
  EditCategory: {id: string};
  Webviewer: {title: string; url: string; injectedJavaScript?: string};
  SectorStocks: {code: string; name: string};
  ChooseGlobal: undefined;
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
        <RootStack.Screen name="EditPost" component={EditPost} />
        <RootStack.Screen name="Posts" component={Posts} />
        <RootStack.Screen name="ChooseCategory" component={ChooseCategory} />
        <RootStack.Screen name="EditCategory" component={EditCategory} />
        <RootStack.Screen name="Webviewer" component={Webviewer} />
        <RootStack.Screen name="SectorStocks" component={SectorStocks} />
        <RootStack.Screen name="ChooseGlobal" component={ChooseGlobal} />
      </RootStack.Navigator>
    </NavigationContainer>
  );
}
