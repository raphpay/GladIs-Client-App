import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import { Colors } from '../../assets/colors/colors';
import styles from '../../assets/styles/components/ToastStyles';

type ToastProps = {
  message: string;
  isVisible: boolean;
  setIsVisible: React.Dispatch<React.SetStateAction<boolean>>;
  duration?: number;
  isShowingError?: boolean;
};

const Toast = (props: ToastProps) => {
  const { message, isVisible, setIsVisible, duration = 2000, isShowingError = false } = props;

  useEffect(() => {
    console.log("windows");
    
    if (isVisible) {
      setTimeout(() => {
        setIsVisible(false);
      }, duration);
    }
  }, [isVisible, duration]);

  return (
    isVisible && (
      <View
        style={[
          styles.toast,
          { backgroundColor: isShowingError ? Colors.danger : Colors.success }
        ]}
      >
        <Text style={styles.text}>{message}</Text>
      </View>
    )
  );
};

export default Toast;