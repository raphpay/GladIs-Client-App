import React from 'react';
import { DimensionValue, Text, View } from 'react-native';

import FormTextInput from '../DocumentScreen/FormTextInput';

import styles from '../../../assets/styles/forms/FormEditionScreenStyles';

type FormEditionHeaderCellProps = {
  value: string;
  setValue: React.Dispatch<React.SetStateAction<string>>;
  title: string;
  placeholder: string;
  editable: boolean;
  width: DimensionValue;
};

function FormEditionHeaderCell(props: FormEditionHeaderCellProps): React.JSX.Element {

  const {
    value, setValue,
    title, placeholder,
    editable, width
  } = props;

  return (
    <View style={[styles.headerCell, { width }]}>
      <Text style={styles.headerCellTitle}>{title}</Text>
      <FormTextInput
        value={value}
        onChangeText={setValue}
        isTitle={true}
        placeholder={placeholder}
        editable={editable}
        multiline={true}
        numberOfLines={2}
      />
    </View>
  );
}

export default FormEditionHeaderCell;
