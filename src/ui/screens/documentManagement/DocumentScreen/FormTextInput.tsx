import React from 'react';
import { TextInput } from 'react-native';
import { Colors } from '../../../assets/colors/colors';
import styles from '../../../assets/styles/components/FormTextInput';

type FormTextInputProps = {
  value: string;
  onChangeText: React.Dispatch<React.SetStateAction<string>>;
  placeholder?: string;
  isTitle?: boolean;
  editable?: boolean;
  multiline?: boolean;
  numberOfLines?: number;
  textAlign?: 'center' | 'left' | 'right';
};

function FormTextInput(props: FormTextInputProps): React.JSX.Element {

  const {
    value, onChangeText,
    isTitle = false,
    placeholder,
    editable = true,
    multiline = true,
    numberOfLines = 1,
    textAlign = 'center',
  } = props;

  const placeholderTextColor = (isTitle ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)');
  const backgroundColor = isTitle ? { backgroundColor: Colors.primary } : null;
  const textColor = isTitle ? { color: Colors.white } : null;

  return (
    <TextInput
      style={[styles.cell, backgroundColor, textColor]}
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      editable={editable}
      multiline={multiline}
      numberOfLines={numberOfLines}
      textAlign={textAlign}
      placeholderTextColor={placeholderTextColor}
    />
  );
}

export default FormTextInput;
