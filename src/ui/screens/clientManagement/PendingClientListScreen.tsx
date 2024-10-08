import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Dimensions, Platform, Text, TouchableOpacity, View } from 'react-native';

import IAction from '../../../business-logic/model/IAction';
import IPendingUser from '../../../business-logic/model/IPendingUser';
import IToken from '../../../business-logic/model/IToken';
import NavigationRoutes from '../../../business-logic/model/enums/NavigationRoutes';
import PendingUserServiceDelete from '../../../business-logic/services/PendingUserService/PendingUserService.delete';
import PendingUserServiceGet from '../../../business-logic/services/PendingUserService/PendingUserService.get';
import PendingUserServicePut from '../../../business-logic/services/PendingUserService/PendingUserService.put';
import { useAppSelector } from '../../../business-logic/store/hooks';
import { RootState } from '../../../business-logic/store/store';

import { IClientCreationStack } from '../../../navigation/Routes';

import PendingUserStatus from '../../../business-logic/model/enums/PendingUserStatus';
import PlatformName, { Orientation } from '../../../business-logic/model/enums/PlatformName';
import AppContainer from '../../components/AppContainer/AppContainer';
import IconButton from '../../components/Buttons/IconButton';
import ContentUnavailableView from '../../components/ContentUnavailableView';
import Dialog from '../../components/Dialogs/Dialog';
import Grid from '../../components/Grid/Grid';
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
  const [orientation, setOrientation] = useState<string>(Orientation.Landscape);
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

  function navigateToCreateAdmin() {
    navigation.navigate(NavigationRoutes.AdminCreationScreen);
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

  function determineAndSetOrientation() {
    let width = Dimensions.get('window').width;
    let height = Dimensions.get('window').height;

    if (width < height) {
      setOrientation(Orientation.Portrait);
    } else {
      setOrientation(Orientation.Landscape);
    }
  }

  // Async Methods
  async function updatePendingUserStatus(pendingUser: IPendingUser, status: PendingUserStatus) {
    try {
      await PendingUserServicePut.updatePendingUserStatus(pendingUser, token, status);
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
      const users = await PendingUserServiceGet.getUsers(castedToken);
      setPendingUsers(users); 
    } catch (error) {
      console.log('Error loading pending users', error);
    }
  }

  async function removePendingUser() {
    try {
      await PendingUserServiceDelete.removePendingUser(selectedPendingUser?.id, token);
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

  useEffect(() => {
    determineAndSetOrientation();
    Dimensions.addEventListener('change', determineAndSetOrientation);
    return () => {}
  }, []);

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

  function AdminButtons() {
    const shouldHaveColumn = (
        Platform.OS === PlatformName.Android ||
        Platform.OS === PlatformName.IOS
      ) && orientation === Orientation.Portrait;
    
    return (
      <View style={{ flexDirection: shouldHaveColumn ? 'column' : 'row' }}>
        <IconButton
          title={t('components.buttons.addAdmin')}
          icon={plusIcon}
          onPress={navigateToCreateAdmin}
          style={styles.addButton}
        />
        <IconButton
          title={t('components.buttons.addClient')}
          icon={plusIcon}
          onPress={navigateToCreateClient}
          style={styles.addButton}
        />
      </View>
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
        adminButton={AdminButtons()}
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