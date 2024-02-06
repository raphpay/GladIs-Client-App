import React from 'react';
import {
  DimensionValue,
  Text,
  TouchableOpacity
} from 'react-native';

import styles from '../assets/styles/components/TextButtonStyles';

type TextButtonProps = {
  title: string;
  onPress: () => void;
  width?: DimensionValue | undefined
};

function TextButton(props: TextButtonProps): React.JSX.Element {
  const { title, onPress, width } = props;

  return (
    <TouchableOpacity style={[styles.container, { width }]} onPress={onPress}>
      <Text style={styles.textButton}>{title}</Text>
    </TouchableOpacity>
  );
}

export default TextButton;