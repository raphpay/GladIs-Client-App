import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity
} from 'react-native';

import AppIcon from '../components/AppIcon';
import { Colors } from '../components/colors';

import { ILoginStackParams } from '../../navigation/Routes';

import styles from '../assets/styles/LoginScreenStyles';

type LoginScreenProps = NativeStackScreenProps<ILoginStackParams, 'LoginScreen'>;

function LoginScreen(props: LoginScreenProps): React.JSX.Element {
  const [email, onEmailChange] = useState('');
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
      <TextInput
        value={email}
        onChangeText={onEmailChange}
        placeholder={t('login.email')}
        keyboardType='email-address'
        style={styles.textInput}
      />
      <TextInput
        value={password}
        onChangeText={onPasswordChange}
        placeholder={t('login.password')}
        style={styles.textInput}
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