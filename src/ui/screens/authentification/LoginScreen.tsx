import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { SafeAreaView, Text } from 'react-native';

import AppIcon from '../../components/AppIcon';

import { IAuthenticationStackParams } from '../../../navigation/Routes';

import UserType from '../../../business-logic/model/enums/UserType';
import UserService from '../../../business-logic/services/UserService';

import GladisTextInput from '../../components/GladisTextInput';
import SimpleTextButton from '../../components/SimpleTextButton';
import TextButton from '../../components/TextButton';

import styles from '../../assets/styles/authentification/LoginScreenStyles';

type LoginScreenProps = NativeStackScreenProps<IAuthenticationStackParams, 'LoginScreen'>;

function LoginScreen(props: LoginScreenProps): React.JSX.Element {
  const { navigation } = props;

  const [identifier, onIdentifierChange] = useState('');
  const [password, onPasswordChange] = useState('');

  const { t } = useTranslation();

  async function login() {
    const user = await UserService.getInstance().login(identifier, password);
    const isAdmin = user.userType == UserType.Admin;
    navigation.navigate(
      'DashboardStack',
      {
        screen: 'DashboardScreen',
        params: {
          isFirstConnection: user.firstConnection,
          isAdmin,
          temporaryPassword: user.firstConnection ? password : ''
        }
      });
  }

  function goToSignUp() {
    navigation.navigate('SignUpScreen');
  }

  function goToPasswordReset() {
    navigation.navigate('PasswordResetScreen')
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