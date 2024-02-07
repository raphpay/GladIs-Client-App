import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { SafeAreaView, Text } from 'react-native';

import AppIcon from '../../components/AppIcon';

import { IAuthenticationStackParams } from '../../../navigation/Routes';

import styles from '../../assets/styles/LoginScreenStyles';
import GladisTextInput from '../../components/GladisTextInput';
import SimpleTextButton from '../../components/SimpleTextButton';
import TextButton from '../../components/TextButton';

type LoginScreenProps = NativeStackScreenProps<IAuthenticationStackParams, 'LoginScreen'>;

function LoginScreen(props: LoginScreenProps): React.JSX.Element {
  const { navigation } = props;

  const [identifier, onIdentifierChange] = useState('');
  const [password, onPasswordChange] = useState('');

  const { t } = useTranslation();

  function login() {
    // TODO: The params should not be hardcoded
    navigation.navigate(
      'DashboardStack',
      {
        screen: 'DashboardScreen',
        params: { isFirstConnection: true, isAdmin: false, temporaryPassword: password }
      });
  }

  function goToSignUp() {
    navigation.navigate('SignUpScreen');
  }

  function goToPasswordReset() {
    navigation.navigate('PasswordResetScreen')
  }

  return (
    <SafeAreaView style={styles.container}>
      <AppIcon />
      <Text>{t('login.title')}</Text>
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
      <TextButton title={t('login.login')} onPress={login} width={'40%'}/>
      <SimpleTextButton title={t('login.signUp')} onPress={goToSignUp} />
      <SimpleTextButton title={t('login.forgottenPassword')} onPress={goToPasswordReset} />
    </SafeAreaView>
  );
}

export default LoginScreen;