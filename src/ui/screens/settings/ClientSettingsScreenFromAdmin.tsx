import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Platform, Text, TouchableOpacity, View } from 'react-native';
import { useDispatch } from 'react-redux';

import { IClientManagementParams } from '../../../navigation/Routes';

import IAction from '../../../business-logic/model/IAction';
import { IUserUpdateInput } from '../../../business-logic/model/IUser';
import NavigationRoutes from '../../../business-logic/model/enums/NavigationRoutes';
import AuthenticationServiceDelete from '../../../business-logic/services/AuthenticationService/AuthenticationService.delete';
import UserServiceGet from '../../../business-logic/services/UserService/UserService.get';
import UserServicePut from '../../../business-logic/services/UserService/UserService.put';
import { useAppSelector } from '../../../business-logic/store/hooks';
import {
  setClientListCount,
  setDocumentListCount,
} from '../../../business-logic/store/slices/appStateReducer';
import {
  changeClientBlockedStatus,
  setCurrentClient,
} from '../../../business-logic/store/slices/userReducer';
import { RootState } from '../../../business-logic/store/store';

import AppContainer from '../../components/AppContainer/AppContainer';
import OutlinedTextButton from '../../components/Buttons/OutlinedTextButton';
import Dialog from '../../components/Dialogs/Dialog';
import ErrorDialog from '../../components/Dialogs/ErrorDialog';
import Grid from '../../components/Grid/Grid';
import GladisTextInput from '../../components/TextInputs/GladisTextInput';
import Toast from '../../components/Toast';

import ClientSettingsScreenFromAdminManager from '../../../business-logic/manager/settings/ClientSettingsScreenFromAdminManager';
import IDocument from '../../../business-logic/model/IDocument';
import PlatformName from '../../../business-logic/model/enums/PlatformName';
import { Colors } from '../../assets/colors/colors';
import styles from '../../assets/styles/settings/SettingsScreenStyles';

type ClientSettingsScreenFromAdminProps = NativeStackScreenProps<
  IClientManagementParams,
  NavigationRoutes.ClientSettingsScreenFromAdmin
>;

