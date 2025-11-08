import Button from '@src/components/Button';
import {useCaches} from '@src/stores';
import React, {useEffect} from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';
import Card from '../Card';

interface MyProps {
  onLoginPress: (logined: boolean) => void;
}

const Profile: React.FC<MyProps> = props => {
  const {theme, setTheme, user, token} = useCaches();
  const {onLoginPress} = props;

  useEffect(() => {
    return function () {};
  }, []);

  const logined = token ? true : false;
  // const logined = true;
  return (
    <Card title={'😄こんにちは'}>
      <View style={{height: 6}} />
      <View style={{flexDirection: 'row', alignItems: 'flex-end'}}>
        {logined ? (
          <Image source={{uri: user.avatar}} style={styles.avatar} />
        ) : (
          <View style={styles.avatar} />
        )}
        <View style={{width: 12}} />
        <View
          style={{
            flex: 1,
            height: 58,
            justifyContent: 'space-around',
          }}>
          <Text style={{color: '#333', fontWeight: '500', fontSize: 16}}>
            {user?.name || '请登录'}
          </Text>
          <Text style={{color: '#666', fontSize: 14}} numberOfLines={1}>
            {user?.id ? `ID: ${user?.id}` : '请点击登录按钮进行登录 ~'}
          </Text>
        </View>
        <Button
          title={logined ? '退出' : '登录'}
          textStyle={{color: 'white', fontSize: 14}}
          style={[
            styles.button,
            {
              backgroundColor: theme,
            },
          ]}
          onPress={() => {
            onLoginPress(logined);
          }}
        />
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  circle: {
    height: 20,
    width: 20,
    marginRight: 12,
    borderRadius: 10,
  },
  button: {
    borderRadius: 5,
    height: 28,
    paddingHorizontal: 10,
  },
  avatar: {
    height: 58,
    width: 58,
    backgroundColor: '#eee',
    borderRadius: 29,
  },
});

export default Profile;
