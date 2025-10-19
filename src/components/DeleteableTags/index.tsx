import React from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Flex from '../Flex';

interface MyProps {
  datas: string[];
  onDelete: (index: number) => void;
}

const DeleteableTags: React.FC<MyProps> = props => {
  const {datas, onDelete} = props;
  return (
    <View style={styles.tags}>
      {datas.map((it, i) => (
        <Flex horizontal key={i} style={styles.tag}>
          <Text style={{color: '#333', fontSize: 16, paddingHorizontal: 5}}>
            {it}
          </Text>
          <TouchableOpacity
            activeOpacity={0.7}
            hitSlop={{top: 5, bottom: 5, left: 5, right: 5}}
            onPress={() => {
              onDelete(i);
            }}>
            <Image
              source={require('./assets/delete.png')}
              style={{height: 18, width: 18, tintColor: '#ccc'}}
            />
          </TouchableOpacity>
        </Flex>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 5,
    marginTop: 5,
  },
  tag: {
    borderRadius: 10,
    height: 32,
    borderWidth: 1,
    borderColor: '#ccc',
    paddingHorizontal: 4,
  },
});

export default DeleteableTags;
