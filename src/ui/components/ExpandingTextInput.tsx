import React, { useState } from 'react';
import { TextInput, View } from 'react-native';
import styles from '../assets/styles/components/ExpandingTextInputStyles';

type ExpandingTextInputProps = {
  text: string;
  setText: (text: string) => void;
  placeholder: string;
};

function ExpandingTextInput(props: ExpandingTextInputProps): React.JSX.Element {
  const { text, setText, placeholder } = props;
  const [inputHeight, setInputHeight] = useState(40); // Default to your desired initial height

  const handleContentSizeChange = (e: any) => {
    const { contentSize } = e.nativeEvent;
    // Set a minimum height and adjust as contentSize changes
    setInputHeight(Math.max(40, contentSize.height));
  };

  return (
    <View style={[styles.inputContainer, { height: inputHeight }]}>
      <TextInput
        style={[styles.input, { height: inputHeight }]}
        onChangeText={setText}
        value={text}
        multiline
        maxLength={300}
        placeholder={placeholder}
        onContentSizeChange={handleContentSizeChange}
      />
    </View>
  );
}

export default ExpandingTextInput;
