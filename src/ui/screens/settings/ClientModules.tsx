import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import IAction from '../../../business-logic/model/IAction';
import IModule from '../../../business-logic/model/IModule';
import NavigationRoutes from '../../../business-logic/model/enums/NavigationRoutes';
import ModuleService from '../../../business-logic/services/ModuleService';
import UserService from '../../../business-logic/services/UserService';
import { useAppSelector } from '../../../business-logic/store/hooks';
import { RootState } from '../../../business-logic/store/store';

import { IClientManagementParams } from '../../../navigation/Routes';

import AppContainer from '../../components/AppContainer';
import ContentUnavailableView from '../../components/ContentUnavailableView';
import IconButton from '../../components/IconButton';
import ModuleCheckBox from '../../components/ModuleCheckBox';

import styles from '../../assets/styles/settings/ClientModulesStyles';

type ClientModulesProps = NativeStackScreenProps<IClientManagementParams, NavigationRoutes.ClientModules>;

function ClientModules(props: ClientModulesProps): React.JSX.Element {
  const [modules, setModules] = useState<IModule[]>([]);
  const [selectedModules, setSelectedModules] = useState<IModule[]>([]);
  const [showDialog, setShowDialog] = useState<boolean>(false);

  const plusIcon = require('../../assets/images/plus.png');

  const { navigation } = props;

  const { t } = useTranslation();
  const { currentClient } = useAppSelector((state: RootState) => state.users);
  const { token } = useAppSelector((state: RootState) => state.tokens);

  const clipboardIcon = require('../../assets/images/list.clipboard.png');

  const navigationHistoryItems: IAction[] = [
    {
      title: t('settings.title'),
      onPress: () => navigateBack()
    }
  ];

  function navigateBack() {
    navigation.goBack();
  }

  async function loadModules() {
    const apiModules = await ModuleService.getInstance().getModules();  
    setModules(apiModules);
    if (currentClient && currentClient.id && token) {
      const usersModules = await UserService.getInstance().getUsersModules(currentClient.id as string, token);
      setSelectedModules(usersModules);
    }
  }

  function isModuleSelected(module: IModule): boolean {
    return selectedModules.some(selectedModule => selectedModule.id === module.id);
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
        (module) => module.id !== moduleToRemove.id
      )
    );
  }

  // TODO: Enhance save method ( should be disabled if no changes were made )
  async function saveModules() {
    if (currentClient && currentClient.id && token) {
      await UserService.getInstance().addModules(currentClient.id, selectedModules, token);
      navigation.goBack();
    }
  }

  useEffect(() => {
    async function init() {
      await loadModules();
    }
    init();
  }, []);

  return (
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
  );
}

export default ClientModules;