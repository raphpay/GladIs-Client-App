import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  FlatList,
  Text,
  TouchableOpacity
} from 'react-native';

import IModule from '../../business-logic/model/IModule';
import ModuleService from '../../business-logic/services/ModuleService';

import ContentUnavailableView from './ContentUnavailableView';

import styles from '../assets/styles/components/DashboardAdminFlatListStyles';

function DashboardClientFlatList(): React.JSX.Element {

  const [modules, setModules] = useState<IModule[]>([]);

  function navigateToModule(module: IModule) {
    //
  }

  const { t } = useTranslation();

  function FlatListModuleItem(module: IModule) {
    return (
      <TouchableOpacity onPress={() => navigateToModule(module)} style={styles.clientContainer}>
        <Text>{t(`modules.${module.name}`)}</Text>
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