import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';

import { IRootStackParams } from '../../../navigation/Routes';

import NavigationRoutes from '../../../business-logic/model/enums/NavigationRoutes';
import AuthenticationService from '../../../business-logic/services/AuthenticationService';
import UserService from '../../../business-logic/services/UserService';
import { useAppDispatch, useAppSelector } from '../../../business-logic/store/hooks';
import { removeToken } from '../../../business-logic/store/slices/tokenReducer';
import { RootState } from '../../../business-logic/store/store';

import AppContainer from '../../components/AppContainer';
import Dialog from '../../components/Dialog';
import GladisTextInput from '../../components/GladisTextInput';

import styles from '../../assets/styles/settings/SettingsScreenStyles';
import ErrorDialog from '../../components/ErrorDialog';

type SettingsScreenProps = NativeStackScreenProps<IRootStackParams, NavigationRoutes.SettingsScreen>;

interface ISettingsAction {
  id: string;
  title: string;
  action: () => void;
}

function SettingsScreen(props: SettingsScreenProps): React.JSX.Element {
  const { t } = useTranslation();
  const { navigation } = props;
  const { token } = useAppSelector((state: RootState) => state.tokens);
  const dispatch = useAppDispatch();

  const [oldPassword, setOldPassword] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [showDialog, setShowDialog] = useState<boolean>(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState<boolean>(false);
  const [showErrorDialog, setShowErrorDialog] = useState<boolean>(false);


  const settingsActions: ISettingsAction[] = [
    {
      id: 'changePasswordId',
      title: t('settings.modifyPassword'),
      action: () => showModifyPasswordDialog()
    },
    {
      id: 'logoutID',
      title: t('settings.logout'),
      action: () => displayLogoutDialog()
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
      await AuthenticationService.getInstance().logout(token)
      dispatch(removeToken())
    } catch (error) {
      setShowErrorDialog(true);
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

  function SettingsActionFlatListItem(item: ISettingsAction) {
    return (
      <TouchableOpacity style={styles.actionContainer} onPress={item.action}>
        <Text style={styles.actionText}>{item.title}</Text>
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
        <FlatList
          data={settingsActions}
          renderItem={(renderItem) => SettingsActionFlatListItem(renderItem.item)}
          keyExtractor={(item) => item.id}
        />
      </AppContainer>
      {dialogContent()}
      {logoutDialog()}
      {errorDialog()}
    </>
  );
}

export default SettingsScreen;