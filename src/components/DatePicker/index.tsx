import dayjs from 'dayjs';
import {useEffect, useMemo, useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import ListView from './components/ListView';
import {DATE_YEAR_INIT, ITEM_HEIGHT} from './constants/c';
import {optionsBuilder} from './constants/u';
import BottomSheet from '../BottomSheet';
import Flex from '../Flex';
import {useCaches} from '@src/stores';

interface MyProps {
  date: string;
  onShow?: () => void;
  onCancel?: () => void;
  onConfirm?: (s: string) => void;
  onHide?: () => void;
  show: boolean;
}

const DatePicker = (props: MyProps) => {
  const {show, onCancel, onHide, onConfirm, date} = props;
  const [array, setArray] = useState<number[]>([]);
  const {theme} = useCaches();

  const onChange = (listIndex: number, itemIndex: number) => {
    let _array = [...array];
    _array[listIndex] = itemIndex;
    setArray(_array);
  };

  const dateString2Array = (t: string) => {
    let dates = (t ?? '')
      .split('-')
      // 偏移量
      .map((it, i) => Number(it) - [DATE_YEAR_INIT, 1, 1][i]);
    return dates;
  };

  const onShow = () => {
    setArray(dateString2Array(date || dayjs().format('YYYY-MM-DD')));
  };

  const isLeapYear = (year: number) => {
    return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
  };

  const days = useMemo(() => {
    return [
      0,
      31,
      isLeapYear(Number(array?.[0]) || DATE_YEAR_INIT) ? 29 : 28,
      31,
      30,
      31,
      30,
      31,
      31,
      30,
      31,
      30,
      31,
    ][Number(array?.[1] || 1)];
  }, [array]);

  const current = () => {
    console.log(array, options);
    return array.map((it, i) => options?.[i]?.[it]?.value).join('-');
  };

  const options = useMemo(() => {
    let result = Array(3).fill([]);
    result[0] = optionsBuilder(199, DATE_YEAR_INIT);
    result[1] = optionsBuilder(12, 1);
    result[2] = optionsBuilder(days, 1);
    return result;
  }, [array]);

  useEffect(() => {
    // 越界 -> 当前选择的日 > 当月总天数
    // 例如：12-31，只切换了月份
    if (array.length == 3 && Number(array[2]) > days) {
      onChange(2, days);
    }
    return function () {};
  }, [array]);

  return (
    <BottomSheet show={show} onShow={onShow} onClose={onCancel}>
      <View style={{padding: 16}}>
        <View style={{height: 12}} />
        <Text style={{color: '#333', fontSize: 16, fontWeight: '500'}}>
          请选择日期
        </Text>
        <View style={{height: 16}} />
        <View style={{flexDirection: 'row', gap: 12, height: ITEM_HEIGHT * 6}}>
          {array.map((it, i) => {
            return (
              <ListView
                key={i}
                data={options[i]}
                onChange={index => {
                  onChange(i, index);
                }}
                index={it}
              />
            );
          })}
        </View>
        <View style={{height: 30}} />
        <Flex horizontal justify={'flex-end'}>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={onCancel}
            hitSlop={{bottom: 12, left: 12, top: 12, right: 12}}>
            <Text style={{color: '#999', fontSize: 16}}>取消</Text>
          </TouchableOpacity>
          <View style={{width: 24}} />
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => {
              onConfirm(current());
            }}
            hitSlop={{bottom: 12, left: 12, top: 12, right: 12}}>
            <Text style={{color: theme, fontSize: 16}}>确认</Text>
          </TouchableOpacity>
        </Flex>
      </View>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  views: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default DatePicker;
