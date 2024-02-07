import React from 'react';
import {
  Text,
  TouchableOpacity
} from 'react-native';

import styles from '../assets/styles/components/SimpleTextButtonStyles';

type TextButtonProps = {
  title: string;
  onPress: () => void;
};

function SimpleTextButton(props: TextButtonProps): React.JSX.Element {
  return (
    <TouchableOpacity style={styles.container} onPress={props.onPress}>
      <Text style={styles.textButton}>{props.title}</Text>
    </TouchableOpacity>
  );
}

export default SimpleTextButton;