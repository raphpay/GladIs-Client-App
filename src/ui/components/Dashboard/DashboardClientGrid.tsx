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

  const [modules, setModules] = useState<IModule[]>([]);
  const [clientModulesIDs, setClientModulesIDs] = useState<string[]>([]);
  const clipboardIcon = require('../../assets/images/list.clipboard.png');

  const { t } = useTranslation();
  const navigation = useNavigation();

  const modulesFiltered = modules.filter(module => {
      const translatedName = t(`modules.${module.name}`);
      return translatedName.toLowerCase().includes(searchText?.toLowerCase());
  });

  const { token } = useAppSelector((state: RootState) => state.tokens);
  const { currentClient } = useAppSelector((state: RootState) => state.users);
  const dispatch = useAppDispatch();

  // Sync Methods
  function navigateToModule(module: IModule) {
    if (clientModulesIDs.includes(module.id)) {
      dispatch(setModule(module));
      if (module.name === 'documentManagement') {
        navigation.navigate(NavigationRoutes.DocumentManagementScreen);
      } else if (module.name === 'tracking') {
        navigation.navigate(NavigationRoutes.TrackingScreen);
      } else if (module.name === 'reminders') {
        navigation.navigate(NavigationRoutes.RemindersScreen);
      } else if (module.name === 'chat') {
        navigation.navigate(NavigationRoutes.MessagesScreen);
      }
    } else {
      setShowErrorDialog && setShowErrorDialog(true);
    }
  }

  // Async Methods
  async function loadModules() {
    if (currentClient) {
      try {
        const apiModules = await ModuleService.getInstance().getSortedModules(token);
        const usersModules = await UserService.getInstance().getUsersModules(currentClient?.id, token);
        const usersModulesIDs: string[] = usersModules.map(mod => mod.id);
        setClientModulesIDs(usersModulesIDs);
        console.log('apimodules',  apiModules);
        setModules(apiModules);
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