import React from 'react';
import { DimensionValue, StyleProp, Text, TouchableOpacity, ViewStyle } from 'react-native';

import styles from '../../../assets/styles/forms/FormEditionScreenStyles';

type FormAddCellButtonProps = {
  height: DimensionValue;
  width: DimensionValue;
  onPress: () => void;
  extraStyle?: StyleProp<ViewStyle>;
};

function FormAddCellButton(props: FormAddCellButtonProps): React.JSX.Element {

  const {
    height, width,
    onPress,
    extraStyle,
   } = props;

  return (
    <TouchableOpacity
      style={[styles.plusButton, { height, width }, extraStyle]}
      onPress={onPress}
    >
      <Text style={styles.plusButtonText}>+</Text>
    </TouchableOpacity>
  );
}

export default FormAddCellButton;
