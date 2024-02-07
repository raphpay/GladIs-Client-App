import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  SafeAreaView,
  Text
} from 'react-native';

import GladisTextInput from '../../components/GladisTextInput';
import TextButton from '../../components/TextButton';

import styles from '../../assets/styles/authentification/PasswordResetStyles';

function PasswordResetScreen(): React.JSX.Element {
  const [email, setEmail] = useState<string>('');

  const { t } = useTranslation();

  function resetPassword() {}

  const isButtonDisabled = email.length === 0;

  return (
    <SafeAreaView style={styles.container}>
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
    </SafeAreaView>
  );
}

export default PasswordResetScreen;