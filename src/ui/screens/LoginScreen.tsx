import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { SafeAreaView, Text, TouchableOpacity } from 'react-native';

import { Colors } from '../assets/colors/colors';
import AppIcon from '../components/AppIcon';

import { ILoginStackParams } from '../../navigation/Routes';

import styles from '../assets/styles/LoginScreenStyles';
import GladisTextInput from '../components/GladisTextInput';

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
      <TouchableOpacity onPress={login} style={styles.button}>
        <Text style={[styles.buttonText, { color: Colors.white }]}>
          {t('login.login')}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={goToSignUp}>
        <Text style={styles.textButtonText}>
          {t('login.signUp')}
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

export default LoginScreen;