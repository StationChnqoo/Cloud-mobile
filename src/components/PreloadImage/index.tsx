import React, {useState, useEffect} from 'react';
import {
  Image,
  ImageBackground,
  StyleProp,
  StyleSheet,
  ViewStyle,
} from 'react-native';

interface MyProps {
  style: StyleProp<ViewStyle>;
  uri: string;
}

const PreloadImage: React.FC<MyProps> = props => {
  const {style, uri} = props;
  const [loadedUri, setLoadedUri] = useState('');

  return (
    <ImageBackground
      source={{uri: loadedUri || uri}}
      style={[styles.image, style]}
      resizeMode='stretch'>
      <Image
        source={{uri}}
        style={styles.hiddenImage}
        onLoad={() => setLoadedUri(uri)}
      />
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  image: {
    position: 'relative',
  },
  hiddenImage: {
    width: 0,
    height: 0,
    position: 'absolute',
  },
});

export default PreloadImage;
