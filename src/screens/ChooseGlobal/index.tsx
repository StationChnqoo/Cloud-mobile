import {RouteProp} from '@react-navigation/native';
import ToolBar from '@src/components/ToolBar';
import {useCaches} from '@src/stores';
import {OtherCountryStock} from '@src/constants/t';
import {useQuery} from '@tanstack/react-query';
import {produce} from 'immer';
import React, {useEffect, useState} from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {RootStacksParams, RootStacksProp} from '..';
import DfcfService from '@src/services/DfcfService';
import Flex from '@src/components/Flex';
import {renderUpOrDown} from '@src/constants/u';
import {GlobalIndexes} from '@src/constants/config';

interface MyProps {
  navigation?: RootStacksProp;
  route?: RouteProp<RootStacksParams, 'ChooseGlobal'>;
}

const ChooseGlobal: React.FC<MyProps> = props => {
  const {navigation, route} = props;
  const {theme, global, setGlobal} = useCaches();
  const [datas, setDatas] = useState<any>(Object.assign({}));
  const [key, setKey] = useState('');
  // useFocusEffect(useCallback(() => {}, [sound]));

  const otherCountryStocksQuery = useQuery({
    enabled: true,
    queryKey: ['otherCountryStocksQuery', key],
    queryFn: () =>
      new DfcfService().selectOtherCountryStocks(
        datas[key].value.map(it => it.value),
      ),
    placeholderData: {data: {diff: []}},
  });

  useEffect(() => {
    setDatas(JSON.parse(JSON.stringify(GlobalIndexes)));
    setKey(Object.keys(GlobalIndexes)[0]);
    return function () {};
  }, []);

  return (
    <View style={{flex: 1}}>
      <ToolBar
        title={'全球指数'}
        onBackPress={() => {
          navigation.goBack();
        }}
      />
      <View style={{height: 1, backgroundColor: '#eee'}} />
      <View style={styles.view}>
        <View style={{flexDirection: 'row', flex: 1}}>
          <View style={{width: 108, justifyContent: 'flex-start'}}>
            {Object.keys(datas).map((it, i) => {
              let indexes = datas[it].value.filter((si: any) =>
                global.includes(si.value),
              );
              return (
                <TouchableOpacity
                  key={i}
                  onPress={() => {
                    setKey(it);
                  }}
                  style={[
                    {
                      backgroundColor: key == it ? '#fff' : '#f5f5f5',
                    },
                  ]}
                  activeOpacity={0.8}>
                  <Flex style={{height: 36}}>
                    <Text
                      style={{
                        fontSize: 14,
                        color: key == it ? theme : '#666',
                      }}>
                      {datas[it].name}
                      {indexes.length == 0 ? '' : `（${indexes.length}）`}
                    </Text>
                  </Flex>
                </TouchableOpacity>
              );
            })}
          </View>
          <View style={{width: 1, height: '100%', backgroundColor: '#eee'}} />
          <ScrollView removeClippedSubviews={false}>
            <View style={styles.indexes}>
              {key &&
                (
                  otherCountryStocksQuery.data.data.diff as OtherCountryStock[]
                ).map((it, i) => {
                  let thisKey = `${it.f13}.${it.f12}`;
                  let checked = global.some(si => si == thisKey);
                  let globalIndex = global.findIndex(si => si == thisKey);
                  // console.log(it);
                  return (
                    <TouchableOpacity
                      key={i}
                      activeOpacity={0.8}
                      style={[
                        styles.index,
                        {borderColor: checked ? theme : '#ccc'},
                      ]}
                      onPress={() => {
                        let _datas = produce(global, draft => {
                          let index = draft.findIndex(si => si == thisKey);
                          if (index >= 0) {
                            draft.splice(index, 1);
                          } else {
                            draft.push(thisKey);
                          }
                        });
                        setGlobal(_datas);
                      }}>
                      <Text
                        style={{
                          fontSize: 14,
                          color: checked ? theme : '#666',
                          flex: 1,
                        }}
                        numberOfLines={1}>
                        {/* {it.f13}.{it.f12}.{it.f14} */}
                        {globalIndex >= 0 ? `${globalIndex + 1}.` : ''}
                        {it.f14}
                      </Text>
                      <View style={{width: 4}} />
                      <Flex horizontal justify="flex-start">
                        <Text style={{color: '#999'}}>
                          {(it.f2 / 100).toFixed(2)}
                        </Text>
                      </Flex>
                      <Text style={{color: '#999'}}> | </Text>
                      <Text style={{color: renderUpOrDown(it.f3).color}}>
                        {(it.f3 / 100).toFixed(2)}%{renderUpOrDown(it.f3).label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
            </View>
          </ScrollView>
        </View>
      </View>
      <View style={{height: useSafeAreaInsets().bottom}} />
    </View>
  );
};

const styles = StyleSheet.create({
  view: {
    flex: 1,
    backgroundColor: '#fff',
    position: 'relative',
  },
  index: {
    height: 32,
    paddingHorizontal: 12,
    marginVertical: 6,
    borderWidth: 1,
    borderColor: '#ccc',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    borderRadius: 5,
  },
  indexes: {
    // alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 6,
  },
});

export default ChooseGlobal;
