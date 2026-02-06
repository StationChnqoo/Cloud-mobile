import {useCaches} from '@src/stores';
import dayjs from 'dayjs';
import {useEffect, useMemo, useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import BottomSheet from '../BottomSheet';
import Flex from '../Flex';
import ListView from './components/ListView';
import {DATE_YEAR_INIT, ITEM_HEIGHT} from './constants/c';
import {optionsBuilder} from './constants/u';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

type DatePickerMode = 'year' | 'month' | 'date' | 'datetime' | 'time';

interface MyProps {
  date?: string;
  mode?: DatePickerMode;
  onShow?: () => void;
  onCancel?: () => void;
  onConfirm?: (s: string) => void;
  onHide?: () => void;
  show: boolean;
}

const DateTimePicker = (props: MyProps) => {
  const {show, onCancel, onHide, onConfirm, date, mode: propsMode} = props;
  const {theme} = useCaches();
  const insets = useSafeAreaInsets();

  // 根据 date 格式自动判断 mode
  const autoDetectMode = (): DatePickerMode => {
    if (propsMode) return propsMode;
    if (!date) return 'date';
    const parts = date.split(' ');
    const dateParts = parts[0].split('-');
    // 只有时间部分，没有日期部分
    if (dateParts.length === 1 && dateParts[0].includes(':')) {
      return 'time';
    }
    if (dateParts.length === 1) return 'year';
    if (dateParts.length === 2) return 'month';
    if (dateParts.length === 3 && parts[1]) return 'datetime';
    return 'date';
  };

  const mode = autoDetectMode();

  const dateString2Array = (t: string) => {
    const value = t ?? dayjs().format('YYYY-MM-DD');
    const parts = value.split(' ');

    // time 模式：只有时间部分
    if (mode === 'time') {
      const timeParts = parts[0].split(':');
      return [0, 0, 0, Number(timeParts[0]), Number(timeParts[1])];
    }

    const dateParts = parts[0].split('-');
    const result = [
      Number(dateParts[0]) - DATE_YEAR_INIT,
      Number(dateParts[1]) - 1,
      Number(dateParts[2]) - 1,
    ];

    if (parts[1]) {
      const timeParts = parts[1].split(':');
      result.push(Number(timeParts[0]), Number(timeParts[1]));
    } else {
      result.push(0, 0);
    }

    return result;
  };

  const [yearIndex, setYearIndex] = useState(0);
  const [monthIndex, setMonthIndex] = useState(0);
  const [dayIndex, setDayIndex] = useState(0);
  const [hourIndex, setHourIndex] = useState(0);
  const [minuteIndex, setMinuteIndex] = useState(0);

  const onShow = () => {
    const [yi, mi, di, hi, mini] = dateString2Array(
      date || (mode === 'time' ? '00:00' : dayjs().format('YYYY-MM-DD')),
    );
    setYearIndex(yi);
    setMonthIndex(mi);
    setDayIndex(di);
    setHourIndex(hi);
    setMinuteIndex(mini);
  };

  const isLeapYear = (year: number) => {
    return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
  };

  const days = useMemo(() => {
    const year = yearIndex + DATE_YEAR_INIT;
    const month = monthIndex + 1;
    const isLeap = isLeapYear(year);
    return [0, 31, isLeap ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][
      month
    ];
  }, [yearIndex, monthIndex]);

  const yearOptions = useMemo(() => optionsBuilder(199, DATE_YEAR_INIT), []);
  const monthOptions = useMemo(() => optionsBuilder(12, 1), []);
  const dayOptions = useMemo(() => optionsBuilder(days, 1), [days]);
  const hourOptions = useMemo(() => optionsBuilder(24, 0), []);
  const minuteOptions = useMemo(() => optionsBuilder(60, 0), []);

  const handleYearChange = (index: number) => {
    setYearIndex(index);
  };

  const handleMonthChange = (index: number) => {
    const newDays = (() => {
      const year = yearIndex + DATE_YEAR_INIT;
      const month = index + 1;
      const isLeap = isLeapYear(year);
      return [0, 31, isLeap ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][
        month
      ];
    })();

    setMonthIndex(index);

    if (mode === 'date' && dayIndex >= newDays) {
      console.log(
        'DatePicker: 切换月份时调整日期从',
        dayIndex + 1,
        '到',
        newDays,
      );
      setDayIndex(newDays - 1);
    }
  };

  const handleDayChange = (index: number) => {
    setDayIndex(index);
  };

  const handleHourChange = (index: number) => {
    setHourIndex(index);
  };

  const handleMinuteChange = (index: number) => {
    setMinuteIndex(index);
  };

  useEffect(() => {
    if (mode === 'date' && dayIndex >= days) {
      console.log('DatePicker: 自动调整日期从', dayIndex + 1, '到', days);
      setDayIndex(days - 1);
    }
  }, [days, mode]);

  const current = () => {
    const year = yearOptions[yearIndex]?.value;
    const month = monthOptions[monthIndex]?.value;
    const day = dayOptions[dayIndex]?.value;
    const hour = hourOptions[hourIndex]?.value;
    const minute = minuteOptions[minuteIndex]?.value;
    console.log('current:', {
      mode,
      year,
      month,
      day,
      hour,
      minute,
      yearIndex,
      monthIndex,
      dayIndex,
      hourIndex,
      minuteIndex,
    });

    if (mode === 'year') {
      return year;
    } else if (mode === 'month') {
      return `${year}-${month}`;
    } else if (mode === 'date') {
      return `${year}-${month}-${day}`;
    } else if (mode === 'time') {
      return `${hour}:${minute}`;
    }
    return `${year}-${month}-${day} ${hour}:${minute}`;
  };

  const getTitle = () => {
    if (mode === 'year') return '请选择年份';
    if (mode === 'month') return '请选择年月';
    if (mode === 'datetime') return '请选择日期时间';
    if (mode === 'time') return '请选择时间';
    return '请选择日期';
  };

  return (
    <BottomSheet show={show} onShow={onShow} onClose={onCancel}>
      <View style={{padding: 15, backgroundColor: '#fff'}}>
        <View style={{height: 5}} />
        <Text style={{color: '#333', fontSize: 16, fontWeight: '500'}}>
          {getTitle()}
        </Text>
        <View style={{height: 16}} />
        <View style={{flexDirection: 'row', gap: 5, height: ITEM_HEIGHT * 6}}>
          {mode !== 'time' && (
            <ListView
              data={yearOptions}
              onChange={handleYearChange}
              index={yearIndex}
            />
          )}
          {mode !== 'year' && mode !== 'time' && (
            <ListView
              data={monthOptions}
              onChange={handleMonthChange}
              index={monthIndex}
            />
          )}
          {(mode === 'date' || mode === 'datetime') && (
            <ListView
              data={dayOptions}
              onChange={handleDayChange}
              index={dayIndex}
            />
          )}
          {(mode === 'datetime' || mode === 'time') && (
            <>
              <ListView
                data={hourOptions}
                onChange={handleHourChange}
                index={hourIndex}
              />
              <ListView
                data={minuteOptions}
                onChange={handleMinuteChange}
                index={minuteIndex}
              />
            </>
          )}
        </View>
        <View style={{height: 30}} />
        <Flex horizontal justify={'flex-end'}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={onCancel}
            hitSlop={{bottom: 12, left: 12, top: 12, right: 12}}>
            <Text style={{color: '#999', fontSize: 16}}>取消</Text>
          </TouchableOpacity>
          <View style={{width: 24}} />
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              onConfirm(current());
            }}
            hitSlop={{bottom: 12, left: 12, top: 12, right: 12}}>
            <Text style={{color: theme, fontSize: 16}}>确认</Text>
          </TouchableOpacity>
        </Flex>
        <View style={{height: insets.bottom}} />
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

export default DateTimePicker;
