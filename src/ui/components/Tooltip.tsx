import React, { useRef } from 'react';
import { Animated, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Colors } from '../assets/colors/colors';

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

// TODO: create style file
const styles = StyleSheet.create({
  container: {
    position: 'relative',
    zIndex: 2,
  },
  tooltip: {
    position: 'absolute',
    top: 40,
    right: 0,
    backgroundColor: Colors.white,
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: Colors.inactive,
    shadowColor: Colors.black,
    zIndex: 20,
    shadowOffset: {width: -2, height: 4},
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  action: {
    paddingVertical: 5,
  },
});

export default Tooltip;
