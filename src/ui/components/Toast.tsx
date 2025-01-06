import React, { useEffect, useState } from 'react';
import { Animated, Platform, Text } from 'react-native';
import PlatformName from '../../business-logic/model/enums/PlatformName';
import { Colors } from '../assets/colors/colors';
import styles from '../assets/styles/components/ToastStyles';

type ToastProps = {
  message: string;
  isVisible: boolean;
  setIsVisible: React.Dispatch<React.SetStateAction<boolean>>;
  duration?: number;
  isShowingError?: boolean;
};

const Toast = (props: ToastProps) => {
  const [slideAnim] = useState(new Animated.Value(60));

  const {
    message,
    isVisible,
    setIsVisible,
    duration = 2000,
    isShowingError = false,
  } = props;

  // Determine the correct driver for animations
  const getNativeDriver = () => Platform.OS !== PlatformName.Windows;

  const slideIn = () => {
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 500,
      useNativeDriver: getNativeDriver(),
    }).start();
  };

  const slideOut = () => {
    Animated.timing(slideAnim, {
      toValue: 60,
      duration: 500,
      useNativeDriver: getNativeDriver(),
    }).start(() => {
      setTimeout(() => setIsVisible(false), 500);
    });
  };

  useEffect(() => {
    if (isVisible) {
      slideIn();
      setTimeout(slideOut, duration);
    }
  }, [isVisible, duration]);

  return (
    <Animated.View
      style={[
        styles.toast,
        { transform: [{ translateY: slideAnim }] },
        { backgroundColor: isShowingError ? Colors.danger : Colors.success },
      ]}>
      <Text style={styles.text}>{message}</Text>
    </Animated.View>
  );
};

export default Toast;
