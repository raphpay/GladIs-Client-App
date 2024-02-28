import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { IRootStackParams } from '../../../navigation/Routes';

import CacheKeys from '../../../business-logic/model/enums/CacheKeys';
import NavigationRoutes from '../../../business-logic/model/enums/NavigationRoutes';
import UserType from '../../../business-logic/model/enums/UserType';
import CacheService from '../../../business-logic/services/CacheService';
import UserService from '../../../business-logic/services/UserService';

import AppContainer from '../../components/AppContainer';
import DashboardAdminFlatList from '../../components/DashboardAdminFlatList';
import DashboardClientFlatList from '../../components/DashboardClientFlatList';
import Dialog from '../../components/Dialog';
import GladisTextInput from '../../components/GladisTextInput';
import IconButton from '../../components/IconButton';

import plusIcon from '../../assets/images/plus.png';

type DashboardScreenProps = NativeStackScreenProps<IRootStackParams, NavigationRoutes.DashboardScreen>;

function DashboardScreen(props: DashboardScreenProps): any {
  const { navigation } = props;
  const [searchText, setSearchText] = useState<string>('');
  const [oldPassword, setOldPassword] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [showDialog, setShowDialog] = useState<boolean>(false);
  const { t } = useTranslation();

  function navigateToClientList() {
    navigation.navigate(NavigationRoutes.ClientManagementStack);
  }

  useEffect(() => {
     async function init() {
      // TODO: Get the user by cache or by API ?
      const userID = await CacheService.getInstance().retrieveValue(CacheKeys.currentUserID) as string;
      // TODO: Review this warning
      const user = await UserService.getInstance().getUserByID(userID);
      setIsAdmin(user.userType == UserType.Admin);
      setShowDialog(user.firstConnection);
    }
    init();
  }, []);

  function appContainerChildren() {
    return (
      <>
        {
            isAdmin ? (
              <DashboardAdminFlatList searchText={searchText} />
            ) : (
              <DashboardClientFlatList />
            )
          }
      </>
    );
  }

  async function submitPasswordChange() {
    if (oldPassword.length !== 0 && newPassword.length !== 0) {
      try {
        await UserService.getInstance().changePassword(oldPassword, newPassword);
        await UserService.getInstance().setUserFirstConnectionToFalse();
        setShowDialog(false);
      } catch (error) {
        console.log('Error changing password', error);
      }
    }
  }

  function dialogContent() {
    return (
      <>
        {
          showDialog && (
            <Dialog
              title={t('components.dialog.firstConnection.title')}
              description={t('components.dialog.firstConnection.description')}
              confirmTitle={t('components.dialog.firstConnection.confirmButton')}
              isConfirmDisabled={oldPassword.length === 0 || newPassword.length === 0}
              onConfirm={submitPasswordChange}
              onCancel={() => setShowDialog(false)}
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

  return (
    <>
      <AppContainer 
        mainTitle={t('dashboard.adminTitle')}
        searchText={searchText}
        setSearchText={setSearchText}
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
    </>
  )
}

export default DashboardScreen;