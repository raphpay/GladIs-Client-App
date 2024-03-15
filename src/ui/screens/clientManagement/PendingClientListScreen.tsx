import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList } from 'react-native';

import IPendingUser from '../../../business-logic/model/IPendingUser';
import IToken from '../../../business-logic/model/IToken';
import NavigationRoutes from '../../../business-logic/model/enums/NavigationRoutes';
import PendingUserService from '../../../business-logic/services/PendingUserService';
import { useAppSelector } from '../../../business-logic/store/hooks';
import { RootState } from '../../../business-logic/store/store';

import { IClientCreationStack } from '../../../navigation/Routes';

import AppContainer from '../../components/AppContainer';
import ContentUnavailableView from '../../components/ContentUnavailableView';
import Dialog from '../../components/Dialog';
import IconButton from '../../components/IconButton';
import PendingUserRow from './PendingUserRow';

type PendingClientListScreenProps = NativeStackScreenProps<IClientCreationStack, NavigationRoutes.PendingClientListScreen>;

function PendingClientListScreen(props: PendingClientListScreenProps): React.JSX.Element {
  const [pendingUsers, setPendingUsers] = useState<IPendingUser[]>([]);
  const [searchText, setSearchText] = useState<string>('');
  const [isTooltipVisible, setIsTooltipVisible] = useState<boolean>(false);
  const [showDialog, setShowDialog] = useState<boolean>(false);
  const [selectedPendingUser, setSelectedPendingUser] = useState<IPendingUser | undefined>(undefined);

  const plusIcon = require('../../assets/images/plus.png');
  const docIcon = require('../../assets/images/doc.fill.png');
  
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

  async function removePendingUser() {
    await PendingUserService.getInstance().removePendingUser(selectedPendingUser?.id, token);
    await getPendingUsers();
    setShowDialog(false);
  }

  useEffect(() => {
    async function init() {
      await getPendingUsers();
    }
    init();
  }, []);

  function dialogContent() {
    return (
      <>
        {
          showDialog && (
            <Dialog
              title={t('components.dialog.pendingUserManagement.title')}
              description={t('components.dialog.pendingUserManagement.description')}
              onConfirm={removePendingUser}
              isCancelAvailable={true}
              onCancel={() => setShowDialog(false)}
            />
          )
        }
      </>
    )
  }

  // TODO: check dialog={dialogContent()}
  return (
    <AppContainer
      mainTitle={t('pendingUserManagement.title')}
      searchText={searchText}
      setSearchText={setSearchText}
      showBackButton={true}
      navigateBack={navigateBack}
      hideTooltip={() => setIsTooltipVisible(false)}
      showDialog={showDialog}
      dialog={dialogContent()}
      setShowDialog={setShowDialog}
      showSearchText={true}
      showSettings={true}
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
            image={docIcon}
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
                setShowDialog={setShowDialog}
                setSelectedPendingUser={setSelectedPendingUser}
              />}
            keyExtractor={(item) => item.id}
          />
         )
      }
    </AppContainer>
  );
}

export default PendingClientListScreen;