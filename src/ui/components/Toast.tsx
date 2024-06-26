import React, { useEffect, useState } from 'react';
import { Animated, Text } from 'react-native';
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

  const slideIn = () => {
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    }).start();
  };

  const slideOut = () => {
    Animated.timing(slideAnim, {
      toValue: 60,
      duration: 500,
      useNativeDriver: true,
    }).start(() => {
      setTimeout(() => {
        setIsVisible(false);
      }, 500);
    });
  };

  useEffect(() => {
    if (isVisible) {
      slideIn();
      setTimeout(() => {
        slideOut();
      }, duration);
    }
  }, [isVisible, duration, slideIn, slideOut]);

  return (
    <Animated.View
      style={[
        styles.toast,
        { transform: [{ translateY: slideAnim } ]},
        { backgroundColor: isShowingError ? Colors.danger : Colors.success }
      ]}
    >
      <Text style={styles.text}>{message}</Text>
    </Animated.View>
  );
};

export default Toast;
