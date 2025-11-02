import Flex from '@src/components/Flex';
import PreloadImage from '@src/components/PreloadImage';
import {useCaches} from '@src/stores';
import {RealTimePrice} from '@src/constants/t';
import {renderUpOrDown} from '@src/constants/u';
import React from 'react';
import {
  ActivityIndicator,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

interface MyProps {
  datas: RealTimePrice[];
  onPress: (fd: RealTimePrice) => void;
}

const Global: React.FC<MyProps> = props => {
  const {datas, onPress} = props;
  const {theme} = useCaches();

  // log.debug('Datas: ', datas);
  return (
    <View
      style={{
        ...styles.view,
      }}>
      {datas.length == 0 ? (
        <Flex style={{flex: 1}}>
          <ActivityIndicator color={theme} />
        </Flex>
      ) : (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={true}
          alwaysBounceHorizontal
          style={{gap: 12, marginHorizontal: 12}}>
          {datas
            .filter(it => (it?.f57 ? true : false))
            .map((it, i) => (
              <Flex style={{}} key={i}>
                <View style={{height: 5}} />
                <Text style={{fontSize: 14, color: '#333', fontWeight: '500'}}>
                  {it.f58}
                </Text>
                <View style={{height: 5}} />
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Text style={{fontSize: 12, color: '#333'}}>
                    {`${(it.f43 / Math.pow(10, it.f59)).toFixed(it.f59)}`}
                  </Text>
                  <Text style={{color: '#999'}}> | </Text>
                  <Text
                    style={{
                      fontSize: 12,
                      color: renderUpOrDown(it.f170).color,
                    }}>
                    {`${(it.f170 / 100).toFixed(2)}%${
                      renderUpOrDown(it.f170).label
                    }`}
                  </Text>
                </View>
                <View style={{height: 4}} />
                <PreloadImage
                  uri={`https://webquotepic.eastmoney.com/GetPic.aspx?nid=${
                    it.f107
                  }.${it.f57}&imageType=RTOPSH&_${Math.ceil(
                    new Date().getTime() / 10000,
                  )}`}
                  style={{
                    height: (Dimensions.get('window').width / 3) * 0.58,
                    width: Dimensions.get('window').width / 3,
                  }}
                />
                <View style={{height: 5}} />
              </Flex>
            ))}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  view: {
    position: 'relative',
    alignItems: 'center',
    backgroundColor: 'white',
    // marginHorizontal: '3%',
    // borderRadius: 12,
  },
  stock: {
    paddingHorizontal: 15,
    borderRadius: 12,
    backgroundColor: '#fff',
    height: 63,
    paddingVertical: 4,
    justifyContent: 'space-around',
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
  dots: {
    position: 'absolute',
    right: 12,
    top: 12,
    // borderRadius: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.58)',
    justifyContent: 'center',
    alignItems: 'center',
    borderTopRightRadius: 5,
    borderBottomLeftRadius: 5,
    height: 20,
    width: 36,
  },
});

export default Global;
