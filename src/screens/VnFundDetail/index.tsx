import CommonStockCard from '@src/components/CommonStockCard';
import Flex from '@src/components/Flex';
import ToolBar from '@src/components/ToolBar';
import {RealTimePrice, YahooStandardStock} from '@src/constants/t';
import {renderUpOrDown} from '@src/constants/u';
import DfcfService from '@src/services/DfcfService';
import YahooService from '@src/services/YahooService';
import {useCaches} from '@src/stores';
import {useEffect, useState} from 'react';
import {
  Dimensions,
  FlatList,
  ListRenderItemInfo,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {RootStacksProp} from '..';

// 持仓数据来源：新浪财经
const DefaultVnFunds = [
  {label: 'FPT公司', code: 'FPT.VN', weight: 7.86},
  {label: '和发集团', code: 'HPG.VN', weight: 7.6},
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
  const [baseIndex, setBaseIndex] = useState<RealTimePrice>({});

  const countAfterThisIndex = (index: number) => {
    let sum = 0;
    for (let i = index; i < DefaultVnFunds.length; i++) {
      sum += DefaultVnFunds[i].weight;
    }
    return sum;
  };

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

  const loadVnBaseIndex = async () => {
    let result = await new DfcfService().selectRealtimePrice('100.VNINDEX');
    console.log('loadVnBaseIndex: ', result.data);
    setBaseIndex(result?.data || {});
  };

  useEffect(() => {
    loadVnFunds();
    loadVnBaseIndex();
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
      <View style={styles.header}>
        <CommonStockCard
          item={{
            code: baseIndex.f57,
            name: baseIndex.f58,
            zdf: baseIndex.f170 / 100,
            currentPrice: baseIndex.f43 / Math.pow(10, baseIndex.f59),
            market: baseIndex.f107,
            updateTime: baseIndex.f86 * 1000,
          }}
          onPress={() => {}}
        />
        <View style={styles.line} />
        {datas.length == 0 ? null : (
          <Flex style={{marginTop: 10}} horizontal justify="space-between">
            <Text style={{color: '#333', fontSize: 14, fontWeight: '500'}}>
              2025第四季度持仓估值
            </Text>
            {/* {`[${calcString}]`} */}
            <Text
              style={{
                color: rud.color,
                fontWeight: '500',
                fontSize: 14,
              }}>
              {`${(total / 100).toFixed(2)}% 到 ${(total / RateSum).toFixed(
                2,
              )}`}
              %之间
            </Text>
          </Flex>
        )}
      </View>
    );
  };

  const renderItem = (info: ListRenderItemInfo<YahooStandardStock>) => {
    const {item, index} = info;
    const rud = renderUpOrDown(item.regularMarketChangePercent);
    return (
      <TouchableOpacity
        style={{
          paddingVertical: 8,
          paddingHorizontal: 15,
          position: 'relative',
        }}
        activeOpacity={0.8}
        onPress={() => {
          navigation.navigate('Webviewer', {
            title: item.symbol,
            url: `https://finance.yahoo.com/quote/${item.symbol}`,
          });
        }}>
        <Flex horizontal justify="space-between">
          <Text style={{color: theme, fontSize: 14}}>
            #{index + 1}&nbsp;&nbsp;
            <Text style={{color: '#333', fontSize: 14}}>
              {DefaultVnFunds[index].label}
              <Text style={{color: '#666'}}>{` (${DefaultVnFunds[
                index
              ].weight.toFixed(2)}%) `}</Text>
            </Text>
          </Text>
        </Flex>
        <View style={{height: 5}} />
        <Flex horizontal justify="space-between">
          <Text
            style={{fontSize: 14, color: '#999', flex: 1}}
            numberOfLines={1}>
            {item.longName}
          </Text>
          <View style={{width: 12}} />
          <Flex horizontal justify="flex-end" align="center">
            <Text style={{color: '#666'}}>
              {(item.regularMarketPrice * 0.00027).toFixed(2)}元/股
            </Text>
            <Text style={{color: theme}}> | </Text>
            <Text
              style={{
                fontWeight: '500',
                width: 72,
                textAlign: 'right',
                color: rud.color,
              }}>
              {item.regularMarketChangePercent?.toFixed(2)}%{rud.label}
            </Text>
          </Flex>
        </Flex>
        <Flex
          horizontal
          style={styles.rate}
          justify="flex-start"
          align="flex-end">
          <View
            style={[
              {
                height: 2,
                width: `${(countAfterThisIndex(index) / RateSum) * 100}%`,
                backgroundColor: rud.color,
              },
            ]}
          />
        </Flex>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.view}>
      <ToolBar
        title={`${baseIndex?.f57}.${baseIndex?.f58}` || '详情'}
        onBackPress={() => {
          navigation.goBack();
        }}
      />
      <View style={{height: 1, backgroundColor: '#eee'}} />
      <FlatList
        data={datas}
        renderItem={renderItem}
        ItemSeparatorComponent={() => (
          <View
            style={{height: 1, backgroundColor: '#eee', marginHorizontal: 15}}
          />
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
  header: {
    paddingHorizontal: 15,
    paddingVertical: 10,
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
    height: 36,
  },
  rate: {
    position: 'absolute',
    bottom: -1,
    left: 15,
    width: '100%',
  },
});

export default VnFundDetail;
