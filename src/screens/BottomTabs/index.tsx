import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import {useFocusEffect} from '@react-navigation/native';
import {useCaches} from '@src/stores';
import React, {useCallback, useRef} from 'react';
import {Alert, Image, StyleSheet, TouchableOpacity, View} from 'react-native';
import {RootStacksProp} from '@src/screens';
import Wallets from '@src/screens/Wallets';
import Home from '@src/screens/Home';
import My from '@src/screens/My';
import Data from '../Data';
import Financing from '../Financing';

const Tab = createBottomTabNavigator();
interface MyProps {
  navigation?: RootStacksProp;
}

const BottomTabs = (props: MyProps) => {
  const {theme} = useCaches();
  const {navigation} = props;

  const screens = [
    {
      name: 'Financing',
      component: Financing,
      icon: require('./assets/menu_home.png'),
      label: '首页',
    },
    {
      name: 'Data',
      component: Data,
      icon: require('./assets/menu_friends.png'),
      label: '发现',
    },
    {
      name: 'My',
      component: My,
      icon: require('./assets/menu_me.png'),
      label: '我的',
    },
  ];

  useFocusEffect(
    useCallback(() => {
      // setIsShowNewModal(true);
      // navigation.navigate('VnFundDetail');
      return () => {};
    }, []),
  );

  return (
    <View style={{flex: 1}}>
      <Tab.Navigator id={undefined}>
        {screens.map((it, i) => (
          <Tab.Screen
            name={it.name}
            key={i}
            component={it.component}
            options={{
              headerShown: false,
              tabBarLabel: it.label,
              tabBarActiveTintColor: theme,
              tabBarIcon: ({color}) => (
                <Image
                  source={it.icon}
                  style={{height: 24, width: 24, tintColor: color}}
                />
              ),
            }}
          />
        ))}
      </Tab.Navigator>
    </View>
  );
};

const styles = StyleSheet.create({
});

export default BottomTabs;
