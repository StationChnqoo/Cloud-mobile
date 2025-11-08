import Flex from '@src/components/Flex';
import React, {useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';

interface MyProps {
  children: React.ReactNode;
  title: string;
  moreView?: React.JSX.Element;
}

const Card: React.FC<MyProps> = props => {
  const [tab, setTab] = useState(0);
  const {children, title, moreView} = props;

  return (
    <View style={styles.view}>
      <Flex horizontal justify="space-between">
        <Text style={styles.text}>{title}</Text>
        {moreView}
      </Flex>
      <View style={{height: 4}} />
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  view: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    // marginHorizontal: '3%',
    // borderRadius: 12,
    backgroundColor: '#fff',
  },
  text: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
});

export default Card;
