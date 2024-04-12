import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Text, TouchableOpacity } from 'react-native';

import IAction from '../../../business-logic/model/IAction';
import IPendingUser from '../../../business-logic/model/IPendingUser';
import IToken from '../../../business-logic/model/IToken';
import NavigationRoutes from '../../../business-logic/model/enums/NavigationRoutes';
import PendingUserService from '../../../business-logic/services/PendingUserService';
import { useAppSelector } from '../../../business-logic/store/hooks';
import { RootState } from '../../../business-logic/store/store';

import { IClientCreationStack } from '../../../navigation/Routes';

import PendingUserStatus from '../../../business-logic/model/enums/PendingUserStatus';
import AppContainer from '../../components/AppContainer/AppContainer';
import ContentUnavailableView from '../../components/ContentUnavailableView';
import Dialog from '../../components/Dialogs/Dialog';
import Grid from '../../components/Grid';
import IconButton from '../../components/IconButton';
import Toast from '../../components/Toast';
import PendingUserRow from './PendingUserRow';

import styles from '../../assets/styles/clientManagement/PendingClientListScreenStyles';

type PendingClientListScreenProps = NativeStackScreenProps<IClientCreationStack, NavigationRoutes.PendingClientListScreen>;

function PendingClientListScreen(props: PendingClientListScreenProps): React.JSX.Element {
  const [pendingUsers, setPendingUsers] = useState<IPendingUser[]>([]);
  const [searchText, setSearchText] = useState<string>('');
  const [showDialog, setShowDialog] = useState<boolean>(false);
  const [selectedPendingUser, setSelectedPendingUser] = useState<IPendingUser>();
  const [showPendingUserDialog, setShowPendingUserDialog] = useState<boolean>(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState<boolean>(false);
  // Toast
  const [showToast, setShowToast] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string>('');
  const [toastIsShowingError, setToastIsShowingError] = useState<boolean>(false);

  const plusIcon = require('../../assets/images/plus.png');
  const docIcon = require('../../assets/images/doc.fill.png');
  
  const { token } = useAppSelector((state: RootState) => state.tokens);
  const { pendingUserListCount } = useAppSelector((state: RootState) => state.appState);

  const { t } = useTranslation();
  const pendingUsersFiltered = pendingUsers.filter(pendingUser =>
    pendingUser.companyName.toLowerCase().includes(searchText.toLowerCase()),
  );

  const { navigation } = props;

  const popoverActions: IAction[] = [
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

  // Sync Methods
  function navigateToCreateClient() {
    navigation.navigate(NavigationRoutes.ClientCreationScreen, { pendingUser: null });
  }

  function navigateBack() {
    navigation.goBack();
  }
  
  function navigateToSpecificClientCreation(client: IPendingUser) {
    setShowPendingUserDialog(false);
    setShowDeleteDialog(false);
    navigation.navigate(NavigationRoutes.ClientCreationScreen, { pendingUser: client });
  }

  function showAlert() {
    setShowPendingUserDialog(false);
    setShowDeleteDialog(true);
  }

  function displayToast(message: string, isError: boolean = false) {
    setShowToast(true);
    setToastIsShowingError(isError);
    setToastMessage(message);
  }

  // Async Methods
  async function updatePendingUserStatus(pendingUser: IPendingUser, status: PendingUserStatus) {
    try {
      await PendingUserService.getInstance().updatePendingUserStatus(pendingUser, token, status);
      // Update the grid
      await loadPendingUsers();
      // Close the dialogs
      setShowPendingUserDialog(false);
      setShowDeleteDialog(false);
    } catch (error) {
      const errorMessage = (error as Error).message
      displayToast(t(`errors.api.${errorMessage}`), true);
    }
  }

  async function loadPendingUsers() {
    try {
      const castedToken = token as IToken;
      const users = await PendingUserService.getInstance().getUsers(castedToken);
      setPendingUsers(users); 
    } catch (error) {
      console.log('Error loading pending users', error);
    }
  }

  async function removePendingUser() {
    try {
      await PendingUserService.getInstance().removePendingUser(selectedPendingUser?.id, token);
    } catch (error) {
      const errorMessage = (error as Error).message;
      displayToast(t(`errors.api.${errorMessage}`), true);
      return;
    }

    await loadPendingUsers();
    setShowPendingUserDialog(false);
    setShowDeleteDialog(false); 
  }

  // Lifecycle Methods
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

  // Components
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
                {popoverActions.map((action: IAction, index: number) => (
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

  function ToastContent() {
    return (
      <>
        {
          showToast && (
            <Toast
              message={toastMessage}
              isVisible={showToast}
              setIsVisible={setShowToast}
              isShowingError={toastIsShowingError}
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
      {ToastContent()}
    </>
  );
}

export default PendingClientListScreen;