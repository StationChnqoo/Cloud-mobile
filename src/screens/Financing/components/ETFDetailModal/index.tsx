import BottomSheet from '@src/components/BottomSheet';
import {RealTimePrice} from '@src/constants/t';
import {renderUpOrDown} from '@src/constants/u';
import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

interface MyProps {
  datas: RealTimePrice[];
  show: boolean;
  onClosePress: () => void;
}

const ETFDetailModal: React.FC<MyProps> = props => {
  const {datas, show, onClosePress} = props;
  const insets = useSafeAreaInsets();
  return (
    <BottomSheet show={show} onClose={onClosePress}>
      <View style={styles.view}>
        <View style={styles.items}>
          {[...datas]
            .sort((a, b) => a?.f170 - b?.f170)
            .map((it, i) => (
              <View key={i} style={styles.item}>
                <Text style={{fontSize: 14, color: '#333'}}>{it?.f58}</Text>
                <View style={{width: 4}} />
                <Text
                  style={{fontSize: 14, color: renderUpOrDown(it?.f170).color}}>
                  {it?.f170 || 0}🥚
                </Text>
              </View>
            ))}
        </View>
        <View style={{height: insets.bottom}} />
      </View>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  view: {
    borderRadius: 12,
    backgroundColor: 'white',
    padding: 12,
  },
  items: {
    // flexDirection: 'row',
    backgroundColor: 'white',
    // flexWrap: 'wrap',
    // justifyContent: 'space-between',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 2,
    marginVertical: 4,
    justifyContent: 'space-between',
  },
});

export default ETFDetailModal;
