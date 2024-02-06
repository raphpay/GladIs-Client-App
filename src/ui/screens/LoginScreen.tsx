import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { SafeAreaView, Text } from 'react-native';

import AppIcon from '../components/AppIcon';

import { ILoginStackParams } from '../../navigation/Routes';

import styles from '../assets/styles/LoginScreenStyles';
import GladisTextInput from '../components/GladisTextInput';
import SimpleTextButton from '../components/SimpleTextButton';
import TextButton from '../components/TextButton';

type LoginScreenProps = NativeStackScreenProps<ILoginStackParams, 'LoginScreen'>;

function LoginScreen(props: LoginScreenProps): React.JSX.Element {
  const [identifier, onIdentifierChange] = useState('');
  const [password, onPasswordChange] = useState('');

  const { t } = useTranslation();

  function login() {
    props.navigation.navigate(
      'DashboardStack',
      {
        screen: 'DashboardScreen',
        params: { isAdmin: false}
      });
  }

  function goToSignUp() {
    props.navigation.navigate('SignUpScreen');
  }

  function showAlert() {
    // Show alert
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
      <SimpleTextButton title={t('login.forgottenPassword')} onPress={showAlert} />
    </SafeAreaView>
  );
}

export default LoginScreen;