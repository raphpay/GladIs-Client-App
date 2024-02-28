import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  DimensionValue,
  Image,
  KeyboardTypeOptions,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

import styles from '../assets/styles/components/GladisTextInputStyles';

type GladisTextInputProps = {
  value: string;
  placeholder: string
  onValueChange: React.Dispatch<React.SetStateAction<string>>;
  width: DimensionValue,
  keyboardType?: KeyboardTypeOptions | undefined;
  secureTextEntry?: boolean;
  autoCapitalize?: "none" | "sentences" | "words" | "characters" | undefined;
  onSubmitEditing?: () => void;
  showVisibilityButton?: boolean;
  showTitle?: boolean;
};

// TODO: clean this component
// TODO: Check all other GladisTextInput with new props
function GladisTextInput(props: GladisTextInputProps): React.JSX.Element {

  const [isSecure, setIsSecure] = useState<boolean>(false);
  const [visibilityIconURI, setVisibilityIconURI] = useState<string>('../assets/images/eye.fill.png');

  const {
    value,
    placeholder,
    onValueChange,
    width,
    keyboardType,
    secureTextEntry,
    autoCapitalize,
    onSubmitEditing,
    showVisibilityButton,
    showTitle,
  } = props;

  const { t } = useTranslation();

  function toggleVisibility() {
    setIsSecure(!isSecure);
    setVisibilityIconURI(isSecure ? '../assets/images/eye.fill.png' : '../assets/images/eye.slash.fill.png');
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
                    <Image source={require('../assets/images/eye.slash.fill.png')} />
                  ) : (
                    <Image source={require('../assets/images/eye.fill.png')} />
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