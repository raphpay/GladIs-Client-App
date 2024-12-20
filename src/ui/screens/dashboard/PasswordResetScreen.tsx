import Clipboard from '@react-native-clipboard/clipboard';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Image, Text, TouchableOpacity, View } from 'react-native';

import PasswordResetScreenManager from '../../../business-logic/manager/dashboard/PasswordResetScreenManager';
import IAction from '../../../business-logic/model/IAction';
import IPasswordResetToken from '../../../business-logic/model/IPasswordResetToken';
import NavigationRoutes from '../../../business-logic/model/enums/NavigationRoutes';
import PasswordResetService from '../../../business-logic/services/PasswordResetService';
import UserServicePost from '../../../business-logic/services/UserService/UserService.post';
import {
  useAppDispatch,
  useAppSelector,
} from '../../../business-logic/store/hooks';
import { setPasswordResetTokenCount } from '../../../business-logic/store/slices/appStateReducer';
import { RootState } from '../../../business-logic/store/store';
import DateUtils from '../../../business-logic/utils/DateUtils';

import { IRootStackParams } from '../../../navigation/Routes';

import AppContainer from '../../components/AppContainer/AppContainer';
import ContentUnavailableView from '../../components/ContentUnavailableView';
import Dialog from '../../components/Dialogs/Dialog';
import Grid from '../../components/Grid/Grid';
import GladisTextInput from '../../components/TextInputs/GladisTextInput';
import Toast from '../../components/Toast';
import Tooltip from '../../components/Tooltip';
import TooltipAction from '../../components/TooltipAction';

import styles from '../../assets/styles/dashboard/PasswordResetScreenStyles';

type PasswordResetScreenProps = NativeStackScreenProps<
  IRootStackParams,
  NavigationRoutes.PasswordResetScreen
>;

