import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  SafeAreaView,
  ScrollView,
  View
} from 'react-native';

import IPendingUser from '../../../business-logic/model/IPendingUser';
import IToken from '../../../business-logic/model/IToken';
import NavigationRoutes from '../../../business-logic/model/enums/NavigationRoutes';
import PendingUserService from '../../../business-logic/services/PendingUserService';
import { useAppSelector } from '../../../business-logic/store/hooks';
import { RootState } from '../../../business-logic/store/store';

import { IClientManagementParams } from '../../../navigation/Routes';

import IconButton from '../../components/IconButton';
import PendingUserRow from '../../components/PendingUserRow';

import backIcon from '../../assets/images/arrow.uturn.left.png';
import plusIcon from '../../assets/images/plus.png';
import styles from '../../assets/styles/clientManagement/PendingClientListScreenStyles';

type PendingClientListScreenProps = NativeStackScreenProps<IClientManagementParams, NavigationRoutes.PendingClientListScreen>;

function PendingClientListScreen(props: PendingClientListScreenProps): React.JSX.Element {

  const [pendingUsers, setPendingUsers] = useState<IPendingUser[]>([]);

  const { token } = useAppSelector((state: RootState) => state.tokens);
  const { t } = useTranslation();

  const { navigation } = props;

  function navigateToCreateClient() {
    navigation.navigate(NavigationRoutes.ClientCreationScreen, { pendingUser: null });
  }

  function navigateToSpecificClientCreation(client: IPendingUser) {
    navigation.navigate(NavigationRoutes.ClientCreationScreen, { pendingUser: client });
  }

  function goBack() {
    navigation.goBack();
  }

  useEffect(() => {
    async function init() {
      const castedToken = token as IToken;
      const users = await PendingUserService.getInstance().getUsers(castedToken);
      setPendingUsers(users);
    }
    init();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
       <View style={styles.buttonsContainer}>
        <IconButton
          title={t('components.buttons.back')}
          icon={backIcon}
          onPress={goBack}
          style={styles.button}
        />
        <IconButton
          title={t('components.buttons.addClient')}
          icon={plusIcon}
          onPress={navigateToCreateClient}
          style={styles.button}
        />
       </View>
      <ScrollView >
        {
          pendingUsers.map((user) => (
            <PendingUserRow
              key={user.id}
              pendingUser={user}
              onUserSelect={navigateToSpecificClientCreation}
            />
          ))
        }
      </ScrollView>
    </SafeAreaView>
  );
}

export default PendingClientListScreen;