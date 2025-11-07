import {RootStacksProp} from '@src/screens';
import React from 'react';
import {
  Image,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

interface MyProps {
  navigation?: RootStacksProp;
  title: String;
  onBackPress?: () => void;
}

const IMAGE_SIZE = 16;
const ToolBar: React.FC<MyProps> = props => {
  const {title, onBackPress} = props;
  const insets = useSafeAreaInsets();
  return (
    <View style={{backgroundColor: '#fff'}}>
      <View
        style={{
          backgroundColor: '#fff',
          height: Platform.select({
            ios: insets.top,
            android: StatusBar.currentHeight,
          }),
        }}
      />
      <View style={styles.views}>
        <TouchableOpacity
          activeOpacity={0.9}
          hitSlop={{
            top: 12,
            bottom: 12,
            left: 12,
            right: 12,
          }}
          onPress={() => {
            onBackPress?.();
          }}>
          <Image
            source={require('@src/assets/images/common/arrow_left.png')}
            style={{height: IMAGE_SIZE, width: IMAGE_SIZE, tintColor: '#666'}}
          />
        </TouchableOpacity>
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
        <View style={{width: IMAGE_SIZE}} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  views: {
    flexDirection: 'row',
    alignItems: 'center',
    display: 'flex',
    paddingHorizontal: 12,
    justifyContent: 'space-between',
    paddingVertical: 10,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
    marginHorizontal: 16,
  },
});

export default ToolBar;
