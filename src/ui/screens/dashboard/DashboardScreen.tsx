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
import IconButton from '../../components/IconButton';

import plusIcon from '../../assets/images/plus.png';

type DashboardScreenProps = NativeStackScreenProps<IRootStackParams, NavigationRoutes.DashboardScreen>;

function DashboardScreen(props: DashboardScreenProps): any {
  const { navigation } = props;
  
  const [searchText,setSearchText] = useState<string>('');
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

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
    }
    init();
  }, []);

  return (
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
    >
      {
        isAdmin ? (
          <DashboardAdminFlatList />
        ) : (
          <DashboardClientFlatList />
        )
      }
    </AppContainer>
  )
}

export default DashboardScreen;