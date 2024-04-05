import React from 'react';
import { useTranslation } from 'react-i18next';
import { Text, TouchableOpacity } from 'react-native';

import IModule from '../../business-logic/model/IModule';

import styles from '../assets/styles/components/GridModuleItemStyles';

type GridModuleItemProps = {
  module: IModule,
  onPress: (module: IModule) => void,
};

function GridModuleItem(props: GridModuleItemProps): React.JSX.Element {

  const { module, onPress } = props;

  const { t } = useTranslation();
  
  return (
    <TouchableOpacity onPress={() => onPress(module)} style={styles.moduleContainer}>
      <Text style={styles.moduleText}>{t(`modules.${module.name}`)}</Text>
    </TouchableOpacity>
  );
}

export default GridModuleItem;