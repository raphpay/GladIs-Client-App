import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity
} from 'react-native';

import { Colors } from '../assets/colors/colors';

type TextButtonProps = {
  title: string;
  onPress: () => void;
};

function TextButton(props: TextButtonProps): React.JSX.Element {
  return (
    <TouchableOpacity
      style={[styles.container, { backgroundColor: Colors.primary }]}
      onPress={props.onPress}
    >
      <Text style={[styles.textButton, { color: Colors.white }]}>{props.title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 178,
    height: 55,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center'
  },
  textButton: {
    fontSize: 14,
    padding: 4
  },
});

export default TextButton;