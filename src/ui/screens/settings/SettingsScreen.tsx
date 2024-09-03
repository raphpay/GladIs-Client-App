import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Text, TouchableOpacity, View } from 'react-native';

import { IRootStackParams } from '../../../navigation/Routes';

import NavigationRoutes from '../../../business-logic/model/enums/NavigationRoutes';
import IAction from '../../../business-logic/model/IAction';
import { IUserUpdateInput } from '../../../business-logic/model/IUser';
import AuthenticationService from '../../../business-logic/services/AuthenticationService';
import UserServicePut from '../../../business-logic/services/UserService/UserService.put';
import { useAppDispatch, useAppSelector } from '../../../business-logic/store/hooks';
import { removeModule, setClientListCount, setPendingUserListCount } from '../../../business-logic/store/slices/appStateReducer';
import { removeToken } from '../../../business-logic/store/slices/tokenReducer';
import { removeCurrentClient, removeCurrentUser, setCurrentUser } from '../../../business-logic/store/slices/userReducer';
import { RootState } from '../../../business-logic/store/store';

import AppContainer from '../../components/AppContainer/AppContainer';
import Dialog from '../../components/Dialogs/Dialog';
import Grid from '../../components/Grid/Grid';
import GladisTextInput from '../../components/TextInputs/GladisTextInput';
import Toast from '../../components/Toast';

import styles from '../../assets/styles/settings/SettingsScreenStyles';

type SettingsScreenProps = NativeStackScreenProps<IRootStackParams, NavigationRoutes.SettingsScreen>;

