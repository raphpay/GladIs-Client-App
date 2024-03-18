import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { IRootStackParams } from '../../../navigation/Routes';

import CacheKeys from '../../../business-logic/model/enums/CacheKeys';
import NavigationRoutes from '../../../business-logic/model/enums/NavigationRoutes';
import UserType from '../../../business-logic/model/enums/UserType';
import CacheService from '../../../business-logic/services/CacheService';
import UserService from '../../../business-logic/services/UserService';
import { useAppSelector } from '../../../business-logic/store/hooks';
import { RootState } from '../../../business-logic/store/store';

import AppContainer from '../../components/AppContainer';
import DashboardAdminGrid from '../../components/DashboardAdminGrid';
import DashboardClientGrid from '../../components/DashboardClientGrid';
import Dialog from '../../components/Dialog';
import ErrorDialog from '../../components/ErrorDialog';
import GladisTextInput from '../../components/GladisTextInput';
import IconButton from '../../components/IconButton';

type DashboardScreenProps = NativeStackScreenProps<IRootStackParams, NavigationRoutes.DashboardScreen>;

function DashboardScreen(props: DashboardScreenProps): any {
  const { navigation } = props;
  const [searchText, setSearchText] = useState<string>('');
  const [oldPassword, setOldPassword] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [dialogDescription, setDialogDescription] = useState<string>('');
  const [showDialog, setShowDialog] = useState<boolean>(false);
  const [showErrorDialog, setShowErrorDialog] = useState<boolean>(false);
  
  const plusIcon = require('../../assets/images/plus.png');
  
  const { t } = useTranslation();

  const { currentUser } = useAppSelector((state: RootState) => state.users);
  const { token } = useAppSelector((state: RootState) => state.tokens);

  function navigateToClientList() {
    navigation.navigate(NavigationRoutes.ClientCreationStack);
  }

  async function submitPasswordChange() {
    if (oldPassword.length !== 0 && newPassword.length !== 0) {
      if (oldPassword === newPassword) {
        setDialogDescription(t('errors.password.samePassword'));
      } else {
        try {
          await UserService.getInstance().changePassword(oldPassword, newPassword);
          await UserService.getInstance().setUserFirstConnectionToFalse();
          setShowDialog(false);
        } catch (error) {
          const errorMessage = (error as Error).message as string;
          if (errorMessage) {
            setDialogDescription(t(`errors.${errorMessage}`));
          }
          console.log('Error changing password', error);
        }
      }
    }
  }

  useEffect(() => {
     async function init() {
      if (currentUser) {
        setIsAdmin(currentUser.userType == UserType.Admin);
        setDialogDescription(t('components.dialog.firstConnection.description'))
        setShowDialog(currentUser.firstConnection ?? false);
      } else {
        const userID = await CacheService.getInstance().retrieveValue<string>(CacheKeys.currentUserID);
        const user = await UserService.getInstance().getUserByID(userID as string, token);
        setIsAdmin(user.userType == UserType.Admin);
        setDialogDescription(t('components.dialog.firstConnection.description'))
        setShowDialog(user.firstConnection ?? false);
      }
    }
    init();
  }, []);

  function appContainerChildren() {
    return (
      <>
        {
            isAdmin ? (
              <DashboardAdminGrid searchText={searchText} />
            ) : (
              <DashboardClientGrid searchText={searchText} setShowDialog={setShowErrorDialog}/>
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

  return (
    <>
      <AppContainer 
        mainTitle={t('dashboard.adminTitle')}
        searchText={searchText}
        setSearchText={setSearchText}
        showSearchText={true}
        showSettings={true}
        adminButton={(
          isAdmin ? (
            <IconButton
              title={t('components.buttons.addClient')}
              icon={plusIcon}
              onPress={navigateToClientList}
            />
          ) : undefined
        )}
        children={appContainerChildren()}
      />
      {dialogContent()}
      {errorDialogContent()}
    </>
  )
}

export default DashboardScreen;