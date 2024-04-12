import React, { useEffect, useState } from 'react';
import {
  DimensionValue,
  Image,
  KeyboardTypeOptions,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

import styles from '../../assets/styles/components/GladisTextInputStyles';

type GladisTextInputProps = {
  value: string;
  placeholder: string
  onValueChange: React.Dispatch<React.SetStateAction<string>>;
  width?: DimensionValue,
  keyboardType?: KeyboardTypeOptions | undefined;
  secureTextEntry?: boolean;
  autoCapitalize?: "none" | "sentences" | "words" | "characters" | undefined;
  onSubmitEditing?: () => void;
  showVisibilityButton?: boolean;
  showTitle?: boolean;
  editable?: boolean;
  autoCorrect?: boolean;
};

function GladisTextInput(props: GladisTextInputProps): React.JSX.Element {

  const [isSecure, setIsSecure] = useState<boolean>(false);

  const {
    value, onValueChange,
    placeholder,
    width,
    keyboardType,
    secureTextEntry,
    autoCapitalize,
    onSubmitEditing,
    showVisibilityButton, showTitle,
    editable,
    autoCorrect
  } = props;

  const eyeIcon = require('../../assets/images/eye.fill.png');
  const eyeSlashIcon = require('../../assets/images/eye.slash.fill.png');

  function toggleVisibility() {
    setIsSecure(!isSecure);
  }

  useEffect(() => {
    setIsSecure(secureTextEntry || false)
  }, []);

  return (
    <View style={[styles.container, { width }]}>
      { showTitle && (
          <Text style={styles.placeholder}>{placeholder}</Text>
        )
      }
      <View style={styles.textInputContainer}>
        <TextInput
          value={value}
          onChangeText={onValueChange}
          keyboardType={keyboardType}
          style={styles.textInput}
          secureTextEntry={isSecure}
          autoCapitalize={autoCapitalize}
          onSubmitEditing={onSubmitEditing}
          placeholder={placeholder}
          editable={editable ?? true}
          autoCorrect={autoCorrect ?? false}
        />
        {
          showVisibilityButton && (
            <>
              <TouchableOpacity
                style={styles.visibilityButtonContainer}
                onPress={toggleVisibility}
              >
                {
                  isSecure ? (
                    <Image style={styles.icon} source={eyeSlashIcon} />
                  ) : (
                    <Image style={styles.icon} source={eyeIcon} />
                  )
                }
              </TouchableOpacity>
            </>
          )
        }
      </View>
    </View>
  );
}

export default GladisTextInput;