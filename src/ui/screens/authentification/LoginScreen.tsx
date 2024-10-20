import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { SafeAreaView, Text, TouchableOpacity } from 'react-native';

import { IRootStackParams } from '../../../navigation/Routes';

import LoginScreenManager from '../../../business-logic/manager/authentification/LoginScreenManager';
import { IEventInput } from '../../../business-logic/model/IEvent';
import IToken from '../../../business-logic/model/IToken';
import { ILoginTryOutput } from '../../../business-logic/model/IUser';
import NavigationRoutes from '../../../business-logic/model/enums/NavigationRoutes';
import UserType from '../../../business-logic/model/enums/UserType';
import CacheService from '../../../business-logic/services/CacheService';
import EventServicePost from '../../../business-logic/services/EventService/EventService.post';
import PasswordResetService from '../../../business-logic/services/PasswordResetService';
import UserServiceGet from '../../../business-logic/services/UserService/UserService.get';
import { useAppDispatch } from '../../../business-logic/store/hooks';
import { setToken } from '../../../business-logic/store/slices/tokenReducer';
import { setCurrentClient, setCurrentUser, setIsAdmin } from '../../../business-logic/store/slices/userReducer';

import AppIcon from '../../components/AppIcon';
import SimpleTextButton from '../../components/Buttons/SimpleTextButton';
import TextButton from '../../components/Buttons/TextButton';
import Dialog from '../../components/Dialogs/Dialog';
import GladisTextInput from '../../components/TextInputs/GladisTextInput';
import Toast from '../../components/Toast';

import FileOpenPicker from '../../../business-logic/modules/FileOpenPicker'

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
  // Toast
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
    } else {
      displayToast(t('login.errors.fillForm'), true);
    }
  }

  async function login() {
    try {
      const token = await LoginScreenManager.getInstance().login(identifier, password);
      await dispatchValues(token);
    } catch (error) {
      const errorMessage = (error as Error).message;
      if (errorMessage.includes('unauthorized.login')) {
        await handleFailedLogin();
      } else {
        displayToast(t(`errors.api.${errorMessage}`), true);
      }
    }
  }

  async function handleFailedLogin() {
    try {
      const output = await LoginScreenManager.getInstance().updateUserConnectionAttempts(identifier);
      const count = output.connectionFailedAttempts || 0;
      if (count >= 5) {
        if (count === 5) {
          sendMaxLoginEvent(output);
        }
        displayToast(t('errors.api.unauthorized.login.connectionBlocked'), true);
      } else {
        displayToast(t('errors.api.unauthorized.login'), true);
      }
    } catch (error) {
      const errorMessage = (error as Error).message;
      console.log('handleFailedLogin error', errorMessage );
      displayToast(t(`errors.api.${errorMessage}`), true);
    }
  }

  async function sendMaxLoginEvent(tryOutput: ILoginTryOutput) {
    try {
      const event: IEventInput = {
        name: `${t('login.tooManyAttempts.eventName')} ${identifier} : ${tryOutput.email}`,
        date: Date.now(),
        clientID: tryOutput.id ?? '0',
      }
      await EventServicePost.createMaxAttemptsEvent(event);
    } catch (error) {
      console.log('Error sending max attempts event', error );
    }
  }

  async function dispatchValues(token: IToken) {
    try {
      const user = await UserServiceGet.getUserByID(token.user.id, token);
      dispatch(setCurrentUser(user));
      dispatch(setIsAdmin(user.userType === UserType.Admin))
      if (user.userType !== UserType.Admin) {
        dispatch(setCurrentClient(user));
      }
      dispatch(setToken(token));
    } catch (error) {
      const errorMessage = (error as Error).message;
      displayToast(t(`errors.api.${errorMessage}`), true);
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

  async function openPicker() {
    console.log("testFileOpenPicker")
    const filePath = await FileOpenPicker?.pickPDFFile();
    console.log("testFileOpenPicker", filePath)
  }

  async function testImageOpenPicker() {
    const filePath = await FileOpenPicker?.pickImageFile();
    console.log("testImageOpenPicker", filePath)
  }

  return (
    <TouchableOpacity onPress={openPicker}>
      <Text>Open picker</Text>
    </TouchableOpacity>
  );
}

export default LoginScreen;