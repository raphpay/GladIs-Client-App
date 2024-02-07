import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  SafeAreaView,
  Text
} from 'react-native';
import { IDashboardStackParams } from '../../../navigation/Routes';
import styles from '../../assets/styles/dashboard/FirstConnectionScreenStyles';
import GladisTextInput from '../../components/GladisTextInput';
import TextButton from '../../components/TextButton';

type FirstConnectionScreenProps = NativeStackScreenProps<IDashboardStackParams, 'FirstConnectionScreen'>;

function FirstConnectionScreen(props: FirstConnectionScreenProps): React.JSX.Element {
  const [temporary, setTemporary] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');

  const { navigation } = props;
  const { isAdmin, temporaryPassword } =  props.route.params;

  console.log('temp', temporaryPassword);

  const { t } = useTranslation();

  function modifyPassword() {
    // TODO: Handle the logic
    if (isAdmin) {
      // TODO: Create constants
      navigation.navigate('DashboardAdminScreen', { isAdmin })
    } else {
      navigation.navigate('DashboardClientScreen', { isAdmin })
    }
  }

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
      <TextButton title={t('components.buttons.continue')} onPress={modifyPassword} />
    </SafeAreaView>
  );
}

export default FirstConnectionScreen;