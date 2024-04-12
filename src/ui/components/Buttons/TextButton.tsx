import React from 'react';
import {
  DimensionValue,
  Text,
  TouchableOpacity
} from 'react-native';

import { Colors } from '../../assets/colors/colors';
import styles from '../../assets/styles/components/TextButtonStyles';

type TextButtonProps = {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  width?: DimensionValue | undefined
};

function TextButton(props: TextButtonProps): React.JSX.Element {
  const { title, onPress, width, disabled } = props;

  return (
    <TouchableOpacity
      style={[
        styles.container,
        {
          width,
          backgroundColor: disabled ? Colors.inactive : Colors.primary
        }
      ]}
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={styles.textButton}>{title}</Text>
    </TouchableOpacity>
  );
}

export default TextButton;