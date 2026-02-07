import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Flex from '../Flex';
import {useCaches} from '@src/stores';
import BottomSheet from '../BottomSheet';
import {setKeyboardMode} from '@src/native/KeyboardModule';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

interface MyProps {
  title: string;
  message: string;
  show: boolean;
  value?: string;
  onClose: () => void;
  onShow?: () => void;
  onHide?: () => void;
  onConfirm?: (s: string) => void;
}

const InputDialog: React.FC<MyProps> = props => {
  const {title, message, value, onConfirm, show, onClose, onHide, onShow} =
    props;
  const {theme} = useCaches();
  const [text, setText] = useState('');
  const input = React.useRef<TextInput>(null);
  const insets = useSafeAreaInsets();
  // 显示时改为 adjustPan 避免底部被遮挡，关闭时恢复 adjustResize

  useEffect(() => {
    if (show) {
      setKeyboardMode('adjustPan');
    } else {
      setKeyboardMode('adjustResize');
    }
  }, [show]);

  return (
    <BottomSheet
      show={show}
      onClose={() => {
        setKeyboardMode('adjustResize');
        onClose();
      }}
      onShow={() => {
        setText(value);
        input.current?.focus();
        onShow?.();
      }}
      onHide={onHide}>
      <View style={[styles.view]}>
        <Text style={{color: '#333', fontWeight: '500', fontSize: 16}}>
          {title}
        </Text>
        <View style={{height: 10}} />
        <Text style={{color: '#333', fontSize: 14}}>{message}</Text>
        <View style={{height: 15}} />
        <TextInput
          ref={input}
          style={styles.input}
          placeholder={''}
          value={text}
          onChangeText={setText}
          underlineColorAndroid={'transparent'}
        />
        <View style={{height: 30}} />
        <Flex horizontal justify={'flex-end'}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              setKeyboardMode('adjustResize');
              onClose();
            }}
            hitSlop={{bottom: 12, left: 12, top: 12, right: 12}}>
            <Text style={{color: '#999', fontSize: 16}}>取消</Text>
          </TouchableOpacity>
          <View style={{width: 24}} />
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              onConfirm?.(text);
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
  view: {
    backgroundColor: 'white',
    padding: 16,
  },
  input: {
    borderWidth: 1,
    padding: 0,
    height: 36,
    fontSize: 16,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 5,
  },
});

export default InputDialog;
