import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { SafeAreaView, Text, TextInput } from 'react-native';

import { IRootStackParams } from '../../../navigation/Routes';

import NavigationRoutes from '../../../business-logic/model/enums/NavigationRoutes';
import AuthenticationService from '../../../business-logic/services/AuthenticationService';
import UserService from '../../../business-logic/services/UserService';
import { useAppDispatch } from '../../../business-logic/store/hooks';
import { setToken } from '../../../business-logic/store/slices/tokenReducer';
import { setCurrentUser } from '../../../business-logic/store/slices/userReducer';

import AppIcon from '../../components/AppIcon';
import Dialog from '../../components/Dialog';
import ErrorDialog from '../../components/ErrorDialog';
import GladisTextInput from '../../components/GladisTextInput';
import SimpleTextButton from '../../components/SimpleTextButton';
import TextButton from '../../components/TextButton';

import styles from '../../assets/styles/authentification/LoginScreenStyles';

type LoginScreenProps = NativeStackScreenProps<IRootStackParams, NavigationRoutes.LoginScreen>;

function LoginScreen(props: LoginScreenProps): React.JSX.Element {
  const { navigation } = props;
  
  const [identifier, onIdentifierChange] = useState<string>('');
  const [password, onPasswordChange] = useState<string>('');
  const [showDialog, setShowDialog] = useState<boolean>(false);
  const [resetEmail, setResetEmail] = useState<string>('');
  const [showErrorDialog, setShowErrorDialog] = useState<boolean>(false);
  const [errorTitle, setErrorTitle] = useState<string>('');
  const [errorDescription, setErrorDescription] = useState<string>('');
  
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  async function login() {
    try {
      const token = await AuthenticationService.getInstance().login(identifier, password);
      dispatch(setToken(token));
      const user = await UserService.getInstance().getUserByID(token.user.id);
      dispatch(setCurrentUser(user));
    } catch (error) {
      setErrorTitle(t('errors.login.title'));
      setErrorDescription(t('errors.login.message'));
      setShowErrorDialog(true);
    }
  }

  function goToSignUp() {
    navigation.navigate(NavigationRoutes.SignUpScreen);
  }

  function goToPasswordReset() {
    setShowDialog(true);
  }

  function sendPasswordResetRequest() {
    // TODO: Send password request
  }

  async function submitLogin() {
    if (identifier.length !== 0 && password.length !== 0) {
      await login();
    }
  }

  const isButtonDisabled = identifier.length === 0 || password.length === 0;

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
          editable={!showDialog && !showErrorDialog}
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
          editable={!showDialog && !showErrorDialog}
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
      {
        showDialog && (
          <Dialog
            title={t('components.dialog.passwordReset.title')}
            confirmTitle={t('components.dialog.passwordReset.confirmButton')}
            isConfirmDisabled={resetEmail.length == 0}
            onConfirm={sendPasswordResetRequest}
            onCancel={() => setShowDialog(false)}
          >
            <TextInput
              value={resetEmail}
              onChangeText={setResetEmail}
              placeholder={t('components.dialog.passwordReset.placeholder')}
              style={styles.dialogInput}
            />
          </Dialog>
        )
      }
      {
        showErrorDialog && (
          <ErrorDialog
            title={errorTitle}
            description={errorDescription}
            cancelTitle={t('errors.modules.cancelButton')}
            onCancel={() => setShowErrorDialog(false)}
          />
        )
      }
    </>
  );
}

export default LoginScreen;