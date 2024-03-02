import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, Image } from 'react-native';

import IPendingUser from '../../../business-logic/model/IPendingUser';
import IToken from '../../../business-logic/model/IToken';
import NavigationRoutes from '../../../business-logic/model/enums/NavigationRoutes';
import PendingUserService from '../../../business-logic/services/PendingUserService';
import { useAppSelector } from '../../../business-logic/store/hooks';
import { RootState } from '../../../business-logic/store/store';

import { IClientManagementParams } from '../../../navigation/Routes';

import AppContainer from '../../components/AppContainer';
import ContentUnavailableView from '../../components/ContentUnavailableView';
import IconButton from '../../components/IconButton';
import PendingUserRow from './PendingUserRow';

type PendingClientListScreenProps = NativeStackScreenProps<IClientManagementParams, NavigationRoutes.PendingClientListScreen>;

function PendingClientListScreen(props: PendingClientListScreenProps): React.JSX.Element {
  const [pendingUsers, setPendingUsers] = useState<IPendingUser[]>([]);
  const [searchText, setSearchText] = useState<string>('');
  const [isTooltipVisible, setIsTooltipVisible] = useState<boolean>(false);
  const plusIcon = require('../../assets/images/plus.png');
  const { token } = useAppSelector((state: RootState) => state.tokens);
  const { t } = useTranslation();
  const pendingUsersFiltered = pendingUsers.filter(pendingUser =>
    pendingUser.companyName.toLowerCase().includes(searchText.toLowerCase()),
  );

  const { navigation } = props;

  function navigateToCreateClient() {
    navigation.navigate(NavigationRoutes.ClientCreationScreen, { pendingUser: null });
  }

  function navigateBack() {
    navigation.goBack();
  }

  async function getPendingUsers() {
    const castedToken = token as IToken;
    const users = await PendingUserService.getInstance().getUsers(castedToken);
    setPendingUsers(users);
  }

  useEffect(() => {
    async function init() {
      await getPendingUsers();
    }
    init();
  }, []);

  return (
    <AppContainer
      mainTitle={t('pendingUserManagement.title')}
      searchText={searchText}
      setSearchText={setSearchText}
      showBackButton={true}
      navigateBack={navigateBack}
      hideTooltip={() => setIsTooltipVisible(false)}
      adminButton={
        <IconButton
          title={t('components.buttons.addClient')}
          icon={plusIcon}
          onPress={navigateToCreateClient}
        />
      }
    >
      {
        pendingUsersFiltered.length === 0 ? (
          <ContentUnavailableView 
            title={t('pendingUserManagement.noPendingUsers.title')}
            message={t('pendingUserManagement.noPendingUsers.message')}
            image={(
              <Image source={require('../../assets/images/doc.fill.png')} />
            )}
          />
         ) : (
          <FlatList
            data={pendingUsersFiltered}
            renderItem={(renderItem) =>
              <PendingUserRow 
                pendingUser={renderItem.item}
                isTooltipVisible={isTooltipVisible}
                setIsTooltipVisible={setIsTooltipVisible}
                updateFlatList={getPendingUsers}
              />}
            keyExtractor={(item) => item.id}
          />
         )
      }
    </AppContainer>
  );
}

export default PendingClientListScreen;