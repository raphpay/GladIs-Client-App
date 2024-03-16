import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';
import { useDispatch } from 'react-redux';

import { IClientManagementParams } from '../../../navigation/Routes';

import INavigationHistoryItem from '../../../business-logic/model/INavigationHistoryItem';
import NavigationRoutes from '../../../business-logic/model/enums/NavigationRoutes';
import AuthenticationService from '../../../business-logic/services/AuthenticationService';
import UserService from '../../../business-logic/services/UserService';
import { useAppSelector } from '../../../business-logic/store/hooks';
import { changeClientBlockedStatus } from '../../../business-logic/store/slices/userReducer';
import { RootState } from '../../../business-logic/store/store';

import AppContainer from '../../components/AppContainer';
import Dialog from '../../components/Dialog';
import ErrorDialog from '../../components/ErrorDialog';

import styles from '../../assets/styles/settings/SettingsScreenStyles';

type ClientSettingsScreenFromAdminProps = NativeStackScreenProps<IClientManagementParams, NavigationRoutes.ClientSettingsScreenFromAdmin>;

interface ISettingsAction {
  id: string;
  title: string;
  action: () => void;
  isActionDisabled: boolean;
}

function ClientSettingsScreenFromAdmin(props: ClientSettingsScreenFromAdminProps): React.JSX.Element {
  const { t } = useTranslation();

  const { navigation } = props;

  const { currentUser, currentClient } = useAppSelector((state: RootState) => state.users);
  const { token } = useAppSelector((state: RootState) => state.tokens);
  const dispatch = useDispatch();

  const [showErrorDialog, setShowErrorDialog] = useState<boolean>(false);
  const [showBlockDialog, setShowBlockDialog] = useState<boolean>(false);
  const [blockTitle, setBlockTitle] = useState<string>('');
  const [dialogTitle, setDialogTitle] = useState<string>('');

  const navigationHistoryItems: INavigationHistoryItem[] = [
    {
      title: t('dashboard.title'),
      action: () => navigateBack()
    }
  ];

  const settingsActions: ISettingsAction[] = [
    {
      id: 'userInfos',
      title: `${t('settings.userInfos')} ${currentUser?.username}`,
      action: () => {},
      isActionDisabled: true,
    },
    {
      id: 'clientInfos',
      title: `${t('settings.clientSettings.clientInfos')} ${currentClient?.username}`,
      action: () => {},
      isActionDisabled: true,
    },
    {
      id: 'billListID',
      title: t('settings.clientSettings.bills'),
      action: () => navigateToBills(),
      isActionDisabled: false,
    },
    {
      id: 'employeesID',
      title: t('settings.clientSettings.employees'),
      action: () => navigateToEmployees(),
      isActionDisabled: false,
    },
    {
      id: 'modulesID',
      title: t('settings.clientSettings.modules'),
      action: () => navigateToModules(),
      isActionDisabled: false,
    },
    {
      id: 'blockClientID',
      title: blockTitle,
      action: () => showBlockClient(),
      isActionDisabled: false,
    },
  ];

  function navigateBack() {
    navigation.goBack()
  }

  function navigateToBills() {
    navigation.navigate(NavigationRoutes.DocumentsScreen, {
      previousScreen: t('settings.title'),
      currentScreen: t('settings.clientSettings.bills'),
      documentsPath: 'bills',
      processNumber: undefined,
    });
  }

  function navigateToEmployees() {
    navigation.navigate(NavigationRoutes.ClientEmployees);
  }

  function navigateToModules() {
    navigation.navigate(NavigationRoutes.ClientModules);
  }

  function additionalMentions() {
    // TODO: Add app version number to API
    return (
      <View style={styles.additionalMentions}>
        <Text style={styles.mentionText}>{t('legal.appName')} v 0.1.0</Text>
        <Text style={styles.mentionText}>{t('legal.developer')}</Text>
      </View>
    )
  }

  async function toggleClientBlock() {
    try {
      if (currentClient?.isBlocked) {
        // Unblock the client and its employees
        await UserService.getInstance().unblockUser(currentClient?.id as string, token);
        const employees = await UserService.getInstance().getClientEmployees(currentClient?.id as string, token);
        if (employees && employees.length !== 0) {
          for (const employee of employees) {
            await UserService.getInstance().blockUser(employee.id as string, token);
            await AuthenticationService.getInstance().removeTokenForUser(currentClient?.id as string, token);
          }
        }
        dispatch(changeClientBlockedStatus(false));
      } else {
        // Block the client and its employees
        await UserService.getInstance().blockUser(currentClient?.id as string, token);
        await AuthenticationService.getInstance().removeTokenForUser(currentClient?.id as string, token);
        const employees = await UserService.getInstance().getClientEmployees(currentClient?.id as string, token);
        if (employees && employees.length !== 0) {
          for (const employee of employees) {
            await UserService.getInstance().blockUser(employee.id as string, token);
            await AuthenticationService.getInstance().removeTokenForUser(currentClient?.id as string, token);
          }
        }
        dispatch(changeClientBlockedStatus(true));
      }
      setShowBlockDialog(false);
      reloadBlockTitle();
    } catch (error) {
      console.log('error', error);
    }
  }

  function showBlockClient() {
    setDialogTitle(currentClient?.isBlocked ? t('components.dialog.unblockClient') : t('components.dialog.blockClient'));
    setShowBlockDialog(true);
  }

  function reloadBlockTitle() {
    currentClient?.isBlocked ? setBlockTitle(t('settings.clientSettings.unblockClient')) : setBlockTitle(t('settings.clientSettings.blockClient'));
  }

  async function loadClientIsBlocked() {
    const client = await UserService.getInstance().getUserByID(currentClient?.id as string, token);
    dispatch(changeClientBlockedStatus(client.isBlocked as boolean));
    reloadBlockTitle();
  }

  useEffect(() => {
    async function init() {
      await loadClientIsBlocked();
    }
    init();
  }, []);

  function errorDialog() {
    return (
      <>
        {
          showErrorDialog && (
            <ErrorDialog
              title={t('errors.logout.title')}
              description={t('errors.logout.message')}
              cancelTitle={t('errors.modules.cancelButton')}
              onCancel={() => setShowErrorDialog(false)}
            />
          )
        }
      </>
    )
  }

  function blockDialog() {
    return (
      <>
        {
          showBlockDialog && (
            <Dialog
              title={dialogTitle}
              isCancelAvailable={true}
              onConfirm={toggleClientBlock}
              onCancel={() => setShowBlockDialog(false)}
            />
          )
        }
      </>
    )
  }

  function SettingsActionFlatListItem(item: ISettingsAction) {
    return (
      <TouchableOpacity
        disabled={item.isActionDisabled}
        style={styles.actionContainer}
        onPress={item.action}
      >
        <Text style={item.isActionDisabled ? styles.text : styles.actionText}>{item.title}</Text>
        <View style={styles.separator} />
      </TouchableOpacity>
    )
  }

  return (
    <>
      <AppContainer
        mainTitle={t('settings.title')}
        showSearchText={false}
        showSettings={false}
        showBackButton={true}
        navigateBack={navigateBack}
        additionalComponent={additionalMentions()}
        dialogIsShown={showErrorDialog || showBlockDialog}
        navigationHistoryItems={navigationHistoryItems}
      >
        <FlatList
          data={settingsActions}
          renderItem={(renderItem) => SettingsActionFlatListItem(renderItem.item)}
          keyExtractor={(item) => item.id}
        />
      </AppContainer>
      {blockDialog()}
      {errorDialog()}
    </>
  );
}

export default ClientSettingsScreenFromAdmin;