function PasswordResetScreen(
  props: PasswordResetScreenProps,
): React.JSX.Element {
  const { navigation } = props;

  // Password Reset Tokens
  const [passwordsToReset, setPasswordsToReset] = useState<
    IPasswordResetToken[]
  >([]);
  const [selectedItem, setSelectedItem] = useState<IPasswordResetToken>();
  // Dialogs
  const [showAdminPasswordDialog, setShowAdminPasswordDialog] =
    useState<boolean>(false);
  const [showTokenDialog, setShowTokenDialog] = useState<boolean>(false);
  const [showTooltipDialog, setShowTooltipDialog] = useState<boolean>(false);
  // General
  const [adminPassword, onAdminPasswordChange] = useState<string>('');
  const [selectedUserID, setSelectedUserID] = useState<string>('');
  const [selectedUserResetToken, setSelectedUserResetToken] =
    useState<string>('');
  // Toast
  const [showToast, setShowToast] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string>('');
  const [toastIsShowingError, setToastIsShowingError] =
    useState<boolean>(false);
  // Hooks
  const { t, i18n } = useTranslation();
  const { token } = useAppSelector((state: RootState) => state.tokens);
  const { currentUser } = useAppSelector((state: RootState) => state.users);
  const dispatch = useAppDispatch();
  // Images
  const clipboardIcon = require('../../assets/images/list.clipboard.png');
  const expiredClockIcon = require('../../assets/images/clock.badge.exclamationmark.png');

  const popoverActions: IAction[] = [
    {
      title: t('components.tooltip.passwordsToReset.copyEmail'),
      onPress: () => copyMail(),
    },
    {
      title: t('components.tooltip.passwordsToReset.showToken'),
      onPress: () => openAdminPasswordDialog(selectedUserID),
    },
    {
      title: t('components.tooltip.passwordsToReset.reloadToken'),
      onPress: () => actionResetPasswordResetRequest(),
    },
    {
      title: t('components.tooltip.passwordsToReset.delete'),
      onPress: () => deleteResetToken(),
      isDestructive: true,
    },
  ];

  // Synchronous Methods
  function navigateBack() {
    navigation.goBack();
  }

  function displayToast(message: string, isError?: boolean) {
    setShowToast(true);
    setToastIsShowingError(isError || false);
    setToastMessage(message);
  }

  function openAdminPasswordDialog(userID: string) {
    setSelectedUserID(userID);
    setShowTooltipDialog(false);
    setShowAdminPasswordDialog(true);
  }

  function resetDialogs() {
    setShowAdminPasswordDialog(false);
    setShowTokenDialog(false);
    setShowTooltipDialog(false);
    onAdminPasswordChange('');
  }

  function copyResetToken() {
    Clipboard.setString(selectedUserResetToken);
    resetDialogs();
    displayToast(t('components.toast.passwordsToReset.tokenCopied'), false);
  }

  function copyMail() {
    const email = selectedItem?.userEmail;
    if (email) {
      Clipboard.setString(email);
      resetDialogs();
      displayToast(t('components.toast.passwordsToReset.emailCopied'), false);
    } else {
      displayToast(t('components.toast.passwordsToReset.emailNotFound'), true);
    }
  }

  function displayTooltipDialog(userID: string, item: IPasswordResetToken) {
    setShowTooltipDialog(true);
    setSelectedUserID(userID);
    setSelectedItem(item);
  }

  // Asynchronous Methods
  async function onConfirmAdminPassword() {
    if (currentUser) {
      try {
        const check = await UserServicePost.verifyPassword(
          currentUser.id as string,
          adminPassword,
          token,
        );
        if (check) {
          const resetToken =
            await PasswordResetScreenManager.getInstance().getTokenValueForClient(
              selectedUserID,
              token,
            );
          setShowTokenDialog(true);
          setShowAdminPasswordDialog(false);
          onAdminPasswordChange('');
          setSelectedUserResetToken(resetToken);
        }
      } catch (error) {
        const errorMessage = (error as Error).message;
        displayToast(t(`errors.api.${errorMessage}`), true);
      }
    }
  }

  async function deleteResetToken() {
    if (selectedItem) {
      try {
        await PasswordResetService.getInstance().delete(
          selectedItem.id as string,
          token,
        );
        displayToast(
          t('components.toast.passwordsToReset.tokenDeleted'),
          false,
        );
        resetDialogs();
        await PasswordResetScreenManager.getInstance().loadPasswordsToReset(
          token,
        );
      } catch (error) {
        const errorMessage = (error as Error).message;
        displayToast(t(`errors.api.${errorMessage}`), true);
      }
    }
  }

  async function actionResetPasswordResetRequest() {
    if (selectedItem) {
      const resetEmail = selectedItem?.userEmail;
      try {
        const resetPasswordToken =
          await PasswordResetService.getInstance().requestPasswordReset(
            resetEmail,
          );
        const resetToken = resetPasswordToken.token;
        if (resetToken) {
          await PasswordResetScreenManager.getInstance().sendEmail(
            resetEmail,
            resetToken,
            i18n.language,
          );
        }
        await PasswordResetScreenManager.getInstance().loadPasswordsToReset(
          token,
        );
        resetDialogs();
        displayToast(t('components.toast.passwordReset.requestSentFromAdmin'));
      } catch (error) {
        const errorMessage = (error as Error).message;
        displayToast(t(`errors.api.${errorMessage}`), true);
      }
    }
  }

  // Effects
  useEffect(() => {
    async function init() {
      try {
        const resetTokens =
          await PasswordResetScreenManager.getInstance().loadPasswordsToReset(
            token,
          );
        setPasswordsToReset(resetTokens);
        dispatch(setPasswordResetTokenCount(resetTokens.length));
      } catch (error) {
        console.log('Error loading password reset tokens', error);
      }
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

  // Components
  function PasswordRow(item: IPasswordResetToken) {
    const expirationDate = new Date(item.expiresAt);
    const isExpired = expirationDate < new Date();
    const dateString = DateUtils.formatDate(expirationDate);
    const timeString = DateUtils.formatTime(expirationDate);
    const dateTimeString = `${dateString} ${t('tracking.at')} ${timeString}`;
    const userID = item.userID.id || item.userID;

    return (
      <View style={styles.lineContainer}>
        <View style={styles.lineRow}>
          <TouchableOpacity
            style={styles.lineRow}
            onPress={() => openAdminPasswordDialog(userID as string)}>
            <Text style={styles.mailText}>{item.userEmail}</Text>
            <View style={styles.dateContainer}>
              <Text style={styles.dateText}>
                {t('passwordsToReset.expirationDate')} :
              </Text>
              <Text style={styles.dateText}>{dateTimeString}</Text>
            </View>
          </TouchableOpacity>
          {isExpired && (
            <Image source={expiredClockIcon} style={styles.clockIcon} />
          )}
          <Tooltip
            action={() => displayTooltipDialog(userID as string, item)}
          />
        </View>
        <View style={styles.separator} />
      </View>
    );
  }

  function AdminPasswordDialog() {
    return (
      <>
        {showAdminPasswordDialog && (
          <Dialog
            title={t('passwordsToReset.dialog.checkPassword')}
            isConfirmAvailable={true}
            onConfirm={onConfirmAdminPassword}
            confirmTitle={t('passwordsToReset.dialog.confirmButton')}
            isCancelAvailable={true}
            onCancel={resetDialogs}>
            <GladisTextInput
              placeholder={t('login.password')}
              value={adminPassword}
              onValueChange={onAdminPasswordChange}
              secureTextEntry={true}
              showVisibilityButton={true}
            />
          </Dialog>
        )}
      </>
    );
  }

  function ResetTokenDialog() {
    return (
      <>
        {showTokenDialog && (
          <Dialog
            title={t('passwordsToReset.dialog.tokenGenerated')}
            isConfirmAvailable={true}
            onConfirm={resetDialogs}
            isCancelAvailable={false}
            onCancel={() => {}}>
            <View style={styles.tokenContainer}>
              <TouchableOpacity onPress={copyResetToken}>
                <Text style={styles.tokenText}>{selectedUserResetToken}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={copyResetToken}>
                <Image source={clipboardIcon} style={styles.copyIcon} />
              </TouchableOpacity>
            </View>
          </Dialog>
        )}
      </>
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

  function TooltipActionContent() {
    return (
      <TooltipAction
        showDialog={showTooltipDialog}
        title={`${t('components.tooltip.passwordsToReset.title')} ${
          selectedItem?.userEmail
        }`}
        isCancelAvailable={true}
        onConfirm={resetDialogs}
        onCancel={resetDialogs}
        popoverActions={popoverActions}
      />
    );
  }

  return (
    <>
      <AppContainer
        mainTitle={t('passwordsToReset.title')}
        showBackButton={true}
        showSearchText={false}
        showSettings={true}
        navigateBack={navigateBack}>
        {passwordsToReset.length === 0 ? (
          <ContentUnavailableView
            title={t('passwordsToReset.noTokens.title')}
            message={t('passwordsToReset.noTokens.message')}
            image={clipboardIcon}
          />
        ) : (
          <Grid
            data={passwordsToReset}
            renderItem={renderItem => PasswordRow(renderItem.item)}
          />
        )}
      </AppContainer>
      {AdminPasswordDialog()}
      {ResetTokenDialog()}
      {ToastContent()}
      {TooltipActionContent()}
    </>
  );
}

export default PasswordResetScreen;
