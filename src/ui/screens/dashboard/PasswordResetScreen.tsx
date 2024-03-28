import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View
} from 'react-native';

import IPasswordResetToken from '../../../business-logic/model/IPasswordResetToken';
import NavigationRoutes from '../../../business-logic/model/enums/NavigationRoutes';
import PasswordResetService from '../../../business-logic/services/PasswordResetService';
import { useAppSelector } from '../../../business-logic/store/hooks';
import { RootState } from '../../../business-logic/store/store';

import { IRootStackParams } from '../../../navigation/Routes';

import Utils from '../../../business-logic/utils/Utils';
import AppContainer from '../../components/AppContainer';
import Grid from '../../components/Grid';

type PasswordResetScreenProps = NativeStackScreenProps<IRootStackParams, NavigationRoutes.PasswordResetScreen>;

// TODO: Add some styles
function PasswordResetScreen(props: PasswordResetScreenProps): React.JSX.Element {

  const { navigation } = props;

  const { token } = useAppSelector((state: RootState) => state.tokens);

  const [passwordsToReset, setPasswordsToReset] = useState<IPasswordResetToken[]>([]);

  function navigateBack() {
    navigation.goBack();
  }

  async function loadPasswordsToReset() {
    try {
      const apiTokens = await PasswordResetService.getInstance().getAll(token);
      setPasswordsToReset(apiTokens);
    } catch (error) {
      // TODO: Handle error
      console.log('error', error);
    }
  }

  useEffect(() => {
    async function init() {
      await loadPasswordsToReset();
    }
    init();
  }, []);

  function PasswordRow(item: IPasswordResetToken) {
    const expirationDate = new Date(item.expiresAt);
    const dateString = Utils.formatDate(expirationDate);
    const timeString = Utils.formatTime(expirationDate);

    return (
      <View>
        <Text>{item.userEmail}</Text>
        <Text>{dateString}</Text>
        <Text>{timeString}</Text>
      </View>
    )
  }

  return (
    <AppContainer
      mainTitle='Password Reset'
      showBackButton={true}
      showSearchText={false}
      showSettings={true}
      navigateBack={navigateBack}
    >
      <Grid
        data={passwordsToReset}
        renderItem={({ item }) => PasswordRow(item)}
      />
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

export default PasswordResetScreen;