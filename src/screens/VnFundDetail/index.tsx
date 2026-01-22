import YahooService from '@src/services/YahooService';
import {useCaches} from '@src/stores';
import _ from 'lodash';
import {use, useEffect, useState} from 'react';
import {
  FlatList,
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

  const [cookie, setCookie] = useState(
    `GUC=AQEBCAFpcyJppEIcswRn&s=AQAAAIRYnMD7&g=aXHREA; A1=d=AQABBKpfoWgCEGajuXd9l--403wdLKCZn2QFEgEBCAEic2mkaWChyyMA_eMDAAcIql-haKCZn2Q&S=AQAAAgnKAnX81kxNcsaI9kp0jgY; A3=d=AQABBKpfoWgCEGajuXd9l--403wdLKCZn2QFEgEBCAEic2mkaWChyyMA_eMDAAcIql-haKCZn2Q&S=AQAAAgnKAnX81kxNcsaI9kp0jgY; A1S=d=AQABBKpfoWgCEGajuXd9l--403wdLKCZn2QFEgEBCAEic2mkaWChyyMA_eMDAAcIql-haKCZn2Q&S=AQAAAgnKAnX81kxNcsaI9kp0jgY; gpp=DBAA; gpp_sid=-1; axids=gam=y-Nt8QxHlE2uJYwT1c9H4YfYaKC0N807H_~A&dv360=eS13d0haTXpORTJ1SFFZb0szUU9vYmpScnVHUkVPWUZ4MH5B&ydsp=y-Z.l1i8ZE2uJZdSuhTkxoyA4mcA2knQxw~A&tbla=y-D45mccJE2uJ7M2FQc7dnSrWwgdeLHmUR~A; tbla_id=cc8194ee-f8d4-4550-a0ad-1a2686694879-tuctf9bf5b1; _ga_BNW7Q63BME=GS2.1.s1769067216$o1$g1$t1769067227$j49$l0$h0; _ga=GA1.1.1320792746.1769066762; _ga_YD9K1W9DLN=GS2.1.s1769068902$o2$g1$t1769068921$j41$l0$h0; PRF=t%3DHPG.VN%252BFPT.VN%26dock-collapsed%3Dtrue; fes-ds-session=pv%3D4; _ga_LHGXQCMSKY=GS2.1.s1769070983$o2$g1$t1769070984$j59$l0$h0; cmp=t=1769081923&j=0&u=1---`,
  );

  const loadVnFunds = async () => {
    let result = await new YahooService().selectVnFunds(cookie, fundCodes);
    console.log('loadVnFunds: ', result?.quoteResponse?.result || []);
    setDatas(result?.quoteResponse?.result || []);
    setCalcString(
      DefaultVnFunds.map(it => {
        const data = result?.quoteResponse?.result.find(
          d => d.symbol === it.code,
        );
        return `${data?.regularMarketChangePercent?.toFixed(2)}% x ${
          it.weight
        }`;
      }).join(' + '),
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
        <Text style={{color: '#333', fontSize: 16, fontWeight: '500'}}>
          估值如下：
        </Text>
        <Text style={{color: '#666', marginTop: 8, fontSize: 14}}>
          {`(${calcString} ) / ${RateSum.toFixed(2)}`}
        </Text>
        <Text
          style={{
            color: rud.color,
            fontFamily: Fonts.digital,
            fontSize: 32,
          }}>
          ≈ {(total / RateSum).toFixed(2)}%
        </Text>
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
        <Text style={{color: '#999', fontSize: 14}}>
          #{index + 1}&nbsp;&nbsp;
          <Text style={{color: '#333', fontSize: 14, fontWeight: '500'}}>
            {DefaultVnFunds[index].label}
          </Text>
        </Text>
        <View style={{height: 4}} />
        <Flex horizontal>
          <Text
            style={{fontSize: 12, color: '#666', flex: 1}}
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
