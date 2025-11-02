import {useCaches} from '@src/stores';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';

interface MyProps {
  index: number;
  tabs: any[];
  onPress: (index: number) => void;
}

const Tabs: React.FC<MyProps> = props => {
  const {index, tabs, onPress} = props;
  const {theme} = useCaches();
  return (
    <View style={styles.view}>
      {tabs.map((it, i) => {
        let checked = i == index;
        return (
          <TouchableOpacity
            key={i}
            activeOpacity={0.8}
            style={styles.item}
            onPress={() => {
              onPress(i);
            }}>
            <Text
              style={
                checked
                  ? {fontSize: 16, color: theme, fontWeight: '500'}
                  : {
                      fontSize: 16,
                      color: '#999',
                    }
              }>
              {it.label}
            </Text>
            <View style={{height: 5}} />
            <View
              style={[
                styles.dot,
                {backgroundColor: checked ? theme : 'trasparent'},
              ]}
            />
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  view: {
    // paddingHorizontal: 12,
    height: 44,
    flexDirection: 'row',
    gap: 15,
    backgroundColor: '#fff',
  },
  item: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    height: 2,
    width: 32,
    borderRadius: 1,
  },
});

export default Tabs;
