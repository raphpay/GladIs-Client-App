import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import IModule from '../../../business-logic/model/IModule';
import NavigationRoutes from '../../../business-logic/model/enums/NavigationRoutes';
import ModuleService from '../../../business-logic/services/ModuleService';
import UserService from '../../../business-logic/services/UserService';
import { useAppDispatch, useAppSelector } from '../../../business-logic/store/hooks';
import { setModule } from '../../../business-logic/store/slices/appStateReducer';
import { RootState } from '../../../business-logic/store/store';

import ContentUnavailableView from '../ContentUnavailableView';
import Grid from '../Grid/Grid';
import GridModuleItem from '../Grid/GridModuleItem';

type DashboardClientGridProps = {
  searchText: string;
  setShowErrorDialog: React.Dispatch<React.SetStateAction<boolean>>;
};

function DashboardClientGrid(props: DashboardClientGridProps): React.JSX.Element {
  const { searchText, setShowErrorDialog } = props;

  const [clientModulesIndexes, setClientModulesIndexes] = useState<string[]>([]);
  const clipboardIcon = require('../../assets/images/list.clipboard.png');

  const { t } = useTranslation();
  const navigation = useNavigation();

  const modules = ModuleService.getInstance().getModules();
  const modulesFiltered = modules.filter(module => {
      const translatedName = t(`modules.${module.name}`);
      return translatedName.toLowerCase().includes(searchText?.toLowerCase());
  });

  const { token } = useAppSelector((state: RootState) => state.tokens);
  const { currentClient } = useAppSelector((state: RootState) => state.users);
  const dispatch = useAppDispatch();

  // Sync Methods
  function navigateToModule(module: IModule) {
    if (clientModulesIndexes.includes(module.index.toString())) {
      dispatch(setModule(module));
      if (module.name === modules[0].name) {
        navigation.navigate(NavigationRoutes.DocumentManagementScreen);
      } else if (module.name === modules[1].name) {
        navigation.navigate(NavigationRoutes.TrackingScreen);
      } else if (module.name === modules[2].name) {
        navigation.navigate(NavigationRoutes.RemindersScreen);
      } else if (module.name === modules[3].name) {
        navigation.navigate(NavigationRoutes.MessagesScreen);
      }
    } else {
      setShowErrorDialog && setShowErrorDialog(true);
    }
  }

  // Async Methods
  async function loadModules() {
    // TODO: Load when changing modules in the backend
    if (currentClient) {
      try {
        const usersModules = await UserService.getInstance().getUsersModules(currentClient?.id, token);
        const usersModulesIndexes: string[] = usersModules.map(mod => mod.index.toString());
        setClientModulesIndexes(usersModulesIndexes);
      } catch (error) {
        console.log('Error loading modules', error);
      }
    }
  }

  // Lifecycle Methods
  useEffect(() => {
    async function init() {
      await loadModules();
    }
    init();
  }, []);
  
  useEffect(() => {
    async function reload() {
      await loadModules();
    }
    reload();
  }, [currentClient]);
  
  // Components
  return (
    <>
    {
      modulesFiltered.length === 0 ? (
        <ContentUnavailableView
          title={t('dashboard.noModules.title')}
          message={t('dashboard.noModules.message')}
          image={clipboardIcon}
        />
      ) : (
        <Grid
          data={modulesFiltered}
          renderItem={(renderItem) => (
            <GridModuleItem
              module={renderItem.item}
              onPress={navigateToModule}
            />
          )}
        />
      )
    }
    </>
  );
}

export default DashboardClientGrid;