import x from '@src/constants/x';
import {memo, useEffect, useState} from 'react';
import {StyleProp, StyleSheet, View, ViewStyle} from 'react-native';

interface MyProps {
  value: number;
  style?: StyleProp<ViewStyle>;
  children: React.ReactNode;
}

const ZDView = memo((props: MyProps) => {
  const [backgroundColor, setBackgroundColor] = useState('#fff');
  const {value, style, children} = props;
  const [n, setN] = useState(0);

  useEffect(() => {
    const timer = performance.now();
    let frameId: number;
    const updateColor = () => {
      let color = value > n ? x.Color.RED : value < n ? x.Color.GREEN : '#fff';
      setBackgroundColor(x.Colors.hex2Rgba(color, 0.18));
    };
    const resetColor = () => {
      setBackgroundColor('#fff');
    };
    // 更新背景颜色的逻辑
    updateColor();
    // 使用requestAnimationFrame控制更新，模拟定时器效果
    const loop = () => {
      frameId = requestAnimationFrame(loop);
      // 每帧检查时间是否达到1秒，达到1秒后重置背景颜色
      if (performance.now() - timer >= 1000) {
        setN(value); // 更新n
        resetColor(); // 重置颜色
        cancelAnimationFrame(frameId); // 停止帧更新
      }
    };
    // 启动循环
    loop();
    // 清理函数
    return () => cancelAnimationFrame(frameId);
  }, [value, n]);

  return (
    <View style={[styles.view, style, {backgroundColor}]}>{children}</View>
  );
});

const styles = StyleSheet.create({
  view: {},
});

export default ZDView;
