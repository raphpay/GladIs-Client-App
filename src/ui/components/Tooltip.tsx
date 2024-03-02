import React, { useRef } from 'react';
import { Animated, TouchableOpacity, View } from 'react-native';
import styles from '../assets/styles/components/TooltipStyles';

type TooltipProps = {
  isVisible: boolean;
  setIsVisible: React.Dispatch<React.SetStateAction<boolean>>;
  children: JSX.Element;
  popover: JSX.Element;
};

const Tooltip = (props: TooltipProps) => {
  const { isVisible, setIsVisible, children, popover } = props;
  const fadeAnimation = useRef(new Animated.Value(0)).current;

  function toggleTooltip() {
    setIsVisible(!isVisible);
    Animated.timing(fadeAnimation, {
      toValue: isVisible ? 0 : 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={toggleTooltip}>
        {children}
      </TouchableOpacity>

      {isVisible && (
        <Animated.View style={[styles.tooltip, {opacity: fadeAnimation}]}>
          {popover}
        </Animated.View>
      )}
    </View>
  );
};

export default Tooltip;
