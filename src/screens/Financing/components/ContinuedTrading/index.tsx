import {useIsFocused} from '@react-navigation/native';
import Flex from '@src/components/Flex';
import Tabs from '@src/components/Tabs';
import {RealTimePrice} from '@src/constants/t';
import {renderUpOrDown} from '@src/constants/u';
import DfcfService from '@src/services/DfcfService';
import {useCaches} from '@src/stores';
import {useQueries} from '@tanstack/react-query';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn'; // 如果需要中文
import relativeTime from 'dayjs/plugin/relativeTime';
import {useState} from 'react';
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

dayjs.extend(relativeTime);
dayjs.locale('zh-cn');

interface MyProps {
  onPress: (item: RealTimePrice) => void;
}

// new DfcfService().selectRealtimePrice(it.value)

const ContinuedTrading = (props: MyProps) => {
  const {onPress} = props;
  const {theme} = useCaches();
  const [tabIndex, setTabIndex] = useState(0);
  const focused = useIsFocused();
  const tabs = [
    {label: '黄金', value: 'hj'},
    {label: '债券', value: 'zq'},
    {label: '汇率', value: 'hl'},
  ];

  const indexes = {
    hj: [
      {
        icon: require('@src/assets/images/other/beans.png'),
        label: '黄金 --> 纽约期货',
        value: '101.GC00Y',
      },
      {
        icon: require('@src/assets/images/other/beans.png'),
        label: '黄金 --> 场内ETF',
        value: '118.AU9999',
      },
    ],
    zq: [
      {
        icon: require('@src/assets/images/other/battery_1.png'),
        label: '中国10年期国债',
        value: '171.CN10Y',
      },
      {
        icon: require('@src/assets/images/other/battery_3.png'),
        label: '中国30年期国债',
        value: '171.CN30Y',
      },
    ],
    hl: [
      {
        icon: require('@src/assets/images/other/cash_us.png'),
        label: '美元兑人民币汇率',
        value: '133.USDCNH',
      },
      {
        icon: require('@src/assets/images/other/cash_jp.png'),
        label: '人民币兑日元汇率',
        value: '120.JPYCNYC',
      },
    ],
  };

  const indexesQuery = useQueries({
    queries: indexes[tabs[tabIndex].value].map(it => ({
      queryKey: ['indexesQuery', tabIndex, it.value],
      refetchInterval: 10000,
      enabled: focused,
      queryFn: () => new DfcfService().selectRealtimePrice(it.value),
    })),
  });

  const datas = indexesQuery
    .filter(it => it.status == 'success' && it?.data)
    // @ts-ignore
    .map(it => it.data?.data);

  return (
    <View style={styles.views}>
      {datas.length == 0 ? (
        <ActivityIndicator color={theme} />
      ) : (
        <View>
          <Flex
            horizontal
            justify="space-between"
            style={{paddingHorizontal: 15}}>
            <Tabs tabs={tabs} index={tabIndex} onPress={setTabIndex} />
            <View />
          </Flex>
          {datas.map((data, index) => (
            <TouchableOpacity
              key={index}
              style={styles.view}
              activeOpacity={0.8}
              onPress={() => {
                onPress(data);
              }}>
              <Flex horizontal justify="space-between">
                <Flex horizontal style={{flex: 1, alignItems: 'center'}}>
                  <Image
                    source={indexes[tabs[tabIndex].value][index].icon}
                    style={{
                      height: 16,
                      width: 16,
                      tintColor: theme,
                    }}
                  />
                  <View style={{width: 6}} />
                  <Text
                    style={{
                      fontSize: 14,
                      color: '#333',
                      flex: 1,
                    }}
                    numberOfLines={1}>
                    {`${indexes[tabs[tabIndex].value][index].label} `}
                  </Text>
                </Flex>
                <Flex horizontal style={{flex: 1, alignItems: 'center'}}>
                  <Text
                    style={{
                      color: renderUpOrDown(data?.f169).color,
                      fontSize: 14,
                    }}>
                    {(index == datas.length - 1
                      ? 100 / (data?.f60 / 10000)
                      : data?.f60 / Math.pow(10, data.f59)
                    ).toFixed(data.f59)}
                  </Text>
                  <Text style={{color: '#999', marginHorizontal: 2}}>
                    {` | `}
                  </Text>
                  <Text
                    style={{
                      color: renderUpOrDown(data?.f170).color,
                      fontSize: 14,
                    }}>
                    {(data?.f170 / 100).toFixed(2)}%
                    {renderUpOrDown(data?.f170).label}
                  </Text>
                  <Text style={{color: '#999', marginHorizontal: 2}}>
                    {` | `}
                  </Text>
                  <Text style={{fontSize: 12, color: '#999'}}>
                    {dayjs(data?.f86 * 1000)
                      .fromNow()
                      .replace(' ', '')}
                  </Text>
                </Flex>
              </Flex>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  views: {
    // borderRadius: 12,
    backgroundColor: 'white',
    paddingVertical: 6,
    // marginHorizontal: '3%',
  },
  view: {
    backgroundColor: 'white',
    // borderRadius: 4,
    paddingVertical: 6,
    paddingHorizontal: 15,
    borderRadius: 4,
  },
  title: {
    color: '#333',
    fontSize: 16,
    fontWeight: '500',
    paddingHorizontal: 15,
    paddingVertical: 6,
  },
});

export default ContinuedTrading;
