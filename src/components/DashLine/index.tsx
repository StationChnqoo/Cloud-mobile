import {Svg, Line} from 'react-native-svg';

interface MyProps {
  color?: string;
}

const DashLine: React.FC<MyProps> = props => {
  const {color = '#000'} = props;
  return (
    <Svg height="1" width="100%">
      <Line
        x1="0" // 起点横坐标
        y1="0" // 起点纵坐标
        x2="100%" // 终点横坐标
        y2="0" // 终点纵坐标
        stroke={color} // 颜色
        strokeWidth={1} // 粗细
        strokeDasharray="1 2" // 虚线模式：5px实线，3px空白
      />
    </Svg>
  );
};

export default DashLine;
