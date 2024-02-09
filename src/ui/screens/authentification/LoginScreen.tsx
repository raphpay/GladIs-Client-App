import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { SafeAreaView, Text } from 'react-native';

import AppIcon from '../../components/AppIcon';

import { IAuthenticationStackParams } from '../../../navigation/Routes';

import IToken from '../../../business-logic/model/IToken';
import IUser from '../../../business-logic/model/IUser';
import UserType from '../../../business-logic/model/enums/UserType';
import UserService from '../../../business-logic/services/UserService';
import { useAppDispatch, useAppSelector } from '../../../business-logic/store/hooks';
import { setToken, setUser } from '../../../business-logic/store/slices/tokenReducer';
import { RootState } from '../../../business-logic/store/store';

import GladisTextInput from '../../components/GladisTextInput';
import SimpleTextButton from '../../components/SimpleTextButton';
import TextButton from '../../components/TextButton';

import CacheKeys from '../../../business-logic/model/enums/CacheKeys';
import CacheService from '../../../business-logic/services/CacheService';
import styles from '../../assets/styles/authentification/LoginScreenStyles';

type LoginScreenProps = NativeStackScreenProps<IAuthenticationStackParams, 'LoginScreen'>;

function LoginScreen(props: LoginScreenProps): React.JSX.Element {
  const { navigation } = props;

  const [identifier, onIdentifierChange] = useState('');
  const [password, onPasswordChange] = useState('');

  const { t } = useTranslation();

  const { token, user } = useAppSelector((state: RootState) => state.token);
  const dispatch = useAppDispatch();

  async function login() {
    const loginResult = await UserService.getInstance().login(identifier, password);
    onIdentifierChange('');
    onPasswordChange('');
    const user = loginResult.user as IUser;
    const token = loginResult.token as IToken;
    dispatch(setUser(user));
    dispatch(setToken(token));
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
      const firstConnectionScreen = isAdmin ? 'AdminFirstConnectionScreen' : 'ClientFirstConnectionScreen';
      const dashboardStack = isAdmin ? 'AdminDashboardStack' : 'ClientDashboardStack';
      const dashboardScreen = isAdmin ? 'DashboardAdminScreen' : 'DashboardClientScreen';

      navigation.navigate(dashboardStack, {
        screen: user.firstConnection ? firstConnectionScreen : dashboardScreen,
        params: user.firstConnection ? { temporaryPassword: password } : undefined
      });
    }
}

  const isButtonDisabled = identifier.length === 0 || password.length === 0;

  useEffect(() => {
    async function init() {
      if (token && user) {
        navigateToDashboard(user);
      } else {
        const cachedToken = await CacheService.getInstance().retrieveValue(CacheKeys.currentUserToken) as IToken;
        const cachedUserID = await CacheService.getInstance().retrieveValue(CacheKeys.currentUserID) as string;
        const user = await UserService.getInstance().getUserByID(cachedUserID, cachedToken);
        navigateToDashboard(user);
      }
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