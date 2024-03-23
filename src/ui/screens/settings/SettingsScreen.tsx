import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Text, TouchableOpacity, View } from 'react-native';

import { IRootStackParams } from '../../../navigation/Routes';

import NavigationRoutes from '../../../business-logic/model/enums/NavigationRoutes';
import AuthenticationService from '../../../business-logic/services/AuthenticationService';
import UserService from '../../../business-logic/services/UserService';
import { useAppDispatch, useAppSelector } from '../../../business-logic/store/hooks';
import { removeModule, setClientListCount, setPendingUserListCount } from '../../../business-logic/store/slices/appStateReducer';
import { removeToken } from '../../../business-logic/store/slices/tokenReducer';
import { removeCurrentClient, removeCurrentUser } from '../../../business-logic/store/slices/userReducer';
import { RootState } from '../../../business-logic/store/store';

import AppContainer from '../../components/AppContainer';
import Dialog from '../../components/Dialog';
import ErrorDialog from '../../components/ErrorDialog';
import GladisTextInput from '../../components/GladisTextInput';
import Grid from '../../components/Grid';

import IAction from '../../../business-logic/model/IAction';
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
  const [showErrorDialog, setShowErrorDialog] = useState<boolean>(false);


  const settingsActions: IAction[] = [
    {
      title: `${t('settings.userInfos')} ${currentUser?.username}`,
      onPress: () => {},
      isDisabled: true,
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

  function showModifyPasswordDialog() {
    setShowDialog(true);
  }

  function displayLogoutDialog() {
    setShowLogoutDialog(true);
  }

  function navigateBack() {
    navigation.goBack()
  }

  async function submitPasswordChange() {
    if (oldPassword.length !== 0 && newPassword.length !== 0) {
      try {
        await UserService.getInstance().changePassword(oldPassword, newPassword);
        setShowDialog(false);
      } catch (error) {
        console.log('Error changing password', error);
      }
    }
  }

  async function logout() {
    try {
      await AuthenticationService.getInstance().logout(token);
      removeAllReduxStates();
    } catch (error) {
      setShowErrorDialog(true);
    }
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
              title={t('components.dialog.firstConnection.title')}
              description={t('components.dialog.firstConnection.description')}
              confirmTitle={t('components.dialog.firstConnection.confirmButton')}
              isConfirmDisabled={oldPassword.length === 0 || newPassword.length === 0}
              onConfirm={submitPasswordChange}
              isCancelAvailable={true}
              onCancel={() => setShowDialog(false)}
            >
              <>
                <GladisTextInput 
                  value={oldPassword}
                  placeholder={t('components.dialog.firstConnection.temporary')}
                  onValueChange={setOldPassword}
                  secureTextEntry={true}
                  autoCapitalize={'none'}
                  showVisibilityButton={true}
                  width={'100%'}
                />
                <GladisTextInput 
                  value={newPassword}
                  placeholder={t('components.dialog.firstConnection.new')}
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
      {errorDialog()}
    </>
  );
}

export default SettingsScreen;