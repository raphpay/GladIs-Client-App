import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { SafeAreaView, Text } from 'react-native';

import AppIcon from '../../components/AppIcon';

import { IAuthenticationStackParams } from '../../../navigation/Routes';

import IToken from '../../../business-logic/model/IToken';
import IUser from '../../../business-logic/model/IUser';
import CacheKeys from '../../../business-logic/model/enums/CacheKeys';
import UserType from '../../../business-logic/model/enums/UserType';
import CacheService from '../../../business-logic/services/CacheService';
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
    navigateToDashboard(user);
  }

  function goToSignUp() {
    navigation.navigate('SignUpScreen');
  }

  function goToPasswordReset() {
    navigation.navigate('PasswordResetScreen')
  }

  function navigateToDashboard(user: IUser) {
    if (user) {
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
}

  const isButtonDisabled = identifier.length === 0 || password.length === 0;

  useEffect(() => {
    async function init() {
      const token = await CacheService.getInstance().retrieveValue<IToken>(CacheKeys.currentUserToken) as IToken;
      const userID = token.user.id;
      const user = await UserService.getInstance().getUserByID(userID) as IUser;
      navigateToDashboard(user)
    }
    init();
  }, []);

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