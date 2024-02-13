import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet
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

import plusIcon from '../../assets/images/plus.png';

type PendingClientListScreenProps = NativeStackScreenProps<IClientManagementParams, NavigationRoutes.PendingClientListScreen>;

function PendingClientListScreen(props: PendingClientListScreenProps): React.JSX.Element {

  const [pendingUsers, setPendingUsers] = useState<IPendingUser[]>([]);

  const { token } = useAppSelector((state: RootState) => state.tokens);
  const { t } = useTranslation();

  const { navigation } = props;

  function navigateToClientList() {
    // TODO: Add pending user parameter for when selecting one specific user
    navigation.navigate(NavigationRoutes.ClientCreationScreen);
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
       <IconButton
        title={t('components.buttons.addClient')}
        icon={plusIcon}
        onPress={navigateToClientList}
      />
      <ScrollView>
        {
          pendingUsers.map((user) => (
            <PendingUserRow key={user.id} pendingUser={user}/>
          ))
        }
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default PendingClientListScreen;