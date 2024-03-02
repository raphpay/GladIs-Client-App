import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { IRootStackParams } from '../../../navigation/Routes';

import INavigationHistoryItem from '../../../business-logic/model/INavigationHistoryItem';
import CacheKeys from '../../../business-logic/model/enums/CacheKeys';
import NavigationRoutes from '../../../business-logic/model/enums/NavigationRoutes';
import UserType from '../../../business-logic/model/enums/UserType';
import CacheService from '../../../business-logic/services/CacheService';
import UserService from '../../../business-logic/services/UserService';

import AppContainer from '../../components/AppContainer';
import DashboardClientFlatList from '../../components/DashboardClientFlatList';
import ErrorDialog from '../../components/ErrorDialog';
import IconButton from '../../components/IconButton';

type ClientDashboardScreenFromAdminProps = NativeStackScreenProps<IRootStackParams, NavigationRoutes.ClientDashboardScreenFromAdmin>;

function ClientDashboardScreenFromAdmin(props: ClientDashboardScreenFromAdminProps): any {
  const [searchText,setSearchText] = useState<string>('');
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [showDialog, setShowDialog] = useState<boolean>(false);
  const plusIcon = require('../../assets/images/plus.png');
  const { navigation } = props;
  const { t } = useTranslation();
  const navigationHistoryItems: INavigationHistoryItem[] = [
    {
      title: t('dashboard.adminTitle'),
      action: () => navigateBack()
    }
  ]

  function navigateToClientList() {
    navigation.navigate(NavigationRoutes.ClientManagementStack);
  }

  function navigateBack() {
    navigation.goBack();
  }

  useEffect(() => {
     async function init() {
      const userID = await CacheService.getInstance().retrieveValue(CacheKeys.currentUserID) as string;
      const user = await UserService.getInstance().getUserByID(userID);
      setIsAdmin(user.userType == UserType.Admin);
    }
    init();
  }, []);

  return (
    <>
      <AppContainer 
        mainTitle={t('dashboard.title')}
        navigationHistoryItems={navigationHistoryItems}
        searchText={searchText}
        setSearchText={setSearchText}
        showBackButton={true}
        navigateBack={navigateBack}
        dialogIsShown={showDialog}
        adminButton={(
          isAdmin ? (
            <IconButton
              title={t('components.buttons.addClient')}
              icon={plusIcon}
              onPress={navigateToClientList}
            />
          ) : undefined
        )}
      >
        <DashboardClientFlatList searchText={searchText} setShowDialog={setShowDialog} />
      </AppContainer>
      {
        showDialog && (
          <ErrorDialog
            title={t('errors.modules.title')}
            description={t('errors.modules.description')}
            cancelTitle={t('errors.modules.cancelButton')}
            onCancel={() => setShowDialog(false)}
          />
        )
      }
    </>
  )
}

export default ClientDashboardScreenFromAdmin;