import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { IRootStackParams } from '../../../navigation/Routes';

import NavigationRoutes from '../../../business-logic/model/enums/NavigationRoutes';

import AppIcon from '../../components/AppIcon';
import IconButton from '../../components/IconButton';
import SearchTextInput from '../../components/SearchTextInput';

import { Colors } from '../../assets/colors/colors';
import plusIcon from '../../assets/images/plus.png';
import styles from '../../assets/styles/dashboard/DashboardClientScreenStyles';

type DashboardScreenProps = NativeStackScreenProps<IRootStackParams, NavigationRoutes.DashboardScreen>;

function DashboardScreen(props: DashboardScreenProps): any {
  const { navigation } = props;
  
  const [searchText,setSearchText] = useState<string>('');
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  const { t } = useTranslation();

  function navigateToCategory() {
    navigation.navigate(NavigationRoutes.CategoriesScreen, { category: 'documentManagement'})
  }

  function navigateToClientList() {
    navigation.navigate(NavigationRoutes.ClientManagementStack);
  }

  useEffect(() => {
     setIsAdmin(true);
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
          <TouchableOpacity onPress={navigateToCategory} style={[styles.moduleContainer, { backgroundColor: Colors.inactive }]}>
            <Text>{t('dashboard.modules.documentManagement')}</Text>
          </TouchableOpacity>
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