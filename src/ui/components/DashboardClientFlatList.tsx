import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  FlatList,
  Text,
  TouchableOpacity
} from 'react-native';

import IModule from '../../business-logic/model/IModule';
import NavigationRoutes from '../../business-logic/model/enums/NavigationRoutes';
import ModuleService from '../../business-logic/services/ModuleService';

import styles from '../assets/styles/components/DashboardClientFlatList';
import ContentUnavailableView from './ContentUnavailableView';

function DashboardClientFlatList(): React.JSX.Element {

  const [modules, setModules] = useState<IModule[]>([]);
  const navigation = useNavigation();
  const { t } = useTranslation();

  function navigateToModule(module: IModule) {
    navigation.navigate(NavigationRoutes.DocumentManagementScreen, { module })
  }

  function FlatListModuleItem(module: IModule) {
    return (
      <TouchableOpacity onPress={() => navigateToModule(module)} style={styles.moduleContainer}>
        <Text style={styles.moduleText}>{t(`modules.${module.name}`)}</Text>
      </TouchableOpacity>
    )
  }

  useEffect(() => {
    async function init() {
      const apiModules = await ModuleService.getInstance().getModules();
      setModules(apiModules);
    }
    init();
  }, []);

  // TODO: Handle ContentUnavailableView
  return (
    <>
    {
      modules.length === 0 ? (
        <ContentUnavailableView />
      ) : (
        <FlatList
          data={modules}
          numColumns={4}
          renderItem={(renderItem) => FlatListModuleItem(renderItem.item)}
          keyExtractor={(item) => item.id}
        />
      )
    }
    </>
  );
}

export default DashboardClientFlatList;