import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { SafeAreaView, Text } from 'react-native';

import { IRootStackParams } from '../../../navigation/Routes';

import IToken from '../../../business-logic/model/IToken';
import NavigationRoutes from '../../../business-logic/model/enums/NavigationRoutes';
import UserType from '../../../business-logic/model/enums/UserType';
import AuthenticationService from '../../../business-logic/services/AuthenticationService';
import PasswordResetService from '../../../business-logic/services/PasswordResetService';
import UserService from '../../../business-logic/services/UserService';
import { useAppDispatch } from '../../../business-logic/store/hooks';
import { setToken } from '../../../business-logic/store/slices/tokenReducer';
import { setCurrentClient, setCurrentUser } from '../../../business-logic/store/slices/userReducer';

import AppIcon from '../../components/AppIcon';
import Dialog from '../../components/Dialog';
import GladisTextInput from '../../components/GladisTextInput';
import SimpleTextButton from '../../components/SimpleTextButton';
import TextButton from '../../components/TextButton';
import Toast from '../../components/Toast';

import styles from '../../assets/styles/authentification/LoginScreenStyles';

type LoginScreenProps = NativeStackScreenProps<IRootStackParams, NavigationRoutes.LoginScreen>;

function LoginScreen(props: LoginScreenProps): React.JSX.Element {
  const { navigation } = props;
  
  const [identifier, onIdentifierChange] = useState<string>('');
  const [password, onPasswordChange] = useState<string>('');
  const [showDialog, setShowDialog] = useState<boolean>(false);
  const [showResetTokenDialog, setShowResetTokenDialog] = useState<boolean>(false);
  const [dialogDescription, setDialogDescription] = useState<string>('');
  const [resetEmail, setResetEmail] = useState<string>('');
  const [token, onTokenChange] = useState<string>('');
  const [newPassword, onNewPasswordChange] = useState<string>('');
  const [showToast, setShowToast] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string>('');
  const [toastIsShowingError, setToastIsShowingError] = useState<boolean>(false);

  const inputIsEditable = !showDialog && !showResetTokenDialog;
  const isButtonDisabled = identifier.length === 0 || password.length === 0;
  
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

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

  function displayToast(message: string, isError: boolean = false) {
    setShowToast(true);
    setToastIsShowingError(isError);
    setToastMessage(message);
  }

  // Async Methods
  async function submitLogin() {
    if (identifier.length !== 0 && password.length !== 0) {
      await login();
    }
  }

  async function login() {
    let token: IToken | undefined;
    try {
      token = await AuthenticationService.getInstance().login(identifier, password);
    } catch (error) {
      const errorMessage = (error as Error).message;
      displayToast(t(`errors.api.${errorMessage}`), true);
    }

    if (token) {
      try {
        const user = await UserService.getInstance().getUserByID(token.user.id, token);
        dispatch(setCurrentUser(user));
        if (user.userType !== UserType.Admin) {
          dispatch(setCurrentClient(user));
        }
        dispatch(setToken(token));
      } catch (error) {
        const errorMessage = (error as Error).message;
        displayToast(t(`errors.api.${errorMessage}`), true);
      }
    }
  }

  async function sendPasswordResetRequest() {
    if (resetEmail.length > 0) {
      try {
        await PasswordResetService.getInstance().requestPasswordReset(resetEmail);
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
        await PasswordResetService.getInstance().resetPassword(token, newPassword);
        resetDialogs();
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
        {
          showDialog && (
            <Dialog
              title={t('components.dialog.passwordReset.title')}
              description={dialogDescription}
              confirmTitle={t('components.dialog.passwordReset.confirmButton')}
              isConfirmDisabled={resetEmail.length == 0}
              onConfirm={sendPasswordResetRequest}
              isCancelAvailable={true}
              onCancel={() => setShowDialog(false)}
              extraConfirmButtonTitle={t('components.dialog.passwordReset.token')}
              extraConfirmButtonAction={displayResetPasswordDialog}
            >
              <GladisTextInput 
                value={resetEmail}
                placeholder={t('components.dialog.passwordReset.placeholder')}
                onValueChange={setResetEmail}
                autoCapitalize={'characters'}
                width={'100%'}
              />
            </Dialog>
          )
        }
      </>
    )
  }

  function ResetPasswordWithTokenDialogContent() {
    return (
      <>
        {
          showResetTokenDialog && (
            <Dialog
              title={t('components.dialog.passwordReset.title')}
              description={dialogDescription}
              onConfirm={resetPasswordWithToken}
              isCancelAvailable={true}
              onCancel={resetDialogs}
            >
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
              isShowingError={toastIsShowingError}
            />
          )
        }
      </>
    )
  }

  return (
    <>
      <SafeAreaView style={styles.container}>
        <AppIcon style={styles.appIcon} />
        <Text style={styles.title} >{t('login.title')}</Text>
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
        <SimpleTextButton title={t('login.forgottenPassword')} onPress={goToPasswordReset} />
      </SafeAreaView>
      {ResetDialogContent()}
      {ResetPasswordWithTokenDialogContent()}
      {ToastContent()}
    </>
  );
}

export default LoginScreen;