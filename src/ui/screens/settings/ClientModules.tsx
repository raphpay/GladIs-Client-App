import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import IAction from '../../../business-logic/model/IAction';
import IModule from '../../../business-logic/model/IModule';
import NavigationRoutes from '../../../business-logic/model/enums/NavigationRoutes';
import ModuleService from '../../../business-logic/services/ModuleService';
import UserServiceGet from '../../../business-logic/services/UserService/UserService.get';
import UserServicePut from '../../../business-logic/services/UserService/UserService.put';
import { useAppDispatch, useAppSelector } from '../../../business-logic/store/hooks';
import { setModulesReloadCount } from '../../../business-logic/store/slices/appStateReducer';
import { RootState } from '../../../business-logic/store/store';

import { IClientManagementParams } from '../../../navigation/Routes';

import AppContainer from '../../components/AppContainer/AppContainer';
import IconButton from '../../components/Buttons/IconButton';
import ModuleCheckBox from '../../components/CheckBox/ModuleCheckBox';
import ContentUnavailableView from '../../components/ContentUnavailableView';
import Toast from '../../components/Toast';

import styles from '../../assets/styles/settings/ClientModulesStyles';

type ClientModulesProps = NativeStackScreenProps<IClientManagementParams, NavigationRoutes.ClientModules>;

function ClientModules(props: ClientModulesProps): React.JSX.Element {
  const [selectedModules, setSelectedModules] = useState<IModule[]>([]);
  const [showDialog, setShowDialog] = useState<boolean>(false);
  // Toast
  const [showToast, setShowToast] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string>('');
  const [toastIsShowingError, setToastIsShowingError] = useState<boolean>(false);

  const plusIcon = require('../../assets/images/plus.png');

  const { navigation } = props;

  const { t } = useTranslation();
  const { currentClient } = useAppSelector((state: RootState) => state.users);
  const { token } = useAppSelector((state: RootState) => state.tokens);
  const { modulesReloadCount } = useAppSelector((state: RootState) => state.appState);
  const dispatch = useAppDispatch();

  const clipboardIcon = require('../../assets/images/list.clipboard.png');

  const navigationHistoryItems: IAction[] = [
    {
      title: t('settings.title'),
      onPress: () => navigateBack()
    }
  ];

  const modules = ModuleService.getInstance().getModules();

  // Sync Methods
  function navigateBack() {
    navigation.goBack();
  }

  function isModuleSelected(module: IModule): boolean {
    return selectedModules.some(selectedModule => selectedModule.index === module.index);
  }

  function toggleCheckbox(module: IModule): void {
    if (isModuleSelected(module)) {
      // If the module is already selected, deselect it
      removeModuleFromClient(module);
    } else {
      // If the module is not selected, select it
      addModuleToClient(module);
    }
  }

  function addModuleToClient(moduleToAdd: IModule) {
    setSelectedModules((currentSelectedModules) => [
      ...currentSelectedModules,
      moduleToAdd,
    ]);
  }

  function removeModuleFromClient(moduleToRemove: IModule) {
    setSelectedModules((currentSelectedModules) =>
      currentSelectedModules.filter(
        (module) => module.index !== moduleToRemove.index
      )
    );
  }

  function displayToast(message: string, isError: boolean = false) {
    setShowToast(true);
    setToastIsShowingError(isError);
    setToastMessage(message);
  }
  
  // Async Methods
  async function loadModules() {
    if (currentClient && currentClient.id && token) {
      try {
        const usersModules = await UserServiceGet.getUsersModules(currentClient.id as string, token);
        setSelectedModules(usersModules);
      } catch (error) {
        console.log('Error getting modules for current client', error);
      }
    }
  }

  async function saveModules() {
    // TODO: Enhance save method ( should be disabled if no changes were made )
    if (currentClient && currentClient.id && token) {
      try {
        await UserServicePut.updateModules(currentClient.id, selectedModules, token);
        dispatch(setModulesReloadCount(modulesReloadCount + 1));
        navigation.goBack();
      } catch (error) {
        const errorMessage = (error as Error).message;
        displayToast(t(`errors.api.${errorMessage}`), true);
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

  // Components
  return (
    <>
      <AppContainer
        mainTitle={t('settings.clientSettings.modules')}
        showSearchText={true}
        showSettings={false}
        navigationHistoryItems={navigationHistoryItems}
        showBackButton={true}
        navigateBack={navigateBack}
        showDialog= {showDialog}
        setShowDialog={setShowDialog}
        additionalComponent={
          <IconButton
            title={t('components.buttons.save')}
            icon={plusIcon}
            onPress={saveModules}
            style={styles.saveButton}
          />
        }
      >
        <>
            {modules.length > 0 ? (
              modules.map((module: IModule) => (
                <ModuleCheckBox
                  key={module.id}
                  module={module}
                  isSelected={isModuleSelected(module)}
                  onSelectModule={() => toggleCheckbox(module)}
                />
              ))
            ) : (
              <ContentUnavailableView
                title={t('dashboard.noModules.title')}
                message={t('dashboard.noModules.message')}
                image={clipboardIcon}
              />
            )}
        </>
      </AppContainer>
      {ToastContent()}
    </>
  );
}

export default ClientModules;