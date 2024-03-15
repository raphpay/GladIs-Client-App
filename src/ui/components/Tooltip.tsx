import React, { useRef } from 'react';
import { Animated, Image, Text, TouchableOpacity, View } from 'react-native';
import styles from '../assets/styles/components/TooltipStyles';


export interface ITooltipAction {
  title: string;
  onPress: () => void;
}

type TooltipProps = {
  isVisible: boolean;
  setIsVisible: React.Dispatch<React.SetStateAction<boolean>>;
  popoverActions: ITooltipAction[];
  selectedItem: any;
  setSelectedItem: React.Dispatch<React.SetStateAction<any>>;
};

const Tooltip = (props: TooltipProps) => {
  const { isVisible, setIsVisible, popoverActions, selectedItem, setSelectedItem } = props;
  const fadeAnimation = useRef(new Animated.Value(0)).current;

  const ellipsisIcon = require('../assets/images/ellipsis.png');

  function toggleTooltip() {
    setSelectedItem(selectedItem);
    setIsVisible(!isVisible);
    Animated.timing(fadeAnimation, {
      toValue: isVisible ? 0 : 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }

  function popover() {
    return (
      <View style={styles.popoverButton}>
        {popoverActions.map((action: ITooltipAction, index: number) => (
          <TouchableOpacity key={index} style={styles.popoverButton} onPress={action.onPress}>
            <Text style={styles.popoverButtonText}>{action.title}</Text>
          </TouchableOpacity>
        ))}
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.tooltipIconContainer} onPress={toggleTooltip}>
        <Image style={styles.icon} source={ellipsisIcon}/>
      </TouchableOpacity>
      {isVisible && (
        <Animated.View style={[styles.tooltip, {opacity: fadeAnimation}]}>
          {popover()}
        </Animated.View>
      )}
    </View>
  );
};

export default Tooltip;
