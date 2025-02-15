import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { SafeAreaView, Text } from 'react-native';

import { IRootStackParams } from '../../../navigation/Routes';

import LoginScreenManager from '../../../business-logic/manager/authentification/LoginScreenManager';
import IToken from '../../../business-logic/model/IToken';
import NavigationRoutes from '../../../business-logic/model/enums/NavigationRoutes';
import UserType from '../../../business-logic/model/enums/UserType';
import CacheService from '../../../business-logic/services/CacheService';
import PasswordResetService from '../../../business-logic/services/PasswordResetService';
import UserServiceGet from '../../../business-logic/services/UserService/UserService.get';
import {
  useAppDispatch,
  useAppSelector,
} from '../../../business-logic/store/hooks';
import { setToken } from '../../../business-logic/store/slices/tokenReducer';
import {
  setCurrentClient,
  setCurrentUser,
  setIsAdmin,
} from '../../../business-logic/store/slices/userReducer';
import { RootState } from '../../../business-logic/store/store';

import AppIcon from '../../components/AppIcon';
import SimpleTextButton from '../../components/Buttons/SimpleTextButton';
import TextButton from '../../components/Buttons/TextButton';
import Dialog from '../../components/Dialogs/Dialog';
import VersionLogAlert from '../../components/Dialogs/VersionLogAlert';
import GladisTextInput from '../../components/TextInputs/GladisTextInput';
import Toast from '../../components/Toast';

import styles from '../../assets/styles/authentification/LoginScreenStyles';

type LoginScreenProps = NativeStackScreenProps<
  IRootStackParams,
  NavigationRoutes.LoginScreen
>;