function SettingsScreen(props: SettingsScreenProps): React.JSX.Element {
  const { t } = useTranslation();
  const { navigation } = props;
  const { token } = useAppSelector((state: RootState) => state.tokens);
  const { currentUser } = useAppSelector((state: RootState) => state.users);
  const dispatch = useAppDispatch();

  const [oldPassword, setOldPassword] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [showDialog, setShowDialog] = useState<boolean>(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState<boolean>(false);
  const [showModifyInfosDialog, setShowModifyInfosDialog] = useState<boolean>(false);
  // Toast
  const [showToast, setShowToast] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string>('');
  const [toastIsShowingError, setToastIsShowingError] = useState<boolean>(false);
  // User modification
  const [updatedEmail, setUpdatedEmail] = useState<string>(currentUser?.email as string);
  const [updatedPhoneNumber, setUpdatedPhoneNumber] = useState<string>(currentUser?.phoneNumber as string);

  const settingsActions: IAction[] = [
    {
      title: `${t('settings.userInfos')} ${currentUser?.username}`,
      onPress: () => {},
      isDisabled: true,
    },
    {
      title: t('settings.userModification.title'),
      onPress: () => setShowModifyInfosDialog(true),
      isDisabled: false
    },
    {
      title: t('settings.modifyPassword'),
      onPress: () => showModifyPasswordDialog(),
      isDisabled: false
    },
    {
      title: t('settings.logout'),
      onPress: () => displayLogoutDialog(),
      isDisabled: false
    },
  ];

  // Sync Methods
  function showModifyPasswordDialog() {
    setShowDialog(true);
  }

  function displayLogoutDialog() {
    setShowLogoutDialog(true);
  }

  function navigateBack() {
    navigation.goBack()
  }

  function removeAllReduxStates() {
    // App State Reducer
    dispatch(removeModule());
    dispatch(setPendingUserListCount(0));
    dispatch(setClientListCount(0));
    // Token Reducer
    dispatch(removeToken());
    // User Reducer
    dispatch(removeCurrentUser());
    dispatch(removeCurrentClient());
  }

  function displayToast(message: string, isError: boolean = false) {
    setShowToast(true);
    setToastIsShowingError(isError);
    setToastMessage(message);
  }

  // Async Methods
  async function submitPasswordChange() {
    if (oldPassword.length !== 0 && newPassword.length !== 0) {
      try {
        await UserServicePut.changePassword(currentUser?.id as string, oldPassword, newPassword, token);
        setShowDialog(false);
        displayToast(t('api.success.passwordChanged'), false);
      } catch (error) {
        const errorMessage = (error as Error).message;
        displayToast(t(`errors.api.${errorMessage}`), true);
      }
    }
  }

  async function logout() {
    try {
      await AuthenticationService.getInstance().logout(token);
      removeAllReduxStates();
    } catch (error) {
      const errorMessage = (error as Error).message;
      displayToast(t(`errors.api.${errorMessage}`), true);
    }
  }

  async function updateUserInfos() {
    const currentUserID = currentUser?.id as string;
    const modifiedUser: IUserUpdateInput = {
      email: updatedEmail,
      phoneNumber: updatedPhoneNumber,
    }

    let modificationCount = 0;

    if (currentUser) {
      if (currentUser.email !== updatedEmail) {
        modificationCount += 1;
      }
      if (currentUser.phoneNumber !== updatedPhoneNumber) {
        modificationCount += 1;
      }
    }

    if (modificationCount !== 0) {
      try {
        const updatedUser = await UserServicePut.updateUserInfos(currentUserID, modifiedUser, token);
        setShowModifyInfosDialog(false);
        displayToast(t('settings.userModification.success'));
        dispatch(setCurrentUser(updatedUser));
      } catch (error) {
        const errorMessage = (error as Error).message;
        displayToast(t(`errors.api.${errorMessage}`), true);
      }
    } else {
      displayToast(t('settings.userModification.noModification'), true);
    }
  }
  
  // Components
  function additionalMentions() {
    // TODO: Add app version number to API
    return (
      <View style={styles.additionalMentions}>
        <Text style={styles.mentionText}>{t('legal.appName')} v 0.1.0</Text>
        <Text style={styles.mentionText}>{t('legal.developer')}</Text>
      </View>
    )
  }

  function dialogContent() {
    return (
      <>
        {
          showDialog && (
            <Dialog
              title={t('settings.dialog.modifyPassword.title')}
              description={t('settings.dialog.modifyPassword.description')}
              confirmTitle={t('settings.dialog.modifyPassword.confirmButton')}
              isConfirmDisabled={oldPassword.length === 0 || newPassword.length === 0}
              onConfirm={submitPasswordChange}
              isCancelAvailable={true}
              onCancel={() => setShowDialog(false)}
            >
              <>
                <GladisTextInput 
                  value={oldPassword}
                  placeholder={t('settings.dialog.modifyPassword.oldPasswordPlaceholder')}
                  onValueChange={setOldPassword}
                  secureTextEntry={true}
                  autoCapitalize={'none'}
                  showVisibilityButton={true}
                  width={'100%'}
                />
                <GladisTextInput 
                  value={newPassword}
                  placeholder={t('settings.dialog.modifyPassword.newPasswordPlaceholder')}
                  onValueChange={setNewPassword}
                  secureTextEntry={true}
                  autoCapitalize={'none'}
                  showVisibilityButton={true}
                  width={'100%'}
                />
              </>
            </Dialog>
          )
        }
      </>
    );
  }

  function logoutDialog() {
    return (
      <>
        {
          showLogoutDialog && (
            <Dialog 
              title={t('components.dialog.logout.title')}
              confirmTitle={t('components.dialog.logout.confirmButton')}
              onConfirm={logout}
              isCancelAvailable={true}
              onCancel={() => setShowLogoutDialog(false)}
            />
          )
        }
      </>
    )
  }

  function modifyInfosDialog() {
    return (
      <>
      {
        showModifyInfosDialog && (
          <Dialog
            title={t('settings.userModification.title')}
            description={t('settings.userModification.description')}
            onConfirm={updateUserInfos}
            isCancelAvailable={true}
            onCancel={() => setShowModifyInfosDialog(false)}
          >
            <>
              <GladisTextInput 
                value={updatedEmail}
                placeholder={t('quotation.email')}
                onValueChange={setUpdatedEmail}
              />
              <GladisTextInput 
                value={updatedPhoneNumber}
                placeholder={t('quotation.phone')}
                onValueChange={setUpdatedPhoneNumber}
              />
            </>
          </Dialog>
        )
      }
      </>
    )
  }

  function SettingsActionGridItem(item: IAction) {
    return (
      <TouchableOpacity
        disabled={item.isDisabled}
        style={styles.actionContainer}
        onPress={item.onPress}
      >
        <Text style={item.isDisabled ? styles.text : styles.actionText}>{item.title}</Text>
        <View style={styles.separator} />
      </TouchableOpacity>
    )
  }

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
      <AppContainer
        mainTitle={t('settings.title')}
        showSearchText={false}
        showSettings={false}
        showBackButton={true}
        navigateBack={navigateBack}
        additionalComponent={additionalMentions()}
      >
        <Grid
          data={settingsActions}
          renderItem={(renderItem) => SettingsActionGridItem(renderItem.item)}
        />
      </AppContainer>
      {dialogContent()}
      {logoutDialog()}
      {modifyInfosDialog()}
      {ToastContent()}
    </>
  );
}

export default SettingsScreen;