import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Text, TouchableOpacity } from 'react-native';

import IPendingUser from '../../../business-logic/model/IPendingUser';
import IToken from '../../../business-logic/model/IToken';
import NavigationRoutes from '../../../business-logic/model/enums/NavigationRoutes';
import PendingUserService from '../../../business-logic/services/PendingUserService';
import { useAppSelector } from '../../../business-logic/store/hooks';
import { RootState } from '../../../business-logic/store/store';

import { IClientCreationStack } from '../../../navigation/Routes';

import PendingUserStatus from '../../../business-logic/model/enums/PendingUserStatus';
import AppContainer from '../../components/AppContainer';
import ContentUnavailableView from '../../components/ContentUnavailableView';
import Dialog from '../../components/Dialog';
import Grid from '../../components/Grid';
import IconButton from '../../components/IconButton';
import PendingUserRow from './PendingUserRow';

import styles from '../../assets/styles/clientManagement/PendingClientListScreenStyles';

interface IPendingUserAction {
  title: string;
  onPress: () => void;
}

type PendingClientListScreenProps = NativeStackScreenProps<IClientCreationStack, NavigationRoutes.PendingClientListScreen>;

function PendingClientListScreen(props: PendingClientListScreenProps): React.JSX.Element {
  const [pendingUsers, setPendingUsers] = useState<IPendingUser[]>([]);
  const [searchText, setSearchText] = useState<string>('');
  const [showDialog, setShowDialog] = useState<boolean>(false);
  const [selectedPendingUser, setSelectedPendingUser] = useState<IPendingUser>();
  const [showPendingUserDialog, setShowPendingUserDialog] = useState<boolean>(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState<boolean>(false);

  const plusIcon = require('../../assets/images/plus.png');
  const docIcon = require('../../assets/images/doc.fill.png');
  
  const { token } = useAppSelector((state: RootState) => state.tokens);
  const { pendingUserListCount } = useAppSelector((state: RootState) => state.appState);

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

  const popoverActions: IPendingUserAction[] = [
    {
      title: t('components.tooltip.open'),
      onPress: () => navigateToSpecificClientCreation(selectedPendingUser as IPendingUser),
    },
    {
      title: t('components.tooltip.pendingUserManagement.status.pending'),
      onPress: () => updatePendingUserStatus(selectedPendingUser as IPendingUser, PendingUserStatus.pending),
    },
    {
      title: t('components.tooltip.pendingUserManagement.status.inReview'),
      onPress: () => updatePendingUserStatus(selectedPendingUser as IPendingUser, PendingUserStatus.inReview),
    },
    {
      title: t('components.tooltip.pendingUserManagement.status.rejected'),
      onPress: () => updatePendingUserStatus(selectedPendingUser as IPendingUser, PendingUserStatus.rejected),
    },
    {
      title: t('components.tooltip.pendingUserManagement.delete'),
      onPress: showAlert,
    },
  ];
  
  function navigateToSpecificClientCreation(client: IPendingUser) {
    setShowPendingUserDialog(false);
    setShowDeleteDialog(false);
    navigation.navigate(NavigationRoutes.ClientCreationScreen, { pendingUser: client, loadPendingUsers: loadPendingUsers });
  }

  async function updatePendingUserStatus(pendingUser: IPendingUser, status: PendingUserStatus) {
    await PendingUserService.getInstance().updatePendingUserStatus(pendingUser, token, status);
    // Update the grid
    await loadPendingUsers();
    // Close the dialogs
    setShowPendingUserDialog(false);
    setShowDeleteDialog(false);
  }

  function showAlert() {
    setShowPendingUserDialog(false);
    setShowDeleteDialog(true);
  }

  async function loadPendingUsers() {
    const castedToken = token as IToken;
    const users = await PendingUserService.getInstance().getUsers(castedToken);
    setPendingUsers(users);
  }

  async function removePendingUser() {
    await PendingUserService.getInstance().removePendingUser(selectedPendingUser?.id, token);
    await loadPendingUsers();
    setShowPendingUserDialog(false);
    setShowDeleteDialog(false);
  }

  useEffect(() => {
    async function init() {
      await loadPendingUsers();
    }
    init();
  }, []);

  useEffect(() => {
    async function init() {
      await loadPendingUsers();
    }
    init();
  }, [pendingUserListCount]);

  function pendingUserDialog() {
    return (
      <>
        {
          showPendingUserDialog && (
            <Dialog
              title={`${t('components.dialog.pendingUserManagement.action')}:\n ${selectedPendingUser?.firstName} ${selectedPendingUser?.lastName}`}
              isConfirmAvailable={false}
              isCancelAvailable={true}
              onConfirm={() => {}}
              onCancel={() => setShowPendingUserDialog(false)}
            >
              <>
                {popoverActions.map((action: IPendingUserAction, index: number) => (
                  <TouchableOpacity key={index} style={styles.popoverButton} onPress={action.onPress}>
                    <Text style={styles.popoverButtonText}>{action.title}</Text>
                  </TouchableOpacity>
                ))}
              </>
            </Dialog>
          )
        }
      </>
    )
  }

  function deleteDialog() {
    return (
      <>
        {
          showDeleteDialog && (
            <Dialog
              title={t('components.dialog.pendingUserManagement.delete.title')}
              description={t('components.dialog.pendingUserManagement.delete.description')}
              onConfirm={removePendingUser}
              isCancelAvailable={true}
              onCancel={() => setShowDeleteDialog(false)}
            />
          )
        }
      </>
    )
  }

  return (
    <>
      <AppContainer
        mainTitle={t('pendingUserManagement.title')}
        searchText={searchText}
        setSearchText={setSearchText}
        showBackButton={true}
        navigateBack={navigateBack}
        showDialog={showDialog}
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
            <Grid
              data={pendingUsersFiltered}
              renderItem={(renderItem) =>
                <PendingUserRow 
                  pendingUser={renderItem.item}
                  loadPendingUsers={loadPendingUsers}
                  setSelectedPendingUser={setSelectedPendingUser}
                  setShowPendingUserDialog={setShowPendingUserDialog}
                />
              }
            />
          )
        }
      </AppContainer>
      {pendingUserDialog()}
      {deleteDialog()}
    </>
  );
}

export default PendingClientListScreen;