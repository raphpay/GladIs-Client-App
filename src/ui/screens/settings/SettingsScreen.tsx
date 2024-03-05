import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  StyleSheet,
  Text
} from 'react-native';

import { IRootStackParams } from '../../../navigation/Routes';

import NavigationRoutes from '../../../business-logic/model/enums/NavigationRoutes';

import AppContainer from '../../components/AppContainer';

type SettingsScreenProps = NativeStackScreenProps<IRootStackParams, NavigationRoutes.SettingsScreen>;

function SettingsScreen(props: SettingsScreenProps): React.JSX.Element {
  const { t } = useTranslation();
  const { navigation } = props;

  function navigateBack() {
    navigation.goBack()
  }

  return (
    <AppContainer
      mainTitle={t('settings.title')}
      showSearchText={false}
      showSettings={false}
      showBackButton={true}
      navigateBack={navigateBack}
    >
      <Text>Settings screen</Text>
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