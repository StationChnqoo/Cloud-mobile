import Flex from '@src/components/Flex';
import {calculateWalletFormSum} from '@src/constants/c';
import {TWallet} from '@src/constants/t';
import {renderUpOrDown} from '@src/constants/u';
import {StyleSheet, Text, View} from 'react-native';

interface MyProps {
  datas: TWallet[];
}

const Compare: React.FC<MyProps> = props => {
  const {datas} = props;
  let last = datas?.[0] || ({} as TWallet);
  let first = datas?.[datas.length - 1] || ({} as TWallet);
  let sh000001 = [first?.indexSh000001, last?.indexSh000001];
  let spx = [first?.indexSpx, last?.indexSpx];
  let sum = [calculateWalletFormSum(first), calculateWalletFormSum(last)];

  const renderItem = (label: string, value: string[], unit?: string) => {
    let rud = renderUpOrDown(Number(value[1]) - Number(value[0]));

    return (
      <Flex horizontal justify="space-between" style={{marginVertical: 4}}>
        <Flex horizontal justify="flex-start">
          <Text style={{color: '#333', fontSize: 14}}>{label}</Text>
          <View style={{width: 12}} />
          <Text
            style={{
              color: rud.color,
              fontSize: 14,
            }}>
            {value[0] + (unit || '')} → {value[1] + (unit || '')}
          </Text>
        </Flex>
        <Text
          style={{
            color: rud.color,
            fontSize: 14,
          }}>
          {(
            ((Number(value[1]) - Number(value[0])) / Number(value[0])) *
            100
          ).toFixed(2)}
          %{rud.label}
        </Text>
      </Flex>
    );
  };
  return datas.length >= 2 ? (
    <View style={styles.item}>
      {renderItem('总资产', sum, 'k')}
      {renderItem('上证指数', sh000001)}
      {renderItem('标普500指数', spx)}
    </View>
  ) : null;
};

const styles = StyleSheet.create({
  item: {
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
});
export default Compare;
