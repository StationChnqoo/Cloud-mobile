import ToolBar from '@src/components/ToolBar';

import {RouteProp} from '@react-navigation/native';
import {useCaches} from '@src/stores';
import React, {useEffect, useRef, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import WebView from 'react-native-webview';
import {RootStacksParams, RootStacksProp} from '..';

interface MyProps {
  navigation?: RootStacksProp;
  route?: RouteProp<RootStacksParams, 'Webviewer'>;
}

const Webviewer: React.FC<MyProps> = props => {
  const {} = props.route.params;
  const {navigation, route} = props;
  const {theme} = useCaches();
  const [progress, setProgress] = useState(0);
  const [isShowProgressBar, setIsShowProgressBar] = useState(false);
  const webViewRef = useRef(null);

  useEffect(() => {
    return function () {};
  }, []);
  const injectedJavaScript =
    route.params?.injectedJavaScript || `(function() {})();`;
  // useFocusEffect(useCallback(() => {}, [sound]));
  return (
    <View style={{flex: 1}}>
      <ToolBar
        // avoidStatusBar
        title={route.params.title}
        onBackPress={() => navigation.goBack()}
      />
      <View style={styles.view}>
        <WebView
          ref={webViewRef}
          source={{uri: route.params.url}}
          style={{flex: 1}}
          allowFileAccess={false}
          automaticallyAdjustContentInsets={true}
          allowsBackForwardNavigationGestures={false}
          cacheEnabled={false}
          scalesPageToFit={true}
          geolocationEnabled={false}
          javaScriptEnabled={true}
          onLoadProgress={e => {
            setProgress(e.nativeEvent.progress);
          }}
          onLoadStart={() => setIsShowProgressBar(true)}
          onLoadEnd={() => setIsShowProgressBar(false)}
          pullToRefreshEnabled={false}
          javaScriptCanOpenWindowsAutomatically={false}
          setDisplayZoomControls={false}
          injectedJavaScript={injectedJavaScript}
          onLoad={() => {
            webViewRef.current?.injectJavaScript(injectedJavaScript);
          }}
          onMessage={e => {
            console.log(e.nativeEvent.data);
          }}
        />
      </View>
      <View
        style={{height: useSafeAreaInsets().bottom, backgroundColor: '#fff'}}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  view: {
    flex: 1,
    backgroundColor: 'white',
    position: 'relative',
  },
});

export default Webviewer;
