import React from 'react';
import {
  DimensionValue,
  StyleProp,
  Text,
  TouchableOpacity,
  ViewStyle
} from 'react-native';

import { Colors } from '../../assets/colors/colors';
import styles from '../../assets/styles/components/TextButtonStyles';

type TextButtonProps = {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  width?: DimensionValue | undefined;
  extraStyle?: StyleProp<ViewStyle>;
};

function TextButton(props: TextButtonProps): React.JSX.Element {
  const {
    title,
    onPress,
    width,
    disabled,
    extraStyle
  } = props;

  return (
    <TouchableOpacity
      style={[
        styles.container,
        {
          width,
          backgroundColor: disabled ? Colors.inactive : Colors.primary
        },
        extraStyle
      ]}
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={styles.textButton}>{title}</Text>
    </TouchableOpacity>
  );
}

export default TextButton;