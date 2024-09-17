import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { IRootStackParams } from '../../../navigation/Routes';

import CacheKeys from '../../../business-logic/model/enums/CacheKeys';
import NavigationRoutes from '../../../business-logic/model/enums/NavigationRoutes';
import CacheService from '../../../business-logic/services/CacheService';
import UserServiceGet from '../../../business-logic/services/UserService/UserService.get';
import UserServicePut from '../../../business-logic/services/UserService/UserService.put';
import { useAppSelector } from '../../../business-logic/store/hooks';
import { RootState } from '../../../business-logic/store/store';

import AppContainer from '../../components/AppContainer/AppContainer';
import IconButton from '../../components/Buttons/IconButton';
import DashboardAdminGrid from '../../components/Dashboard/DashboardAdminGrid';
import DashboardClientGrid from '../../components/Dashboard/DashboardClientGrid';
import Dialog from '../../components/Dialogs/Dialog';
import ErrorDialog from '../../components/Dialogs/ErrorDialog';
import GladisTextInput from '../../components/TextInputs/GladisTextInput';
import Toast from '../../components/Toast/Toast';

type DashboardScreenProps = NativeStackScreenProps<IRootStackParams, NavigationRoutes.DashboardScreen>;

function DashboardScreen(props: DashboardScreenProps): any {
  const { navigation } = props;
  const [searchText, setSearchText] = useState<string>('');
  const [oldPassword, setOldPassword] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [dialogDescription, setDialogDescription] = useState<string>('');
  const [showDialog, setShowDialog] = useState<boolean>(false);
  const [showErrorDialog, setShowErrorDialog] = useState<boolean>(false);
  // Toast
  const [showToast, setShowToast] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string>('');
  const [toastIsShowingError, setToastIsShowingError] = useState<boolean>(false);
  
  const plusIcon = require('../../assets/images/plus.png');
  
  const { t } = useTranslation();

  const { currentUser, isAdmin } = useAppSelector((state: RootState) => state.users);
  const { token } = useAppSelector((state: RootState) => state.tokens);

  const searchTextPlaceholder = isAdmin ? t('dashboard.searchTextPlaceholder.admin') : t('dashboard.searchTextPlaceholder.client');

  // Sync Methods
  function navigateToClientList() {
    navigation.navigate(NavigationRoutes.ClientCreationStack);
  }

  function displayToast(message: string, isError: boolean) {
    setToastMessage(message);
    setToastIsShowingError(isError);
    setShowToast(true);
  }

  // Async Methods
  async function submitPasswordChange() {
    if (oldPassword.length !== 0 && newPassword.length !== 0) {
      if (oldPassword === newPassword) {
        displayToast(t('errors.api.unauthorized.password.samePassword'), true);
      } else {
        if (currentUser) {
          try {
            const userID = currentUser.id as string; 
            await UserServicePut.changePassword(userID, oldPassword, newPassword, token);
            await UserServicePut.setUserFirstConnectionToFalse(userID, token);
            setShowDialog(false);
            displayToast(t('api.success.passwordChanged'), false);
          } catch (error) {
            const errorMessage = (error as Error).message as string;
            displayToast(t(`errors.api.${errorMessage}`), true);
          }
        }
      }
    }
  }

  async function loadView() {
    if (currentUser) {
      setDialogDescription(t('components.dialog.firstConnection.description'))
      setShowDialog(currentUser.firstConnection ?? false);
    } else {
      const userID = await CacheService.getInstance().retrieveValue<string>(CacheKeys.currentUserID);
      const user = await UserServiceGet.getUserByID(userID as string, token);
      setDialogDescription(t('components.dialog.firstConnection.description'))
      setShowDialog(user.firstConnection ?? false);
    }
  }

  // Lifecycle Methods
  useEffect(() => {
     async function init() {
      await loadView();
    }
    init();
  }, []);

  // Components
  function appContainerChildren() {
    return (
      <>
        {
            isAdmin ? (
              <DashboardAdminGrid searchText={searchText} />
            ) : (
              <DashboardClientGrid searchText={searchText} setShowErrorDialog={setShowErrorDialog}/>
            )
          }
      </>
    );
  }

  function dialogContent() {
    return (
      <>
        {
          showDialog && (
            <Dialog
              title={t('components.dialog.firstConnection.title')}
              description={dialogDescription}
              confirmTitle={t('components.dialog.firstConnection.confirmButton')}
              isConfirmDisabled={oldPassword.length === 0 || newPassword.length === 0}
              onConfirm={submitPasswordChange}
              onCancel={() => setShowDialog(false)}
              isCancelAvailable={false}
            >
              <>
                <GladisTextInput 
                  value={oldPassword}
                  placeholder={t('components.dialog.firstConnection.temporary')}
                  onValueChange={setOldPassword}
                  secureTextEntry={true}
                  autoCapitalize={'none'}
                  showVisibilityButton={true}
                  width={'100%'}
                />
                <GladisTextInput 
                  value={newPassword}
                  placeholder={t('components.dialog.firstConnection.new')}
                  onValueChange={setNewPassword}
                  secureTextEntry={true}
                  autoCapitalize={'none'}
                  showVisibilityButton={true}
                  width={'100%'}
                />
              </>
            </Dialog>
          )
        }
      </>
    );
  }

  function errorDialogContent() {
    return (
      <>
        {
          showErrorDialog && (
            <ErrorDialog
              title={t('errors.modules.title')}
              description={t('errors.modules.description')}
              cancelTitle={t('errors.modules.cancelButton')}
              onCancel={() => setShowErrorDialog(false)}
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
        mainTitle={t('dashboard.adminTitle')}
        searchText={searchText}
        setSearchText={setSearchText}
        showSearchText={true}
        showSettings={true}
        searchTextPlaceholder={searchTextPlaceholder}
        adminButton={(
          isAdmin ? (
            <IconButton
              title={t('components.buttons.addUser')}
              icon={plusIcon}
              onPress={navigateToClientList}
            />
          ) : undefined
        )}
        children={appContainerChildren()}
      />
      {dialogContent()}
      {errorDialogContent()}
      {ToastContent()}
    </>
  )
}

export default DashboardScreen;