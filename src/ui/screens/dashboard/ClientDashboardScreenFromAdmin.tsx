import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { SafeAreaView, View } from 'react-native';

import { IRootStackParams } from '../../../navigation/Routes';

import INavigationHistoryItem from '../../../business-logic/model/INavigationHistoryItem';
import CacheKeys from '../../../business-logic/model/enums/CacheKeys';
import NavigationRoutes from '../../../business-logic/model/enums/NavigationRoutes';
import UserType from '../../../business-logic/model/enums/UserType';
import CacheService from '../../../business-logic/services/CacheService';
import UserService from '../../../business-logic/services/UserService';

import DashboardClientFlatList from '../../components/DashboardClientFlatList';
import IconButton from '../../components/IconButton';
import SearchTextInput from '../../components/SearchTextInput';
import TopAppBar from '../../components/TopAppBar';

import backIcon from '../../assets/images/arrow.uturn.left.png';
import plusIcon from '../../assets/images/plus.png';
import styles from '../../assets/styles/dashboard/DashboardScreenStyles';

type ClientDashboardScreenFromAdminProps = NativeStackScreenProps<IRootStackParams, NavigationRoutes.ClientDashboardScreenFromAdmin>;

function ClientDashboardScreenFromAdmin(props: ClientDashboardScreenFromAdminProps): any {
  const [searchText,setSearchText] = useState<string>('');
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
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
    <SafeAreaView style={styles.container}>
      <View style={styles.innerContainer}>
        <View style={styles.innerComponentsContainer}>
          <View style={styles.searchInputContainer}>
            {
              isAdmin && (
                <IconButton
                  title={t('components.buttons.addClient')}
                  icon={plusIcon}
                  onPress={navigateToClientList}
                />
              )
            }
            <SearchTextInput 
              searchText={searchText}
              setSearchText={setSearchText}
            />
          </View>
          <DashboardClientFlatList />
        </View>
        <View style={styles.backButtonContainer}>
          <IconButton
            title={t('components.buttons.back')}
            icon={backIcon}
            onPress={navigateBack}
          />
        </View>
      </View>
      <TopAppBar mainTitle={t('dashboard.title')} navigationHistoryItems={navigationHistoryItems} />
    </SafeAreaView>
  )
}

export default ClientDashboardScreenFromAdmin;