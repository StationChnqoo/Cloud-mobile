import React from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';

import Flex from '../Flex';
import {useCaches} from '@src/stores';
import {PicGoSrc} from '@src/constants/t';
import {dip2px} from '@src/constants/u';
import useFile from '@src/hooks/useFile';

interface MyProps {
  src: PicGoSrc;
  onDelete: (src: PicGoSrc) => void;
  onPreview: (uri: string) => void;
  onEdit: (id: string) => void;
}

const PicGoFile: React.FC<MyProps> = props => {
  const {src, onDelete, onPreview, onEdit} = props;
  const {theme} = useCaches();
  const {file} = useFile(src);

  return (
    <Flex key={src.id} justify="space-between" horizontal style={styles.view}>
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => {
          onPreview(src.url);
        }}>
        <Image source={file.src} style={[styles.src]} />
      </TouchableOpacity>
      <View style={{width: 12}} />
      <View
        style={{
          flex: 1,
          height: 40,
          justifyContent: 'space-around',
        }}>
        <Text style={{fontSize: 14, color: '#333'}} numberOfLines={1}>
          {src.name}
        </Text>
        <Flex horizontal justify={'space-between'}>
          <Text style={{fontSize: 12, color: '#666'}}>
            {`${(src.size / 1024 / 1024).toFixed(2)}MB | ${src.updateAt}`}
          </Text>
        </Flex>
      </View>
      <View style={{width: 12}} />
      <Flex horizontal>
        <View>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              onEdit(src.id);
            }}>
            <Image
              source={require('@src/assets/images/common/arrow_edit.png')}
              style={{height: 20, width: 20, tintColor: theme}}
            />
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              onDelete(src);
            }}>
            <Image
              source={require('@src/assets/images/common/arrow_delete.png')}
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
  src: {
    height: dip2px(52),
    width: dip2px(52),
    borderRadius: 5,
  },
});

export default PicGoFile;
