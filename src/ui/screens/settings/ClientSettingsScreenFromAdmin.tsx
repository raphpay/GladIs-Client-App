import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Platform, Text, TouchableOpacity, View } from 'react-native';
import DocumentPicker from 'react-native-document-picker';
import { useDispatch } from 'react-redux';

import { IClientManagementParams } from '../../../navigation/Routes';

import IAction from '../../../business-logic/model/IAction';
import IFile from '../../../business-logic/model/IFile';
import NavigationRoutes from '../../../business-logic/model/enums/NavigationRoutes';
import PlatformName from '../../../business-logic/model/enums/PlatformName';
import FinderModule from '../../../business-logic/modules/FinderModule';
import AuthenticationService from '../../../business-logic/services/AuthenticationService';
import CacheService from '../../../business-logic/services/CacheService';
import DocumentService from '../../../business-logic/services/DocumentService';
import UserService from '../../../business-logic/services/UserService';
import { useAppSelector } from '../../../business-logic/store/hooks';
import { setDocumentListCount } from '../../../business-logic/store/slices/appStateReducer';
import { changeClientBlockedStatus } from '../../../business-logic/store/slices/userReducer';
import { RootState } from '../../../business-logic/store/store';
import Utils from '../../../business-logic/utils/Utils';

import AppContainer from '../../components/AppContainer';
import Dialog from '../../components/Dialog';
import ErrorDialog from '../../components/ErrorDialog';
import Grid from '../../components/Grid';

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
  const { documentListCount } = useAppSelector((state: RootState) => state.appState);
  const dispatch = useDispatch();

  const [showErrorDialog, setShowErrorDialog] = useState<boolean>(false);
  const [showBlockDialog, setShowBlockDialog] = useState<boolean>(false);
  const [blockTitle, setBlockTitle] = useState<string>('');
  const [dialogTitle, setDialogTitle] = useState<string>('');

  const navigationHistoryItems: IAction[] = [
    {
      title: t('dashboard.title'),
      onPress: () => navigateBack()
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
      id: 'logoID',
      title: t('settings.clientSettings.logo'),
      action: () => modifyLogo(),
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
    dispatch(setDocumentListCount(documentListCount + 1));
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

  async function modifyLogo() {
    if (currentClient) {
      try {
        let data: string;
        if (Platform.OS === PlatformName.Mac) {
          data = await FinderModule.getInstance().pickImage();
        } else {
          const doc = await DocumentPicker.pickSingle({ type: DocumentPicker.types.images });
          data = await Utils.getFileBase64FromURI(doc.uri) as string;
        }

        const filename = 'logo.png';
        const file: IFile = {
          data,
          filename
        };
        await DocumentService.getInstance().uploadLogo(file, filename, `${currentClient.companyName}/logos/`);
        await CacheService.getInstance().storeValue(`${currentClient?.id}/logo`, data);
        await CacheService.getInstance().storeValue(`${currentClient?.id}/logo-lastModified`, new Date());
      } catch (error) {
        console.log('Error modifying logo', error);
      }
    }
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

  function SettingsActionGridItem(item: ISettingsAction) {
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
        <Grid
          data={settingsActions}
          renderItem={(renderItem) => SettingsActionGridItem(renderItem.item)}
        />
      </AppContainer>
      {blockDialog()}
      {errorDialog()}
    </>
  );
}

export default ClientSettingsScreenFromAdmin;