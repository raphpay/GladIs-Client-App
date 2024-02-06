import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useColorScheme
} from 'react-native';

import AppIcon from '../components/AppIcon';
import { Colors } from '../components/colors';

import { ILoginStackParams } from '../../navigation/Routes';

type LoginScreenProps = NativeStackScreenProps<ILoginStackParams, 'LoginScreen'>;

function LoginScreen(props: LoginScreenProps): React.JSX.Element {
  const [email, onEmailChange] = useState('');
  const [password, onPasswordChange] = useState('');

  const { t } = useTranslation();
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.dark : Colors.light,
  };

  const primaryColor = isDarkMode ? Colors.secondary : Colors.primary;

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
    <SafeAreaView style={[backgroundStyle, styles.container]}>
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
      <TouchableOpacity onPress={login} style={[styles.button, { backgroundColor: primaryColor }]}>
        <Text style={[styles.buttonText, { color: Colors.white }]}>
          {t('login.login')}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={goToSignUp}>
        <Text style={[styles.textButtonText, { color: primaryColor }]}>
          {t('login.signUp')}
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textInput: {
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 10,
    width: '70%',
    padding: 10,
    margin: 8
  },
  button: {
    borderRadius: 10,
    height: 50,
    width: '50%',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 8
  },
  buttonText: {
    fontSize: 20,
    fontWeight: '600'
  },
  textButtonText: {
    fontSize: 14,
  },
});

export default LoginScreen;