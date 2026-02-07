import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import {Animated, BackHandler, Easing, Pressable, StyleSheet, View} from 'react-native';

export interface ModalProps {
  isVisible: boolean;
  children: React.ReactNode;
  onShow?: () => void;
  onBackdropPress?: () => void;
  onBackButtonPress?: () => void;
  onModalShow?: () => void;
  onModalHide?: () => void;
  animationIn?: 'fadeIn' | 'slideInUp' | 'slideInDown' | 'zoomIn';
  animationOut?: 'fadeOut' | 'slideOutUp' | 'slideOutDown' | 'zoomOut';
  animationInTiming?: number;
  animationOutTiming?: number;
  backdropOpacity?: number;
  backdropColor?: string;
  backdropTransitionInTiming?: number;
  backdropTransitionOutTiming?: number;
  style?: any;
  backdropStyle?: any;
  coverScreen?: boolean;
  useNativeDriver?: boolean;
  hideModalContentWhileAnimating?: boolean;
  hasBackdrop?: boolean;
  customBackdrop?: React.ReactNode;
}

export interface ModalRef {
  show: () => void;
  hide: () => void;
  isVisible: boolean;
}

const Modal = forwardRef<ModalRef, ModalProps>((props, ref) => {
  const {
    isVisible = false,
    children,
    onShow,
    onBackdropPress,
    onBackButtonPress,
    onModalShow,
    onModalHide,
    animationIn = 'fadeIn',
    animationOut = 'fadeOut',
    animationInTiming = 300,
    animationOutTiming = 300,
    backdropOpacity = 0.2,
    backdropColor = 'black',
    backdropTransitionInTiming = 300,
    backdropTransitionOutTiming = 300,
    style,
    backdropStyle,
    coverScreen = true,
    useNativeDriver = true,
    hideModalContentWhileAnimating = false,
    hasBackdrop = true,
    customBackdrop,
  } = props;

  const [visible, setVisible] = useState(isVisible);
  const [isMounted, setIsMounted] = useState(false);
  const contentAnim = useRef(new Animated.Value(0)).current;
  const backdropAnim = useRef(new Animated.Value(0)).current;
  const backHandler = useRef<any>(null);

  useImperativeHandle(ref, () => ({
    show: () => setVisible(true),
    hide: () => setVisible(false),
    isVisible: visible,
  }));

  useEffect(() => {
    setVisible(isVisible);
  }, [isVisible]);

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(contentAnim, {
          toValue: 1,
          duration: animationInTiming,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver,
        }),
        Animated.timing(backdropAnim, {
          toValue: 1,
          duration: backdropTransitionInTiming,
          useNativeDriver,
        }),
      ]).start(() => {
        onShow?.();
        onModalShow?.();
      });

      backHandler.current = BackHandler.addEventListener(
        'hardwareBackPress',
        handleBackButtonPress,
      );
    } else {
      Animated.parallel([
        Animated.timing(contentAnim, {
          toValue: 0,
          duration: animationOutTiming,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver,
        }),
        Animated.timing(backdropAnim, {
          toValue: 0,
          duration: backdropTransitionOutTiming,
          useNativeDriver,
        }),
      ]).start(() => {
        setIsMounted(false);
        onModalHide?.();
      });
    }
    return () => {
      backHandler.current?.remove();
    };
  }, [visible]);

  const handleBackButtonPress = () => {
    if (onBackButtonPress) {
      onBackButtonPress();
    } else {
      setVisible(false);
    }
    return true;
  };

  const handleBackdropPress = () => {
    console.log('backdrop pressed');
    if (onBackdropPress) {
      onBackdropPress();
    } else {
      setVisible(false);
    }
  };

  const getContentAnimation = () => {
    switch (animationIn) {
      case 'slideInUp':
        return {
          translateY: contentAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [300, 0],
          }),
        };
      case 'slideInDown':
        return {
          translateY: contentAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [-300, 0],
          }),
        };
      case 'zoomIn':
        return {
          scale: contentAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [0.5, 1],
          }),
        };
      case 'fadeIn':
      default:
        return {
          opacity: contentAnim,
        };
    }
  };

  const getOutAnimation = () => {
    switch (animationOut) {
      case 'slideOutUp':
        return {
          translateY: contentAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [0, -300],
          }),
        };
      case 'slideOutDown':
        return {
          translateY: contentAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 300],
          }),
        };
      case 'zoomOut':
        return {
          scale: contentAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [1, 0.5],
          }),
        };
      case 'fadeOut':
      default:
        return {
          opacity: contentAnim,
        };
    }
  };

  const currentAnimation = visible ? getContentAnimation() : getOutAnimation();
  const hasOpacity = currentAnimation.hasOwnProperty('opacity');
  const contentStyle = {
    opacity: hasOpacity ? currentAnimation.opacity : contentAnim,
    transform: hasOpacity ? undefined : [currentAnimation],
  };

  const backdropOpacityValue = backdropAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, backdropOpacity],
  });

  const renderBackdrop = () => {
    if (!hasBackdrop) return null;

    if (customBackdrop) {
      return (
        <Animated.View
          style={[StyleSheet.absoluteFill, {opacity: backdropOpacityValue}]}>
          {customBackdrop}
        </Animated.View>
      );
    }

    return (
      <Pressable style={StyleSheet.absoluteFill} onPress={handleBackdropPress}>
        <Animated.View
          style={[
            StyleSheet.absoluteFill,
            {backgroundColor: backdropColor, opacity: backdropOpacityValue},
            backdropStyle,
          ]}
          pointerEvents="none"
        />
      </Pressable>
    );
  };

  const shouldRenderContent = !hideModalContentWhileAnimating || visible;

  if (!isMounted && !visible) {
    return null;
  }

  return (
    <View style={[styles.container, coverScreen && styles.coverScreen]}>
      {renderBackdrop()}
      {shouldRenderContent && (
        <Animated.View
          pointerEvents="box-none"
          style={[styles.content, style, contentStyle]}>
          {children}
        </Animated.View>
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 9999,
  },
  coverScreen: {
    ...StyleSheet.absoluteFillObject,
  },
  content: {
    flex: 1,
  },
});

export default Modal;
