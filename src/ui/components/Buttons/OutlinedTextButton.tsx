

import React from 'react';
import {
  DimensionValue,
  Text,
  TouchableOpacity
} from 'react-native';

import { Colors } from '../../assets/colors/colors';
import styles from '../../assets/styles/components/TextButtonStyles';

type OutlinedTextButtonProps = {
  title: string;
  onPress: () => void;
  width?: DimensionValue | undefined;
  isSelected: boolean;
};

function OutlinedTextButton(props: OutlinedTextButtonProps): React.JSX.Element {
  const {
    title,
    onPress,
    width,
    isSelected
  } = props;

  return (
    <TouchableOpacity
      style={[
        styles.container,
        {
          width,
          backgroundColor: isSelected ? Colors.primary : 'transparent',
          borderWidth: isSelected ? 0 : 1,
          borderColor: isSelected ? 'transparent' : Colors.primary,
        },
      ]}
      onPress={onPress}
    >
      <Text style={[
        styles.textButton,
        {
          color: isSelected ? Colors.white : Colors.primary,
        }
        ]}>{title}</Text>
    </TouchableOpacity>
  );
}

export default OutlinedTextButton;