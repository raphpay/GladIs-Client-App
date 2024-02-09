import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  SafeAreaView,
  Text
} from 'react-native';
import { IAdminDashboardStackParams } from '../../../navigation/Routes';

import IToken from '../../../business-logic/model/IToken';
import IUser from '../../../business-logic/model/IUser';
import UserService from '../../../business-logic/services/UserService';
import { useAppSelector } from '../../../business-logic/store/hooks';
import { RootState } from '../../../business-logic/store/store';

import GladisTextInput from '../../components/GladisTextInput';
import TextButton from '../../components/TextButton';

import styles from '../../assets/styles/dashboard/FirstConnectionScreenStyles';

type AdminFirstConnectionScreen = NativeStackScreenProps<IAdminDashboardStackParams, 'AdminFirstConnectionScreen'>;

function AdminFirstConnectionScreen(props: AdminFirstConnectionScreen): React.JSX.Element {
  const [temporary, setTemporary] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');

  const { navigation } = props;
  const { temporaryPassword } =  props.route.params;

  const { token, user } = useAppSelector((state: RootState) => state.token);

  const { t } = useTranslation();

  async function modifyPassword() {
    const castedUser = user as IUser;
    const castedToken = token as IToken;
    await UserService.getInstance().changePassword(temporary, newPassword, castedUser, castedToken);
    await UserService.getInstance().setUserFirstConnectionToFalse(castedUser, castedToken);
    navigation.navigate('DashboardAdminScreen');
  }

  useEffect(() => {
     setTemporary(temporaryPassword ?? '');
  }, []);

  useEffect(() => {
    if (token == null) {
      navigation.goBack();
    }
  }, [navigation]);

  const isButtonDisabled = temporary.length == 0 || newPassword.length == 0;

  return (
    <SafeAreaView style={styles.container}>
      <Text>{t('firstConnection.title')}</Text>
      <GladisTextInput 
        placeholder={t('firstConnection.temporary')}
        value={temporary}
        onValueChange={setTemporary}
        secureTextEntry={true}
      />
      <GladisTextInput 
        placeholder={t('firstConnection.new')}
        value={newPassword}
        onValueChange={setNewPassword}
        secureTextEntry={true}
      />
      <TextButton
        title={t('components.buttons.continue')}
        onPress={modifyPassword}
        disabled={isButtonDisabled}
      />
    </SafeAreaView>
  );
}

export default AdminFirstConnectionScreen;