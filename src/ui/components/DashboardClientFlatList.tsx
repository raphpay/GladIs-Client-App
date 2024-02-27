import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  FlatList,
  Image,
  Text,
  TouchableOpacity
} from 'react-native';

import IModule from '../../business-logic/model/IModule';
import NavigationRoutes from '../../business-logic/model/enums/NavigationRoutes';
import ModuleService from '../../business-logic/services/ModuleService';
import { useAppDispatch } from '../../business-logic/store/hooks';
import { setModule } from '../../business-logic/store/slices/appStateReducer';

import ContentUnavailableView from './ContentUnavailableView';

import styles from '../assets/styles/components/DashboardClientFlatList';


function DashboardClientFlatList(): React.JSX.Element {

  const [modules, setModules] = useState<IModule[]>([]);
  const navigation = useNavigation();
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  function navigateToModule(module: IModule) {
    dispatch(setModule(module));
    navigation.navigate(NavigationRoutes.DocumentManagementScreen)
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
  
  return (
    <>
    {
      modules.length === 0 ? (
        <ContentUnavailableView
          title={t('dashboard.client.noModules.title')}
          message={t('dashboard.client.noModules.message')}
          image={(
            <Image source={require('../assets/images/list.clipboard.png')}/>
          )}
        />
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