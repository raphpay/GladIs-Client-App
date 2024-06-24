import { useNetInfo } from '@react-native-community/netinfo';
import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import IModule from '../../../business-logic/model/IModule';
import CacheKeys from '../../../business-logic/model/enums/CacheKeys';
import NavigationRoutes from '../../../business-logic/model/enums/NavigationRoutes';
import CacheService from '../../../business-logic/services/CacheService';
import ModuleService from '../../../business-logic/services/ModuleService';
import UserService from '../../../business-logic/services/UserService';
import { useAppDispatch, useAppSelector } from '../../../business-logic/store/hooks';
import { setModule } from '../../../business-logic/store/slices/appStateReducer';
import { RootState } from '../../../business-logic/store/store';

import ContentUnavailableView from '../ContentUnavailableView';
import Grid from '../Grid/Grid';
import GridModuleItem from '../Grid/GridModuleItem';
import Toast from '../Toast';

type DashboardClientGridProps = {
  searchText: string;
  setShowErrorDialog: React.Dispatch<React.SetStateAction<boolean>>;
};

function DashboardClientGrid(props: DashboardClientGridProps): React.JSX.Element {
  const { searchText, setShowErrorDialog } = props;

  const [clientModulesIndexes, setClientModulesIndexes] = useState<string[]>([]);
  // Toast
  const [showToast, setShowToast] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string>('');
  const [toastIsShowingError, setToastIsShowingError] = useState<boolean>(false);

  const clipboardIcon = require('../../assets/images/list.clipboard.png');

  const { t } = useTranslation();
  const navigation = useNavigation();
  const { token } = useAppSelector((state: RootState) => state.tokens);
  const { currentClient } = useAppSelector((state: RootState) => state.users);
  const { modulesReloadCount } = useAppSelector((state: RootState) => state.appState);
  const dispatch = useAppDispatch();
  const { isConnected } = useNetInfo();

  const modules = ModuleService.getInstance().getModules();
  const modulesFiltered = modules.filter(module => {
      const translatedName = t(`modules.${module.name}`);
      return translatedName.toLowerCase().includes(searchText?.toLowerCase());
  });

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

  function displayToast(message: string, isError: boolean = false) {
    setShowToast(true);
    setToastIsShowingError(isError);
    setToastMessage(message);
  }

  // Async Methods
  async function loadModules() {
    const cacheKey = `${CacheKeys.clientModules}-${currentClient?.id}`;
    if (isConnected) {
      await loadModulesFromAPI(cacheKey);
    } else {
      await loadModulesFromCache(cacheKey);
    }
  }

  async function loadModulesFromAPI(cacheKey: string) {
    if (currentClient) {
      let usersModules: IModule[] = [];
      try {
        usersModules = await UserService.getInstance().getUsersModules(currentClient?.id, token);
        const usersModulesIndexes: string[] = usersModules.map(mod => mod.index.toString());
        setClientModulesIndexes(usersModulesIndexes);
      } catch (error) {
        console.log('Error loading modules', error);
      }

      try {
        await CacheService.getInstance().storeValue(cacheKey, usersModules);
      } catch (error) {
        console.log('Error caching modules', error);
      }
    }
  }

  async function loadModulesFromCache(cacheKey: string) {
    try {
      const usersModules = await CacheService.getInstance().retrieveValue(cacheKey) as IModule[];
      if (usersModules.length === 0) {
        displayToast('errors.noInternet', true); // TODO: Add translations
      } else {
        const usersModulesIndexes: string[] = usersModules.map(mod => mod.index.toString());
        setClientModulesIndexes(usersModulesIndexes);
      }
    } catch (error) {
      console.log('Error getting users modules from cache', error);
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

  useEffect(() => {
    async function reload() {
      await loadModules();
    }
    reload();
  }, [modulesReloadCount]);

  useEffect(() => {
    async function reload() {
      await loadModules();
    }
    reload();
  }, [isConnected]);
  
  // Components
  function ToastContent() {
    return (
      <>
        {
          showToast && (
            <Toast
              message={toastMessage}
              isVisible={showToast}
              setIsVisible={setShowToast}
              isShowingError={toastIsShowingError}
            />
          )
        }
      </>
    )
  }

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
    {ToastContent()}
    </>
  );
}

export default DashboardClientGrid;