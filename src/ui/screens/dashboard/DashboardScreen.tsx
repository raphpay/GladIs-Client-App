import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { IRootStackParams } from '../../../navigation/Routes';

import CacheKeys from '../../../business-logic/model/enums/CacheKeys';
import NavigationRoutes from '../../../business-logic/model/enums/NavigationRoutes';
import UserType from '../../../business-logic/model/enums/UserType';
import CacheService from '../../../business-logic/services/CacheService';
import UserService from '../../../business-logic/services/UserService';

import AppIcon from '../../components/AppIcon';
import DashboardAdminFlatList from '../../components/DashboardAdminFlatList';
import DashboardClientFlatList from '../../components/DashboardClientFlatList';
import IconButton from '../../components/IconButton';
import SearchTextInput from '../../components/SearchTextInput';

import plusIcon from '../../assets/images/plus.png';
import styles from '../../assets/styles/dashboard/DashboardScreenStyles';

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
          {
            isAdmin ? (
              <DashboardAdminFlatList />
            ) : (
              <DashboardClientFlatList />
            )
          }
        </View>
      </View>
      <View style={styles.topContainer}>
        <AppIcon style={styles.appIcon}/> 
        <Text style={styles.navigationHistory}>
          {t('dashboard.title')}
        </Text>
      </View>
    </SafeAreaView>
  )
}

export default DashboardScreen;