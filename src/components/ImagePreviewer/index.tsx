import {BottomSheet} from '@src/components';
import {BottomSheeterRef} from '@src/components/BottomSheeter';
import {useCaches} from '@src/constants/store';
import React, {forwardRef, useEffect, useState} from 'react';
import {Dimensions, Image, Platform} from 'react-native';
import Animated from 'react-native-reanimated';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

interface MyProps {
  show: boolean;
  src: string;
  width?: number;
  onClose: () => void;
}

const ImagePreviewer: React.FC<MyProps> = props => {
  const {src, width = Dimensions.get('screen').width, show, onClose} = props;
  const {theme} = useCaches();
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (src) {
      Image.getSize(src, (w, h) => {
        setHeight(
          Math.min((width * h) / w, Dimensions.get('screen').height * 0.618),
        );
      });
    }
  }, [src, width]);

  return (
    <BottomSheet show={show} onClose={onClose}>
      <Animated.View
        style={{
          borderTopLeftRadius: 15,
          borderTopRightRadius: 15,
          backgroundColor: 'rgba(0, 0, 0, 0.58)',
          paddingBottom: Platform.select({
            ios: useSafeAreaInsets().bottom,
            android: 0,
          }),
        }}>
        {height > 0 && (
          <Animated.Image
            source={{uri: src}}
            style={[
              {
                width: '100%',
                height,
              },
            ]}
            resizeMode="contain"
          />
        )}
      </Animated.View>
    </BottomSheet>
  );
};

export default ImagePreviewer;
