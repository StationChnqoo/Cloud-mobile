import React from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';

import {Flex} from '@src/components';
import {useCaches} from '@src/constants/store';
import {PicGoSrc} from '@src/constants/t';
import {miniPicGo} from '@src/constants/u';
import moment from 'moment';

interface MyProps {
  src: PicGoSrc;
  onDelete: (id: string) => void;
  onPreview: (uri: string) => void;
  onMoveUp: (id: string) => void;
  onMoveDown: (id: string) => void;
  onEdit: (id: string) => void;
}

const PicGoFile: React.FC<MyProps> = props => {
  const {src, onDelete, onPreview, onMoveDown, onMoveUp, onEdit} = props;
  const {theme, setUser} = useCaches();

  return (
    <Flex key={src.id} justify="space-between" horizontal style={styles.view}>
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => {
          onPreview(src.url);
        }}>
        <Image
          source={{uri: miniPicGo(src.url)}}
          style={{
            height: 48,
            width: 48,
            borderRadius: 4,
          }}
        />
      </TouchableOpacity>
      <View style={{width: 12}} />
      <View
        style={{
          flex: 1,
          height: 40,
          justifyContent: 'space-around',
        }}>
        <Text style={{fontSize: 14, color: '#333'}} numberOfLines={1}>
          {src.title}
        </Text>
        <Flex horizontal justify={'space-between'}>
          <Text style={{fontSize: 12, color: '#666'}}>
            {`${(src.size / 1024).toFixed(2)}KB | ${moment(
              src.date,
            ).fromNow()}`}
          </Text>
        </Flex>
      </View>
      <View style={{width: 12}} />
      <Flex horizontal>
        <View>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => {
              onEdit(src.id);
            }}>
            <Image
              source={require('@src/assets/images/common/arrow_edit.png')}
              style={{height: 20, width: 20, tintColor: theme}}
            />
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => {
              onDelete(src.id);
            }}>
            <Image
              source={require('@src/assets/images/common/arrow_delete.png')}
              style={{height: 20, width: 20, tintColor: theme}}
            />
          </TouchableOpacity>
        </View>
        <View style={{width: 4}} />
        <View>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => {
              onMoveUp(src.id);
            }}>
            <Image
              source={require('@src/assets/images/common/move_up.png')}
              style={{height: 20, width: 20, tintColor: theme}}
            />
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => {
              onMoveDown(src.id);
            }}>
            <Image
              source={require('@src/assets/images/common/move_down.png')}
              style={{height: 20, width: 20, tintColor: theme}}
            />
          </TouchableOpacity>
        </View>
      </Flex>
    </Flex>
  );
};

const styles = StyleSheet.create({
  view: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
});

export default PicGoFile;
