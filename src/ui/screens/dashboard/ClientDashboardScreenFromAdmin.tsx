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
import DashboardClientFlatList from '../../components/DashboardClientFlatList';
import IconButton from '../../components/IconButton';
import SearchTextInput from '../../components/SearchTextInput';

import backIcon from '../../assets/images/arrow.uturn.left.png';
import plusIcon from '../../assets/images/plus.png';
import styles from '../../assets/styles/dashboard/DashboardScreenStyles';

type ClientDashboardScreenFromAdminProps = NativeStackScreenProps<IRootStackParams, NavigationRoutes.ClientDashboardScreenFromAdmin>;

function ClientDashboardScreenFromAdmin(props: ClientDashboardScreenFromAdminProps): any {
  const { navigation } = props;
  const { client } = props.route.params;
  
  const [searchText,setSearchText] = useState<string>('');
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  const { t } = useTranslation();

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
          <DashboardClientFlatList client={client} />
        </View>
        <View style={styles.backButtonContainer}>
          <IconButton
            title={t('components.buttons.back')}
            icon={backIcon}
            onPress={navigateBack}
          />
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

export default ClientDashboardScreenFromAdmin;