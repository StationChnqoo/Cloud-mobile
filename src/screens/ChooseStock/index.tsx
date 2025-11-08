import React, {useState} from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import {RouteProp} from '@react-navigation/native';
import Button from '@src/components/Button';
import ToolBar from '@src/components/ToolBar';

import x from '@src/constants/x';
import {useQuery} from '@tanstack/react-query';
import {useCaches} from '@src/constants/store';
import {RootStacksParams, RootStacksProp} from '../Screens';
import {DfcfService} from '@src/service';
import {RealTimePrice, SearchStockResult} from '@src/constants/t';

interface MyProps {
  navigation?: RootStacksProp;
  route?: RouteProp<RootStacksParams, 'ChooseStock'>;
}

const ChooseStock: React.FC<MyProps> = props => {
  const {navigation, route} = props;
  const {theme, cared, setCared} = useCaches();
  const [id, setId] = useState(route.params?.id || '');
  
  const [selectedItem, setSelectedItem] = useState<SearchStockResult>(
    Object.assign({}),
  );

  const searchQuery = useQuery({
    queryKey: ['selectDfcfStockSearcher', id],
    queryFn: () => new DfcfService().selectSearcher(id),
  });

  const stockDetailQuery = useQuery({
    queryKey: [
      'stockDetailQuery',
      `${selectedItem.market}.${selectedItem.code}`,
    ],
    queryFn: () =>
      new DfcfService().selectRealtimePrice(
        `${selectedItem.market}.${selectedItem.code}`,
      ),
  });

  const onConfirmPress = () => {
    let stock: RealTimePrice = stockDetailQuery.data.data;
    // Toast.show('HelloWorld.');
    if (cared.some(it => it == stock.f57)) {
      // Toaster.show('此股票已在自选列表中 ~');
    } else {
      setCared([...cared, `${stock.f107}.${stock.f57}`]);
      // Toaster.show('添加成功 ~');
      navigation.goBack();
    }
  };

  const result = (searchQuery.data?.result || []) as SearchStockResult[];
  return (
    <View style={{flex: 1}}>
      <ToolBar
        title={'编辑'}
        onBackPress={() => {
          navigation.goBack();
        }}
      />
      <View style={{height: 12}} />
      <View style={{paddingHorizontal: 12}}>
        <View style={[x.Styles.rowCenter()]}>
          <TextInput
            style={styles.input}
            placeholder={'请输入6位股票代码'}
            value={id}
            onChangeText={s => {
              setId(s);
              setSelectedItem(Object.assign({}));
            }}
          />
          <View style={{width: 12}} />
          <Button
            title={'确定'}
            disabled={selectedItem?.code ? false : true}
            onPress={onConfirmPress}
            style={{
              backgroundColor: theme,
              borderRadius: 12,
              height: 32,
              paddingHorizontal: 12,
            }}
            textStyle={{color: '#fff'}}
          />
        </View>
      </View>
      <View style={{height: 12}} />
      <ScrollView
        showsVerticalScrollIndicator={true}
        removeClippedSubviews={false}>
        {result.map((it, i) => (
          <TouchableOpacity
            key={`${it.market}.${it.code}`}
            style={[
              styles.view,
              {
                borderColor:
                  JSON.stringify(selectedItem) == JSON.stringify(it)
                    ? theme
                    : '#ccc',
              },
            ]}
            activeOpacity={x.Touchable.OPACITY}
            onPress={() => {
              setSelectedItem(it);
            }}>
            <View style={[x.Styles.rowCenter('space-between'), {flex: 1}]}>
              <View style={[x.Styles.rowCenter('flex-start'), {flex: 1}]}>
                <Text style={{fontSize: 14, color: '#333'}}>{it.code}</Text>
                <Text style={{color: '#999'}}> | </Text>
                <Text
                  style={{
                    fontSize: 16,
                    color: '#333',
                    fontWeight: '500',
                    flex: 1,
                  }}
                  numberOfLines={1}>
                  {it.shortName}
                </Text>
              </View>
              <View style={{width: 12}} />
              <Text style={{color: '#666', fontSize: 14}}>
                {it.securityTypeName}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#fff',
    // margin: 12,
    fontSize: 16,
    paddingVertical: 0,
    height: x.scale(36),
    paddingHorizontal: 12,
    flex: 1,
  },
  view: {
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: '#fff',
    // marginTop: 6,
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 6,
    marginHorizontal: 12,
  },
});

export default ChooseStock;
