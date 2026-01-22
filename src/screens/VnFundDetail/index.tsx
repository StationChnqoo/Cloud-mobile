import YahooService from '@src/services/YahooService';
import {useCaches} from '@src/stores';
import _ from 'lodash';
import {use, useEffect, useState} from 'react';
import {
  FlatList,
  Image,
  ListRenderItemInfo,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {RootStacksProp} from '..';
import ToolBar from '@src/components/ToolBar';
import {YahooStandardStock} from '@src/constants/t';
import {renderUpOrDown} from '@src/constants/u';
import Flex from '@src/components/Flex';
import {Fonts} from '@src/constants/config';
import PreloadImage from '@src/components/PreloadImage';

// 持仓数据来源：新浪财经
const DefaultVnFunds = [
  {label: 'FPT公司', code: 'FPT.VN', weight: 7.86},
  {label: '和发集团', code: 'GMD.VN', weight: 7.6},
  {label: '移动世界投资公司', code: 'MWG.VN', weight: 7.58},
  {label: '越南繁荣银行', code: 'VPB.VN', weight: 6.91},
  {label: '军队股份制商业银行', code: 'MBB.VN', weight: 6.37},
  {label: 'Vinhomes JSC', code: 'VHM.VN', weight: 6.15},
  {label: 'Masan Group Corp', code: 'MSN.VN', weight: 5.2},
  {label: '越南科技商业银行', code: 'TCB.VN', weight: 4.92},
  {label: '越南工商股份制商业银行', code: 'CTG.VN', weight: 4.64},
  {
    label: '胡志明市发展股份制商业银行',
    code: 'HDB.VN',
    weight: 4.1,
  },
];
const RateSum = DefaultVnFunds.reduce((sum, it) => sum + it.weight, 0);

interface MyProps {
  navigation: RootStacksProp;
}

const VnFundDetail: React.FC<MyProps> = props => {
  const {token, setToken, theme} = useCaches();
  const {navigation} = props;
  const [datas, setDatas] = useState<YahooStandardStock[]>([]);
  const fundCodes = DefaultVnFunds.map(it => it.code).join(',');
  const [r, setR] = useState(0);
  const [calcString, setCalcString] = useState('');
  const insets = useSafeAreaInsets();
  const {yahoo} = useCaches();
  const cookie = yahoo.cookies;
  const crumb = yahoo.crumb;
  const loadVnFunds = async () => {
    let result = await new YahooService().selectVnFunds(
      cookie,
      crumb,
      fundCodes,
    );
    console.log('loadVnFunds: ', result?.quoteResponse?.result || []);
    setDatas(result?.quoteResponse?.result || []);
    setCalcString(
      DefaultVnFunds.map(it => {
        const data = result?.quoteResponse?.result.find(
          d => d.symbol === it.code,
        );
        return `${
          data?.regularMarketChangePercent < 0
            ? `(${data?.regularMarketChangePercent?.toFixed(2)})`
            : data?.regularMarketChangePercent?.toFixed(2)
        }% x ${it.weight}`;
      }).join('+'),
    );
  };

  useEffect(() => {
    loadVnFunds();
  }, [r]);

  const renderHeader = () => {
    const total = datas.reduce((sum, it) => {
      const fund = DefaultVnFunds.find(f => f.code === it.symbol);
      if (fund) {
        return sum + (it.regularMarketChangePercent || 0) * (fund.weight || 0);
      }
      return sum;
    }, 0);

    const rud = renderUpOrDown(total / RateSum);
    return (
      <View
        style={{
          paddingHorizontal: 15,
          borderBottomWidth: 1,
          borderBottomColor: '#eee',
          paddingVertical: 10,
        }}>
        <Flex horizontal align="flex-end">
          <Text style={{color: '#666', fontSize: 12, flex: 1}}>
            <Text style={{color: '#333', fontSize: 14, fontWeight: '500'}}>
              估值：
            </Text>
            {`[${calcString}] / ${RateSum.toFixed(2)}`}
            <Text
              style={{
                color: rud.color,
                fontSize: 18,
              }}>
              {` ≈ ${(total / RateSum).toFixed(2)}`}%{rud.label}
            </Text>
          </Text>
          <View style={{width: 10}} />
          <PreloadImage
            uri={`https://webquotepic.eastmoney.com/GetPic.aspx?nid=100.VNINDEX&imageType=RTOPSH&_${Math.ceil(
              new Date().getTime() / 10000,
            )}`}
            style={{height: 68, width: 122}}
          />
        </Flex>
        <View style={{height: 10}} />
        <Flex horizontal justify="space-between" align="flex-end">
          <View style={{}}></View>
        </Flex>
        <View style={{height: 10}} />
        <Text style={{color: '#333', fontSize: 16, fontWeight: '500'}}>
          2025年第四季度持仓：
        </Text>
      </View>
    );
  };

  const renderItem = (info: ListRenderItemInfo<YahooStandardStock>) => {
    const {item, index} = info;
    const rud = renderUpOrDown(item.regularMarketChangePercent);
    return (
      <View style={{paddingVertical: 8, paddingHorizontal: 15}}>
        <Text style={{color: theme, fontSize: 14}}>
          #{index + 1}&nbsp;&nbsp;
          <Text style={{color: '#333', fontSize: 14, fontWeight: '500'}}>
            {DefaultVnFunds[index].label}
          </Text>
        </Text>
        <View style={{height: 4}} />
        <Flex horizontal>
          <Text
            style={{fontSize: 14, color: '#999', flex: 1}}
            numberOfLines={1}>
            {item.longName}
          </Text>
          <View style={{width: 12}} />
          <Text style={{color: rud.color, fontSize: 14}}>
            {item.regularMarketChangePercent?.toFixed(2)}%{rud.label}
          </Text>
        </Flex>
      </View>
    );
  };

  return (
    <View style={styles.view}>
      <ToolBar
        title={'估值小助手'}
        onBackPress={() => {
          navigation.goBack();
        }}
      />
      <View style={{height: 1, backgroundColor: '#eee'}} />
      <FlatList
        data={datas}
        renderItem={renderItem}
        ItemSeparatorComponent={() => (
          <View style={{height: 1, backgroundColor: '#eee'}} />
        )}
        refreshControl={
          <RefreshControl
            refreshing={false}
            onRefresh={() => {
              setR(Math.random());
            }}
          />
        }
        ListHeaderComponent={renderHeader()}
      />
      <View style={{height: insets.bottom, backgroundColor: '#fff'}} />
    </View>
  );
};

const styles = StyleSheet.create({
  view: {
    backgroundColor: '#fff',
    flex: 1,
  },
  input: {
    height: 36,
    padding: 0,
    margin: 0,
    backgroundColor: '#eee',
    paddingVertical: 0,
    paddingHorizontal: 12,
    borderRadius: 5,
    fontSize: 16,
  },
  line: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 5,
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#987123',
    borderRadius: 5,
    height: 44,
  },
});

export default VnFundDetail;
