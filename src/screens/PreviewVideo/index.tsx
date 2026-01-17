import {RouteProp} from '@react-navigation/native';
import ToolBar from '@src/components/ToolBar';
import {useCaches} from '@src/stores';
import {useRef} from 'react';
import {StyleSheet, View} from 'react-native';
import VideoPlayer, {type VideoPlayerRef} from 'react-native-video-player';
import {RootStacksParams, RootStacksProp} from '..';

interface MyProps {
  navigation: RootStacksProp;
  route?: RouteProp<RootStacksParams, 'PreviewVideo'>;
}

const PreviewVideo: React.FC<MyProps> = ({navigation, route}) => {
  const {setToken} = useCaches();
  const playerRef = useRef<VideoPlayerRef>(null);

  return (
    <View style={{flex: 1}}>
      <ToolBar
        title={'详情'}
        onBackPress={() => {
          navigation.goBack();
        }}
      />
      <View style={{height: 1, backgroundColor: '#d8d8d8'}} />
      <View style={styles.view}>
        <VideoPlayer
          ref={playerRef}
          autoplay={true}
          // endWithThumbnail
          // disableControlsAutoHide={true}
          disableFullscreen={true}
          repeat={true}
          // thumbnail={{
          //   uri: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/BigBuckBunny.jpg',
          // }}
          source={{
            uri: route.params?.uri,
          }}
          onError={e => console.log(e)}
          showDuration={true}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  view: {
    backgroundColor: '#000',
    flex: 1,
  },
  line: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 5,
  },
});

export default PreviewVideo;
