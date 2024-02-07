import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  KeyboardTypeOptions,
  Text,
  TextInput,
  View
} from 'react-native';

import styles from '../assets/styles/components/GladisTextInputStyles';

type GladisTextInputProps = {
  value: string;
  placeholder: string
  onValueChange: React.Dispatch<React.SetStateAction<string>>;
  keyboardType?: KeyboardTypeOptions | undefined;
  secureTextEntry?: boolean | false;
};

function GladisTextInput(props: GladisTextInputProps): React.JSX.Element {

  const {
    value,
    placeholder,
    onValueChange,
    keyboardType,
    secureTextEntry
  } = props;
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <Text style={styles.placeholder}>{placeholder}</Text>
      <TextInput
        value={value}
        onChangeText={onValueChange}
        keyboardType={keyboardType}
        style={styles.textInput}
        secureTextEntry={secureTextEntry}
      />
    </View>
  );
}

export default GladisTextInput;