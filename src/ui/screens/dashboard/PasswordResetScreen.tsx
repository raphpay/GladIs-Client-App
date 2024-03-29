import Clipboard from '@react-native-clipboard/clipboard';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Image,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import IPasswordResetToken from '../../../business-logic/model/IPasswordResetToken';
import NavigationRoutes from '../../../business-logic/model/enums/NavigationRoutes';
import PasswordResetService from '../../../business-logic/services/PasswordResetService';
import UserService from '../../../business-logic/services/UserService';
import { useAppSelector } from '../../../business-logic/store/hooks';
import { RootState } from '../../../business-logic/store/store';
import Utils from '../../../business-logic/utils/Utils';

import { IRootStackParams } from '../../../navigation/Routes';

import AppContainer from '../../components/AppContainer';
import Dialog from '../../components/Dialog';
import GladisTextInput from '../../components/GladisTextInput';
import Grid from '../../components/Grid';
import Toast from '../../components/Toast';

import styles from '../../assets/styles/dashboard/PasswordResetScreenStyles';

type PasswordResetScreenProps = NativeStackScreenProps<IRootStackParams, NavigationRoutes.PasswordResetScreen>;

function PasswordResetScreen(props: PasswordResetScreenProps): React.JSX.Element {

  const { navigation } = props;

  const { t } = useTranslation();

  const { token } = useAppSelector((state: RootState) => state.tokens);
  const { currentUser } = useAppSelector((state: RootState) => state.users);

  const [passwordsToReset, setPasswordsToReset] = useState<IPasswordResetToken[]>([]);
  const [showAdminPasswordDialog, setShowAdminPasswordDialog] = useState<boolean>(false);
  const [showTokenDialog, setShowTokenDialog] = useState<boolean>(false);
  const [adminPassword, onAdminPasswordChange] = useState<string>('');
  const [selectedUserID, setSelectedUserID] = useState<string>('');
  const [selectedUserResetToken, setSelectedUserResetToken] = useState<string>('');
  const [showToast, setShowToast] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string>('');

  const clipboardIcon = require('../../assets/images/list.clipboard.png');

  function navigateBack() {
    navigation.goBack();
  }

  async function loadPasswordsToReset() {
    try {
      const apiTokens = await PasswordResetService.getInstance().getAll(token);
      setPasswordsToReset(apiTokens);
    } catch (error) {
      // TODO: Handle error
      console.log('error', error);
    }
  }

  async function getTokenValueForClient(clientID: string): Promise<string> {
    let resetToken = '';
    try {
      resetToken = await UserService.getInstance().getResetTokenValue(clientID, token);
    } catch (error) {
      console.log('error', error);
    }
    return resetToken;
  }

  function openAdminPasswordDialog(userID: string) {
    setSelectedUserID(userID);
    setShowAdminPasswordDialog(true);
  }

  async function onConfirmAdminPassword() {
    if (currentUser) {
      try {
        const check = await UserService.getInstance().verifyPassword(currentUser.id as string, adminPassword, token);
        if (check) {
          const resetToken = await getTokenValueForClient(selectedUserID);
          setShowTokenDialog(true);
          setShowAdminPasswordDialog(false);
          onAdminPasswordChange('');
          setSelectedUserResetToken(resetToken);
        }
      } catch (error) {
        console.log('error', error);
      }
    }
  }

  function resetDialogs() {
    setShowAdminPasswordDialog(false);
    setShowTokenDialog(false);
    onAdminPasswordChange('');
  }

  function copyToClipboard() {
    Clipboard.setString(selectedUserResetToken);
    resetDialogs();
    setShowToast(true);
    setToastMessage(t('components.toast.passwordsToReset.tokenCopied'));
  }

  useEffect(() => {
    async function init() {
      await loadPasswordsToReset();
    }
    init();
  }, []);

  useEffect(() => {
    if (showTokenDialog) {
      setTimeout(() => {
        resetDialogs();
      }, 5000);
    }
  }, [showTokenDialog]);

  function PasswordRow(item: IPasswordResetToken) {
    const expirationDate = new Date(item.expiresAt);
    const dateString = Utils.formatDate(expirationDate);
    const timeString = Utils.formatTime(expirationDate);
    const dateTimeString = `${dateString} ${t('tracking.at')} ${timeString}`
    const userID = item.userID.id || item.userID;

    return (
      <TouchableOpacity 
        style={styles.lineContainer}
        onPress={() => openAdminPasswordDialog(userID as string)}>
        <View style={styles.lineRow}>
          <Text style={styles.mailText}>{item.userEmail}</Text>
          <View style={styles.dateContainer}>
            <Text style={styles.dateText}>Expiration Date:</Text>
            <Text style={styles.dateText}>{dateTimeString}</Text>
          </View>
        </View>
        <View style={styles.separator} />
      </TouchableOpacity>
    )
  }

  function AdminPasswordDialog() {
    return (
      <>
        {
          showAdminPasswordDialog && (
            <Dialog
              title={t('passwordsToReset.dialog.checkPassword')}
              isConfirmAvailable={true}
              onConfirm={onConfirmAdminPassword}
              confirmTitle={t('passwordsToReset.dialog.confirmButton')}
              isCancelAvailable={true}
              onCancel={resetDialogs}
            >
              <GladisTextInput
                placeholder={t('login.password')}
                value={adminPassword}
                onValueChange={onAdminPasswordChange}
                secureTextEntry={true}
                showVisibilityButton={true}
              />
            </Dialog>
          )
        }
      </>
    )
  }

  function ResetTokenDialog() {
    return (
      <>
        {
          showTokenDialog && (
            <Dialog
              title={t('passwordsToReset.dialog.tokenGenerated')}
              isConfirmAvailable={true}
              onConfirm={resetDialogs}
              isCancelAvailable={false}
              onCancel={() => {}}
            >
              <View style={styles.tokenContainer}>
                <TouchableOpacity onPress={copyToClipboard}>
                  <Text style={styles.tokenText}>{selectedUserResetToken}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={copyToClipboard}>
                  <Image source={clipboardIcon} style={styles.copyIcon} />
                </TouchableOpacity>
              </View>
            </Dialog>
          )
        }
      </>
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
            />
          )
        }
      </>
    )
  }

  return (
    <>
      <AppContainer
        mainTitle={t('passwordsToReset.title')}
        showBackButton={true}
        showSearchText={false}
        showSettings={true}
        navigateBack={navigateBack}
      >
        <Grid
          data={passwordsToReset}
          renderItem={({ item }) => PasswordRow(item)}
        />
      </AppContainer>
      {AdminPasswordDialog()}
      {ResetTokenDialog()}
      {ToastContent()}
    </>
  );
}

export default PasswordResetScreen;