function ClientSettingsScreenFromAdmin(
  props: ClientSettingsScreenFromAdminProps,
): React.JSX.Element {
  const { t } = useTranslation();

  const { navigation } = props;

  const { currentUser, currentClient } = useAppSelector(
    (state: RootState) => state.users,
  );
  const { token } = useAppSelector((state: RootState) => state.tokens);
  const { documentListCount, clientListCount } = useAppSelector(
    (state: RootState) => state.appState,
  );
  const dispatch = useDispatch();

  const [showErrorDialog, setShowErrorDialog] = useState<boolean>(false);
  const [showBlockDialog, setShowBlockDialog] = useState<boolean>(false);
  const [blockTitle, setBlockTitle] = useState<string>('');
  const [dialogTitle, setDialogTitle] = useState<string>('');
  const [showModifyClientDialog, setShowModifyClientDialog] =
    useState<boolean>(false);
  // Toast
  const [showToast, setShowToast] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string>('');
  const [toastIsShowingError, setToastIsShowingError] =
    useState<boolean>(false);
  // Client modification
  const [clientLastName, setClientLastName] = useState<string>('');
  const [clientFirstName, setClientFirstName] = useState<string>('');
  const [clientEmail, setClientEmail] = useState<string>('');
  const [clientPhoneNumber, setClientPhoneNumber] = useState<string>('');
  const [shouldUpdateUsername, setShouldUpdateUsername] =
    useState<boolean>(false);

  const navigationHistoryItems: IAction[] = [
    {
      title: t('dashboard.title'),
      onPress: () => navigateBack(),
    },
  ];

  const settingsActions: IAction[] = [
    {
      title: `${t('settings.userInfos')} ${currentUser?.username}`,
      onPress: () => {},
      isDisabled: true,
    },
    {
      title: `${t('settings.clientSettings.clientInfos')} ${
        currentClient?.username
      }`,
      onPress: () => {},
      isDisabled: true,
    },
    {
      title: t('settings.clientSettings.clientModification.title'),
      onPress: () => showUpdateUserDialog(),
      isDisabled: false,
    },
    {
      title: t('settings.clientSettings.bills'),
      onPress: () => navigateToBills(),
      isDisabled: false,
    },
    {
      title: t('settings.clientSettings.employees'),
      onPress: () => navigateToEmployees(),
      isDisabled: false,
    },
    {
      title: t('settings.clientSettings.modules'),
      onPress: () => navigateToModules(),
      isDisabled: false,
    },
    {
      title: t('settings.clientSettings.logo'),
      onPress: () => modifyLogo(),
      isDisabled: false,
    },
    {
      title: blockTitle,
      onPress: () => showBlockClient(),
      isDisabled: false,
      isDestructive: true,
    },
  ];

  // Sync Methods
  function navigateBack() {
    navigation.goBack();
  }

  function showUpdateUserDialog() {
    setShowModifyClientDialog(true);
    setDialogTitle(t('settings.clientSettings.clientModification.title'));
  }

  function navigateToBills() {
    dispatch(setDocumentListCount(documentListCount + 1));
    navigation.navigate(NavigationRoutes.DocumentsScreen, {
      previousScreen: t('settings.title'),
      currentScreen: t('settings.clientSettings.bills'),
      documentsPath: 'bills',
      processNumber: undefined,
      showGenerateSMQButton: false,
    });
  }

  function navigateToEmployees() {
    navigation.navigate(NavigationRoutes.ClientEmployees);
  }

  function navigateToModules() {
    navigation.navigate(NavigationRoutes.ClientModules);
  }

  function displayToast(message: string, isError: boolean = false) {
    setShowToast(true);
    setToastIsShowingError(isError);
    setToastMessage(message);
  }

  function showBlockClient() {
    setDialogTitle(
      currentClient?.isBlocked
        ? t('components.dialog.unblockClient')
        : t('components.dialog.blockClient'),
    );
    setShowBlockDialog(true);
  }

  function reloadBlockTitle() {
    currentClient?.isBlocked
      ? setBlockTitle(t('settings.clientSettings.unblockClient'))
      : setBlockTitle(t('settings.clientSettings.blockClient'));
  }

  // Async Methods
  async function modifyLogo() {
    if (currentClient) {
      try {
        let originPath: string = '';
        let fileData: string | undefined;
        if (Platform.OS === PlatformName.Windows) {
          fileData =
            await ClientSettingsScreenFromAdminManager.getInstance().pickLogoForWindows();
        } else {
          originPath =
            await ClientSettingsScreenFromAdminManager.getInstance().pickLogo();
        }

        const fileName = 'logo.png';
        const destinationPath = `${currentClient.companyName}/logos/`;
        let createdDocument: IDocument | undefined;

        if (Platform.OS === PlatformName.Windows) {
          createdDocument =
            await ClientSettingsScreenFromAdminManager.getInstance().uploadDataToAPI(
              fileData,
              fileName,
              destinationPath,
            );
        } else {
          createdDocument =
            await ClientSettingsScreenFromAdminManager.getInstance().uploadToAPI(
              fileName,
              originPath,
              destinationPath,
            );
        }

        if (createdDocument) {
          await ClientSettingsScreenFromAdminManager.getInstance().storeCachedValues(
            currentClient,
            createdDocument.id,
          );
        }
      } catch (error) {
        displayToast(t('errors.api.uploadLogo'), true);
      }
    }
  }

  async function toggleClientBlock() {
    if (currentClient?.isBlocked) {
      await unblockClient();
    } else {
      await blockClient();
    }
    setShowBlockDialog(false);
    reloadBlockTitle();
  }

  async function blockClient() {
    // Block the client and its employees
    try {
      await UserServicePut.blockUser(currentClient?.id as string, token);
      await AuthenticationServiceDelete.removeTokenForUser(
        currentClient?.id as string,
        token,
      );
      const employees = await UserServiceGet.getClientEmployees(
        currentClient?.id as string,
        token,
      );
      if (employees && employees.length !== 0) {
        for (const employee of employees) {
          await UserServicePut.blockUser(employee.id as string, token);
          await AuthenticationServiceDelete.removeTokenForUser(
            currentClient?.id as string,
            token,
          );
        }
      }
      dispatch(changeClientBlockedStatus(true));
      displayToast(t('api.success.clientBlocked'), false);
    } catch (error) {
      const errorMessage = (error as Error).message as string;
      displayToast(t(`errors.api.${errorMessage}`), true);
    }
  }

  async function unblockClient() {
    // Unblock the client and its employees
    try {
      await UserServicePut.unblockUser(currentClient?.id as string, token);
      const employees = await UserServiceGet.getClientEmployees(
        currentClient?.id as string,
        token,
      );
      if (employees && employees.length !== 0) {
        for (const employee of employees) {
          await UserServicePut.blockUser(employee.id as string, token);
          await AuthenticationServiceDelete.removeTokenForUser(
            currentClient?.id as string,
            token,
          );
        }
      }
      dispatch(changeClientBlockedStatus(false));
      displayToast(t('api.success.clientUnblocked'), false);
    } catch (error) {
      const errorMessage = (error as Error).message as string;
      displayToast(t(`errors.api.${errorMessage}`), true);
    }
  }

  async function loadClientIsBlocked() {
    const client = await UserServiceGet.getUserByID(
      currentClient?.id as string,
      token,
    );
    dispatch(changeClientBlockedStatus(client.isBlocked as boolean));
    reloadBlockTitle();
  }

  // Client modification
  async function loadClientInfos() {
    if (currentClient) {
      setClientLastName(currentClient.lastName as string);
      setClientFirstName(currentClient.firstName as string);
      setClientEmail(currentClient.email as string);
      setClientPhoneNumber(currentClient.phoneNumber as string);
    }
  }

  async function updateClient() {
    const currentClientID = currentClient?.id as string;
    const modifiedUser: IUserUpdateInput = {
      firstName: clientFirstName,
      lastName: clientLastName,
      email: clientEmail,
      phoneNumber: clientPhoneNumber,
      shouldUpdateUsername: shouldUpdateUsername,
    };

    let modificationCount = 0;

    if (currentClient) {
      if (currentClient.firstName !== clientFirstName) {
        modificationCount += 1;
      }
      if (currentClient.lastName !== clientLastName) {
        modificationCount += 1;
      }
      if (currentClient.email !== clientEmail) {
        modificationCount += 1;
      }
      if (currentClient.phoneNumber !== clientPhoneNumber) {
        modificationCount += 1;
      }
    }

    if (modificationCount !== 0) {
      try {
        const updatedClient = await UserServicePut.updateUserInfos(
          currentClientID,
          modifiedUser,
          token,
        );
        setShowModifyClientDialog(false);
        displayToast(t('settings.clientSettings.clientModification.success'));
        dispatch(setCurrentClient(updatedClient));
        // Update the client list count to trigger a refresh
        dispatch(setClientListCount(clientListCount + 1));
      } catch (error) {
        const errorMessage = (error as Error).message;
        displayToast(t(`errors.api.${errorMessage}`), true);
      }
    } else {
      displayToast(
        t('settings.clientSettings.clientModification.noModification'),
        true,
      );
    }
  }

  // Lifecycle Methods
  useEffect(() => {
    async function init() {
      await loadClientIsBlocked();
      await loadClientInfos();
    }
    init();
  }, []);

  // Components
  function additionalMentions() {
    // TODO: Add app version number to API
    return (
      <View style={styles.additionalMentions}>
        <Text style={styles.mentionText}>{t('legal.appName')} v 0.1.0</Text>
        <Text style={styles.mentionText}>{t('legal.developer')}</Text>
      </View>
    );
  }

  function errorDialog() {
    return (
      <>
        {showErrorDialog && (
          <ErrorDialog
            title={t('errors.logout.title')}
            description={t('errors.logout.message')}
            cancelTitle={t('errors.modules.cancelButton')}
            onCancel={() => setShowErrorDialog(false)}
          />
        )}
      </>
    );
  }

  function blockDialog() {
    return (
      <>
        {showBlockDialog && (
          <Dialog
            title={dialogTitle}
            isCancelAvailable={true}
            onConfirm={toggleClientBlock}
            onCancel={() => setShowBlockDialog(false)}
          />
        )}
      </>
    );
  }

  function modifyClientDialog() {
    function buttonTapped(update: boolean) {
      setShouldUpdateUsername(update);
    }

    return (
      <>
        {showModifyClientDialog && (
          <Dialog
            title={dialogTitle}
            description={t(
              'settings.clientSettings.clientModification.description',
            )}
            isCancelAvailable={true}
            onConfirm={updateClient}
            onCancel={() => setShowModifyClientDialog(false)}>
            <>
              <GladisTextInput
                value={clientLastName}
                onValueChange={setClientLastName}
                placeholder={t('quotation.lastName')}
              />
              <GladisTextInput
                value={clientFirstName}
                onValueChange={setClientFirstName}
                placeholder={t('quotation.firstName')}
              />
              <GladisTextInput
                value={clientEmail}
                onValueChange={setClientEmail}
                placeholder={t('quotation.email')}
              />
              <GladisTextInput
                value={clientPhoneNumber}
                onValueChange={setClientPhoneNumber}
                placeholder={t('quotation.phone')}
              />
              <View style={styles.usernameButtonsContainer}>
                <Text style={styles.usernameQuestion}>
                  {t(
                    'settings.clientSettings.clientModification.updateUsername.question',
                  )}
                </Text>
                <OutlinedTextButton
                  title={t(
                    'settings.clientSettings.clientModification.updateUsername.yes',
                  )}
                  onPress={() => buttonTapped(true)}
                  width="20%"
                  isSelected={shouldUpdateUsername}
                />
                <OutlinedTextButton
                  title={t(
                    'settings.clientSettings.clientModification.updateUsername.no',
                  )}
                  onPress={() => buttonTapped(false)}
                  width="20%"
                  isSelected={!shouldUpdateUsername}
                />
              </View>
            </>
          </Dialog>
        )}
      </>
    );
  }

  function SettingsActionGridItem(item: IAction) {
    function textColor(): string {
      let color: string = Colors.primary;
      if (item.isDestructive) {
        color = Colors.danger;
      }
      return color;
    }

    return (
      <TouchableOpacity
        disabled={item.isDisabled}
        style={styles.actionContainer}
        onPress={item.onPress}>
        <Text
          style={[
            item.isDisabled ? styles.text : styles.actionText,
            { color: textColor() },
          ]}>
          {item.title}
        </Text>
        <View style={styles.separator} />
      </TouchableOpacity>
    );
  }

  function ToastContent() {
    return (
      <>
        {showToast && (
          <Toast
            message={toastMessage}
            isVisible={showToast}
            setIsVisible={setShowToast}
            isShowingError={toastIsShowingError}
          />
        )}
      </>
    );
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
        navigationHistoryItems={navigationHistoryItems}>
        <Grid
          data={settingsActions}
          renderItem={renderItem => SettingsActionGridItem(renderItem.item)}
        />
      </AppContainer>
      {blockDialog()}
      {errorDialog()}
      {modifyClientDialog()}
      {ToastContent()}
    </>
  );
}

export default ClientSettingsScreenFromAdmin;
