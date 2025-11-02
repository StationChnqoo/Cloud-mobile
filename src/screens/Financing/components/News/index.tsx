import Flex from '@src/components/Flex';
import {useCaches} from '@src/stores';
import React from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import dayjs from 'dayjs';

interface Item {
  title: string;
  code: string;
  showTime: string;
  url: string;
  mediaName: string;
  npDst: string;
}
interface MyProps {
  datas: Item[];
  onPress: (item: Item) => void;
}

const News: React.FC<MyProps> = props => {
  const {datas, onPress} = props;
  const {theme} = useCaches();

  return (
    <View style={styles.view}>
      {datas.length == 0 ? (
        <ActivityIndicator color={theme} />
      ) : (
        <View>
          {datas.map((it, i) => (
            <TouchableOpacity
              key={i}
              activeOpacity={0.8}
              onPress={() => {
                onPress(it);
                console.log('Quick news: ', it);
              }}>
              <Flex
                justify={'space-between'}
                horizontal
                style={{marginVertical: 4}}>
                <Text
                  style={{flex: 1, color: '#333', fontSize: 14}}
                  numberOfLines={1}>
                  {it.title}
                </Text>
                <View style={{width: 12}} />
                <Text style={{color: '#999', fontSize: 12}}>
                  {dayjs(it.showTime).format('HH:mm')}
                </Text>
              </Flex>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  view: {
    backgroundColor: 'white',
    // borderRadius: 12,
    paddingVertical: 6,
    paddingHorizontal: 15,
    // marginHorizontal: '3%',
  },
  viewCounts: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  viewProgressBar: {
    height: 4,
    borderRadius: 2,
    marginHorizontal: 2,
  },
  textTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
});

export default News;
