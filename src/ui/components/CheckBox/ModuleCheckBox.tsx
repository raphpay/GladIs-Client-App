import React from 'react';
import { useTranslation } from 'react-i18next';
import { Text, TouchableOpacity, View } from 'react-native';

import IModule from '../../../business-logic/model/IModule';

import styles from '../../assets/styles/components/CheckBoxWithTitleStyles';

type ModuleCheckBoxProps = {
  module: IModule;
  isSelected: boolean;
  onSelectModule: (obj: IModule) => void;
};

const ModuleCheckBox = (props: ModuleCheckBoxProps) => {

  const { module, isSelected, onSelectModule } = props;

  const { t } = useTranslation();
  
  return (
    <TouchableOpacity
      onPress={() => onSelectModule(module)}
      style={styles.container}
    >
      <View style={[styles.checkbox, isSelected && styles.checked]} />
      <Text style={styles.title}>{t(`modules.${module.name}`)}</Text>
    </TouchableOpacity>
  );
};

export default ModuleCheckBox;
