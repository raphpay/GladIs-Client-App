import React from 'react';
import { useTranslation } from 'react-i18next';
import { Text, TouchableOpacity, View } from 'react-native';

import { ICheckBoxOption } from '../../../business-logic/model/IModule';

import styles from '../../assets/styles/components/CheckBoxWithTitleStyles';

type CheckBoxProps = {
  option: ICheckBoxOption;
  isSelected: boolean;
  onSelectOption: (option: ICheckBoxOption) => void;
};

const CheckBox = (props: CheckBoxProps) => {

  const { option, isSelected, onSelectOption } = props;

  const { t } = useTranslation();
  
  return (
    <TouchableOpacity
      onPress={() => onSelectOption(option)}
      style={styles.container}
    >
      <View style={[styles.checkbox, isSelected && styles.checked]} />
      <Text style={styles.title}>{t(`${option.name}`)}</Text>
    </TouchableOpacity>
  );
};

export default CheckBox;
