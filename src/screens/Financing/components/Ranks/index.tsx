import {useCaches} from '@src/stores';
import React, {useEffect} from 'react';
import {ActivityIndicator, Alert, StyleSheet, Text, View} from 'react-native';
import Item from './components/Item';
import {renderUpOrDown} from '@src/constants/u';
import Flex from '@src/components/Flex';

interface MyProps {
  diff: any[];
  onPress: (item: any) => void;
}

const Ranks: React.FC<MyProps> = props => {
  const {diff, onPress} = props;
  const {theme, holdFundCodes, setHoldFundCodes} = useCaches();

  let up = diff.filter(it => it.f3 > 0);
  let down = diff.filter(it => it.f3 < 0);
  let average = diff.reduce((sum, it) => sum + it.f3, 0);

  const onLongPress = (item: any) => {
    const isAlreadyHold = holdFundCodes.includes(item.f12);
    Alert.alert(
      isAlreadyHold ? '取消持有' : '添加持有',
      `是否${isAlreadyHold ? '取消' : '添加'}对 "${item.f12}.${
        item.f14
      }" 的持有？`,
      [
        {
          text: '取消',
          style: 'cancel',
        },
        {
          text: isAlreadyHold ? '取消持有' : '添加持有',
          onPress: () => toggleHold(item),
        },
      ],
    );
  };

  const toggleHold = (item: any) => {
    // Toggle the hold status of the fund code
    // If the fund code is already in holdFundCodes, remove it; otherwise, add it
    console.log('Toggling hold for:', holdFundCodes);
    if (holdFundCodes.includes(item.f12)) {
      setHoldFundCodes(holdFundCodes.filter(code => code !== item.f12));
    } else {
      setHoldFundCodes([...holdFundCodes, item.f12]);
    }
  };

  return (
    <View style={styles.view}>
      {diff.length == 0 ? (
        <ActivityIndicator color={theme} />
      ) : (
        <>
          <Flex horizontal justify="space-between">
            <Text style={{fontSize: 16, color: '#333', fontWeight: '500'}}>
              板块
            </Text>
            <Flex horizontal>
              <Text
                style={{
                  fontSize: 14,
                  color: 'red',
                }}>
                {`${((up.length / diff.length) * 100).toFixed(2)}%↑`}
              </Text>
              <Text style={{color: '#ccc'}}> | </Text>
              <Text
                style={{
                  fontSize: 14,
                  color: 'green',
                }}>
                {`${((down.length / diff.length) * 100).toFixed(2)}%↓`}
              </Text>
              <Text style={{color: '#ccc'}}> | </Text>
              <Text
                style={{
                  color: '#666',
                  fontSize: 14,
                }}>
                {`均值${(average / diff.length).toFixed(2)}%${
                  renderUpOrDown(average).label
                }`}
              </Text>
            </Flex>
          </Flex>
          <View style={{height: 12}} />
          <Text style={{fontSize: 14, color: '#333', fontWeight: '500'}}>
            持有
          </Text>
          <View style={{height: 5}} />
          {holdFundCodes.length == 0 ? (
            <Text style={{color: '#999', fontSize: 12}}>
              暂无持有板块，长按添加持有
            </Text>
          ) : (
            <View style={styles.items}>
              {diff
                .filter(it => holdFundCodes.includes(it.f12))
                .sort((a, b) => Math.abs(b.f3) - Math.abs(a.f3))
                .map((it, i) => (
                  <Item
                    key={i}
                    it={it}
                    max={Math.max(
                      Math.abs(
                        it.f3 / Math.max(...diff.map(it => Math.abs(it.f3))),
                      ),
                    )}
                    onPress={onPress}
                    onLongPress={onLongPress}
                  />
                ))}
            </View>
          )}
          <View style={{height: 12}} />
          <Text style={{fontSize: 14, color: '#333', fontWeight: '500'}}>
            未持有
          </Text>
          <View style={{height: 5}} />
          <View style={styles.items}>
            {diff
              .filter(it => !holdFundCodes.includes(it.f12))
              .sort((a, b) => Math.abs(b.f3) - Math.abs(a.f3))
              .map((it, i) => (
                <Item
                  key={i}
                  it={it}
                  max={Math.max(
                    Math.abs(
                      it.f3 / Math.max(...diff.map(it => Math.abs(it.f3))),
                    ),
                  )}
                  onPress={onPress}
                  onLongPress={onLongPress}
                />
              ))}
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  view: {
    backgroundColor: 'white',
    // borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  items: {
    flexDirection: 'row',
    gap: 4,
    flexWrap: 'wrap',
  },
});

export default Ranks;
