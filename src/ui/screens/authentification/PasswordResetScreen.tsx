import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  SafeAreaView,
  Text,
  View
} from 'react-native';

import NavigationRoutes from '../../../business-logic/model/enums/NavigationRoutes';

import GladisTextInput from '../../components/GladisTextInput';
import IconButton from '../../components/IconButton';
import TextButton from '../../components/TextButton';

import { IRootStackParams } from '../../../navigation/Routes';

import backIcon from '../../assets/images/arrow.uturn.left.png';
import styles from '../../assets/styles/authentification/PasswordResetStyles';

type PasswordResetScreenProps = NativeStackScreenProps<IRootStackParams, NavigationRoutes.PasswordResetScreen>;

function PasswordResetScreen(props: PasswordResetScreenProps): React.JSX.Element {
  const [email, setEmail] = useState<string>('');

  const { t } = useTranslation();
  const { navigation } = props;

  // TODO: Handle password reset
  function resetPassword() {}

  function goBack() {
    navigation.goBack();
  }

  const isButtonDisabled = email.length === 0;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.backButtonContainer}>
        <IconButton
          title={t('components.buttons.back')}
          icon={backIcon}
          onPress={goBack}
        />
      </View>
      <View style={styles.container}>
        <Text style={styles.title}>
          {t('passwordReset.title')}
        </Text>
        <Text style={styles.message}>
          {t('passwordReset.message')}
        </Text>
        <GladisTextInput
          value={email}
          onValueChange={setEmail}
          placeholder={t('passwordReset.email')}
        />
        <TextButton
          title={t('passwordReset.reset')}
          onPress={resetPassword}
          width={'50%'}
          disabled={isButtonDisabled}
        />
      </View>
    </SafeAreaView>
  );
}

export default PasswordResetScreen;