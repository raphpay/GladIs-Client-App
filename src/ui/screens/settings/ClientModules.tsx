import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import INavigationHistoryItem from '../../../business-logic/model/IAction';
import IModule from '../../../business-logic/model/IModule';
import NavigationRoutes from '../../../business-logic/model/enums/NavigationRoutes';
import ModuleService from '../../../business-logic/services/ModuleService';
import UserService from '../../../business-logic/services/UserService';
import { useAppSelector } from '../../../business-logic/store/hooks';
import { RootState } from '../../../business-logic/store/store';

import { IClientManagementParams } from '../../../navigation/Routes';

import AppContainer from '../../components/AppContainer';
import ContentUnavailableView from '../../components/ContentUnavailableView';
import Dialog from '../../components/Dialog';
import ModuleCheckBox from '../../components/ModuleCheckBox';

type ClientModulesProps = NativeStackScreenProps<IClientManagementParams, NavigationRoutes.ClientModules>;

function ClientModules(props: ClientModulesProps): React.JSX.Element {
  const [modules, setModules] = useState<IModule[]>([]);
  const [selectedModules, setSelectedModules] = useState<IModule[]>([]);
  const [selectedModule, setSelectedModule] = useState<IModule>();
  const [showDialog, setShowDialog] = useState<boolean>(false);

  const { navigation } = props;

  const { t } = useTranslation();
  const { currentClient } = useAppSelector((state: RootState) => state.users);
  const { token } = useAppSelector((state: RootState) => state.tokens);

  const clipboardIcon = require('../../assets/images/list.clipboard.png');

  const navigationHistoryItems: INavigationHistoryItem[] = [
    {
      title: t('settings.title'),
      action: () => navigateBack()
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
    setSelectedModule(module);
    if (isModuleSelected(module)) {
      // If the module is already selected, deselect it
      setShowDialog(true);
    } else {
      // If the module is not selected, select it
      addModuleToClient();
    }
  }

  async function addModuleToClient() {
    if (selectedModule && currentClient && currentClient.id && token) {
      await UserService.getInstance().addModules(currentClient.id, [selectedModule], token);
      const updatedSelectedModules = [...selectedModules, selectedModule];
      setSelectedModules(updatedSelectedModules);
    }
  }

  async function removeModuleFromClient() {
    if (selectedModule && currentClient && currentClient.id && token) {
      const remainingModules = await UserService.getInstance().removeModuleFromClient(currentClient.id, selectedModule.id, token);
      setShowDialog(false);
      setSelectedModules(remainingModules);
    }
  }

  useEffect(() => {
    async function init() {
      await loadModules();
    }
    init();
  }, []);

  function dialogContent() {
    return (
      <Dialog
        title={t('components.dialog.removeModule.title')}
        description={t('components.dialog.removeModule.description')}
        onConfirm={removeModuleFromClient}
        isCancelAvailable={true}
        onCancel={() => setShowDialog(false)}
      >

      </Dialog>
    )
  }

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
      dialog={dialogContent()}
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