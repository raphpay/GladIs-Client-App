import React, { useRef } from 'react';
import { Animated, TextInput } from 'react-native';
import styles from '../assets/styles/components/ExpandingTextInputStyles';

type ExpandingTextInputProps = {
  text: string;
  setText: (text: string) => void;
  placeholder: string;
};

function ExpandingTextInput(props: ExpandingTextInputProps): React.JSX.Element {
  const { text, setText, placeholder } = props;

  const animatedHeight = useRef(new Animated.Value(40)).current;

  const handleTextChange = (inputText: string) => {
    setText(inputText);
    // Adjust the animation height based on the length of the text
    Animated.timing(animatedHeight, {
      toValue: inputText.length > 50 ? 80 : 40,
      duration: 150,
      useNativeDriver: false,
    }).start();
  };

  return (
    <Animated.View style={[styles.inputContainer, { height: animatedHeight }]}>
      <TextInput
        style={styles.input}
        onChangeText={handleTextChange}
        value={text}
        multiline
        maxLength={300}
        placeholder={placeholder}
      />
    </Animated.View>
  );
}

export default ExpandingTextInput;