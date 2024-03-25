import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Text,
  TouchableOpacity
} from 'react-native';

import IModule from '../../business-logic/model/IModule';
import IToken from '../../business-logic/model/IToken';
import NavigationRoutes from '../../business-logic/model/enums/NavigationRoutes';
import ModuleService from '../../business-logic/services/ModuleService';
import UserService from '../../business-logic/services/UserService';
import { useAppDispatch, useAppSelector } from '../../business-logic/store/hooks';
import { setModule } from '../../business-logic/store/slices/appStateReducer';
import { RootState } from '../../business-logic/store/store';

import ContentUnavailableView from './ContentUnavailableView';
import Grid from './Grid';

import styles from '../assets/styles/components/DashboardClientGridStyles';

type DashboardClientGridProps = {
  searchText: string;
  setShowDialog: React.Dispatch<React.SetStateAction<boolean>>;
};

function DashboardClientGrid(props: DashboardClientGridProps): React.JSX.Element {
  const { searchText, setShowDialog } = props;

  const [modules, setModules] = useState<IModule[]>([]);
  const [clientModulesIDs, setClientModulesIDs] = useState<string[]>([]);
  const clipboardIcon = require('../assets/images/list.clipboard.png');

  const navigation = useNavigation();
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const modulesFiltered = modules.filter(module =>
    module.name.toLowerCase().includes(searchText?.toLowerCase()),
  );

  const { token } = useAppSelector((state: RootState) => state.tokens);
  const { currentClient } = useAppSelector((state: RootState) => state.users);

  function navigateToModule(module: IModule) {
    if (clientModulesIDs.includes(module.id)) {
      dispatch(setModule(module));
      if (module.name == 'documentManagement') {
        navigation.navigate(NavigationRoutes.DocumentManagementScreen);
      } else if (module.name == 'tracking') {
        navigation.navigate(NavigationRoutes.TrackingScreen);
      } else if (module.name == 'reminders') {
        navigation.navigate(NavigationRoutes.RemindersScreen);
      }
    } else {
      setShowDialog && setShowDialog(true);
    }
  }

  function GridModuleItem(module: IModule) {
    return (
      <TouchableOpacity onPress={() => navigateToModule(module)} style={styles.moduleContainer}>
        <Text style={styles.moduleText}>{t(`modules.${module.name}`)}</Text>
      </TouchableOpacity>
    )
  }

  async function loadModules() {
    if (currentClient) {
      const apiModules = await ModuleService.getInstance().getSortedModules(token);
      const castedToken = token as IToken;
      const usersModules = await UserService.getInstance().getUsersModules(currentClient?.id, castedToken);
      const usersModulesIDs: string[] = usersModules.map(mod => mod.id);
      setClientModulesIDs(usersModulesIDs);
      setModules(apiModules);
    }
  }

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
          renderItem={(renderItem) => GridModuleItem(renderItem.item)}
        />
      )
    }
    </>
  );
}

export default DashboardClientGrid;