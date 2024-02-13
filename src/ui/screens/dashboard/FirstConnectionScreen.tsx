import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  SafeAreaView,
  Text
} from 'react-native';
import { IRootStackParams } from '../../../navigation/Routes';

import NavigationRoutes from '../../../business-logic/model/enums/NavigationRoutes';
import UserService from '../../../business-logic/services/UserService';
import { useAppDispatch } from '../../../business-logic/store/hooks';
import { setFirstConnection } from '../../../business-logic/store/slices/userReducer';

import GladisTextInput from '../../components/GladisTextInput';
import TextButton from '../../components/TextButton';

import styles from '../../assets/styles/dashboard/FirstConnectionScreenStyles';

type FirstConnectionScreenProps = NativeStackScreenProps<IRootStackParams, NavigationRoutes.FirstConnectionScreen>;

function FirstConnectionScreen(props: FirstConnectionScreenProps): React.JSX.Element {
  const [temporary, setTemporary] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');

  const { navigation } = props;

  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  async function modifyPassword() {
    try {
      await UserService.getInstance().changePassword(temporary, newPassword);
      await UserService.getInstance().setUserFirstConnectionToFalse();
      dispatch(setFirstConnection(false));
    } catch (error) {
      console.log('Error changing password', error);
    }
  }


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

export default FirstConnectionScreen;