function LoginScreen(props: LoginScreenProps): React.JSX.Element {
  const { navigation } = props;

  const [identifier, onIdentifierChange] = useState<string>('');
  const [password, onPasswordChange] = useState<string>('');
  const [showDialog, setShowDialog] = useState<boolean>(false);
  const [showResetTokenDialog, setShowResetTokenDialog] =
    useState<boolean>(false);
  const [dialogDescription, setDialogDescription] = useState<string>('');
  const [resetEmail, setResetEmail] = useState<string>('');
  const [token, onTokenChange] = useState<string>('');
  const [newPassword, onNewPasswordChange] = useState<string>('');
  // Toast
  const [showToast, setShowToast] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string>('');
  const [toastIsShowingError, setToastIsShowingError] =
    useState<boolean>(false);
  const [toastDuration, setToastDuration] = useState<number>(2000);

  const inputIsEditable = !showDialog && !showResetTokenDialog;
  const isButtonDisabled = identifier.length === 0 || password.length === 0;

  const { t, i18n } = useTranslation();
  const dispatch = useAppDispatch();

  const { show } = useAppSelector((state: RootState) => state.versionLogAlert);

  // Sync Methods
  function goToSignUp() {
    navigation.navigate(NavigationRoutes.SignUpScreen);
  }

  function goToPasswordReset() {
    setDialogDescription('');
    setShowDialog(true);
  }

  function displayResetPasswordDialog() {
    setShowDialog(false);
    setDialogDescription(t('components.dialog.passwordReset.resetDescription'));
    setShowResetTokenDialog(true);
  }

  function resetDialogs() {
    setShowDialog(false);
    setShowResetTokenDialog(false);
    setDialogDescription('');
  }

  function displayToast(
    message: string,
    isError: boolean = false,
    duration: number = 2000,
  ) {
    setShowToast(true);
    setToastIsShowingError(isError);
    setToastMessage(message);
    setToastDuration(duration);
  }

  // Async Methods
  async function submitLogin() {
    if (identifier.length !== 0 && password.length !== 0) {
      await login();
    } else {
      displayToast(t('login.errors.fillForm'), true);
    }
  }

  async function login() {
    try {
      const token = await LoginScreenManager.getInstance().login(
        identifier,
        password,
      );
      await dispatchValues(token);
    } catch (error) {
      const errorMessage = (error as Error).message;
      displayToast(t(`errors.api.${errorMessage}`), true, 3000);
    }
  }

  async function dispatchValues(token: IToken) {
    try {
      const user = await UserServiceGet.getUserByID(token.user.id, token);
      dispatch(setCurrentUser(user));
      dispatch(setIsAdmin(user.userType === UserType.Admin));
      if (user.userType !== UserType.Admin) {
        dispatch(setCurrentClient(user));
      }
      dispatch(setToken(token));
    } catch (error) {
      const errorMessage = (error as Error).message;
      displayToast(t(`errors.api.${errorMessage}`), true);
    }
  }

  async function actionSendPasswordResetRequest() {
    if (resetEmail.length > 0) {
      try {
        const resetPasswordToken =
          await LoginScreenManager.getInstance().requestPasswordReset(
            resetEmail,
          );
        const token = resetPasswordToken.token;
        if (token) {
          await LoginScreenManager.getInstance().sendEmailWithPasswordResetToken(
            resetEmail,
            token,
            i18n.language,
          );
        }
        setShowDialog(false);
        setResetEmail('');
        displayToast(t('components.toast.passwordReset.requestSent'));
      } catch (error) {
        const errorMessage = (error as Error).message;
        displayToast(t(`errors.api.${errorMessage}`), true);
      }
    } else {
      displayToast(t('components.dialog.addEmployee.errors.fillAll'), true);
    }
  }

  async function resetPasswordWithToken() {
    if (token.length > 0 && newPassword.length > 0) {
      try {
        await PasswordResetService.getInstance().resetPassword(
          token,
          newPassword,
        );
        resetDialogs();
        await CacheService.getInstance().clearStorage();
        displayToast(t('components.toast.passwordReset.success'));
      } catch (error) {
        const errorMessage = (error as Error).message;
        displayToast(t(`errors.api.${errorMessage}`), true);
      }
    } else {
      displayToast(t('components.dialog.addEmployee.errors.fillAll'), true);
    }
  }

  // Components
  function ResetDialogContent() {
    return (
      <>
        {showDialog && (
          <Dialog
            title={t('components.dialog.passwordReset.title')}
            description={dialogDescription}
            confirmTitle={t('components.dialog.passwordReset.confirmButton')}
            isConfirmDisabled={resetEmail.length == 0}
            onConfirm={actionSendPasswordResetRequest}
            isCancelAvailable={true}
            onCancel={() => setShowDialog(false)}
            extraConfirmButtonTitle={t('components.dialog.passwordReset.token')}
            extraConfirmButtonAction={displayResetPasswordDialog}>
            <GladisTextInput
              value={resetEmail}
              placeholder={t('components.dialog.passwordReset.placeholder')}
              onValueChange={setResetEmail}
              width={'100%'}
            />
          </Dialog>
        )}
      </>
    );
  }

  function ResetPasswordWithTokenDialogContent() {
    return (
      <>
        {showResetTokenDialog && (
          <Dialog
            title={t('components.dialog.passwordReset.title')}
            description={dialogDescription}
            onConfirm={resetPasswordWithToken}
            isCancelAvailable={true}
            onCancel={resetDialogs}>
            <>
              <GladisTextInput
                value={token}
                placeholder={t('components.dialog.passwordReset.tokenInput')}
                onValueChange={onTokenChange}
                autoCapitalize={'characters'}
                width={'100%'}
              />
              <GladisTextInput
                value={newPassword}
                placeholder={t('components.dialog.passwordReset.newPassword')}
                onValueChange={onNewPasswordChange}
                secureTextEntry={true}
                autoCapitalize={'none'}
                showVisibilityButton={true}
                width={'100%'}
              />
            </>
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
            duration={toastDuration}
          />
        )}
      </>
    );
  }

  return (
    <>
      <SafeAreaView style={styles.container}>
        <AppIcon style={styles.appIcon} />
        <Text style={styles.title}>{t('login.title')}</Text>
        <GladisTextInput
          value={identifier}
          onValueChange={onIdentifierChange}
          placeholder={t('login.identifier')}
          autoCapitalize={'none'}
          width={'70%'}
          editable={inputIsEditable}
        />
        <GladisTextInput
          value={password}
          onValueChange={onPasswordChange}
          placeholder={t('login.password')}
          secureTextEntry={true}
          onSubmitEditing={submitLogin}
          showVisibilityButton={true}
          autoCapitalize={'none'}
          width={'70%'}
          editable={inputIsEditable}
        />
        <TextButton
          title={t('login.login')}
          onPress={login}
          width={'40%'}
          disabled={isButtonDisabled}
        />
        <SimpleTextButton title={t('login.signUp')} onPress={goToSignUp} />
        <SimpleTextButton
          title={t('login.forgottenPassword')}
          onPress={goToPasswordReset}
        />
      </SafeAreaView>
      {ResetDialogContent()}
      {ResetPasswordWithTokenDialogContent()}
      {ToastContent()}
      <VersionLogAlert show={show} />
    </>
  );
}

export default LoginScreen;
