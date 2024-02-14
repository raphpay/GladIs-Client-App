import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, SafeAreaView, Text } from 'react-native';

import { IRootStackParams } from '../../../navigation/Routes';

import NavigationRoutes from '../../../business-logic/model/enums/NavigationRoutes';
import AuthenticationService from '../../../business-logic/services/AuthenticationService';
import { useAppDispatch } from '../../../business-logic/store/hooks';
import { setToken } from '../../../business-logic/store/slices/tokenReducer';

import AppIcon from '../../components/AppIcon';
import GladisTextInput from '../../components/GladisTextInput';
import SimpleTextButton from '../../components/SimpleTextButton';
import TextButton from '../../components/TextButton';

import IToken from '../../../business-logic/model/IToken';
import styles from '../../assets/styles/authentification/LoginScreenStyles';

type LoginScreenProps = NativeStackScreenProps<IRootStackParams, NavigationRoutes.LoginScreen>;

function LoginScreen(props: LoginScreenProps): React.JSX.Element {
  const { navigation } = props;

  const [identifier, onIdentifierChange] = useState('');
  const [password, onPasswordChange] = useState('');

  const { t } = useTranslation();

  const dispatch = useAppDispatch();

  async function login() {
    await AuthenticationService.getInstance()
      .login(identifier, password)
      .then((token: IToken) => {
        dispatch(setToken(token));
      })
      .catch(() => {
        Alert.alert(t('errors.login.title'), t('errors.login.message'))
      });
  }

  function goToSignUp() {
    navigation.navigate(NavigationRoutes.SignUpScreen);
  }

  function goToPasswordReset() {
    navigation.navigate(NavigationRoutes.PasswordResetScreen)
  }

  const isButtonDisabled = identifier.length === 0 || password.length === 0;

  return (
    <SafeAreaView style={styles.container}>
      <AppIcon />
      <Text style={styles.title} >{t('login.title')}</Text>
      <GladisTextInput
        value={identifier}
        onValueChange={onIdentifierChange}
        placeholder={t('login.identifier')}
        autoCapitalize={'none'}
      />
      <GladisTextInput
        value={password}
        onValueChange={onPasswordChange}
        placeholder={t('login.password')}
        secureTextEntry={true}
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
  );
}

export default LoginScreen;