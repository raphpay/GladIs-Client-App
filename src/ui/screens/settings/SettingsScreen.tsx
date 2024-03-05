import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  StyleSheet,
  Text
} from 'react-native';

import AppContainer from '../../components/AppContainer';

function SettingsScreen(): React.JSX.Element {
  const { t } = useTranslation();

  return (
    <AppContainer
      mainTitle={t('settings.title')}
      showSearchText={false}
    >
      <Text>Hello</Text>
    </AppContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default SettingsScreen;