import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  SafeAreaView,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { IDashboardStackParams } from '../../../navigation/Routes';

import { Colors } from '../../assets/colors/colors';
import styles from '../../assets/styles/dashboard/DashboardClientScreenStyles';
import AppIcon from '../../components/AppIcon';
import SearchTextInput from '../../components/SearchTextInput';

type DashboardClientScreenProps = NativeStackScreenProps<IDashboardStackParams, 'DashboardClientScreen'>;

function DashboardClientScreen(props: DashboardClientScreenProps): React.JSX.Element {
  const { params } = props.route;

  const [searchText,setSearchText] = useState<string>('');

  const { t } = useTranslation();

  function navigateToCategory() {
    props.navigation.navigate('CategoriesScreen', { isAdmin: params.isAdmin, category: 'documentManagement'})
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.innerContainer}>
        <View style={styles.innerComponentsContainer}>
          <View style={styles.searchInputContainer}>
            <SearchTextInput 
              searchText={searchText}
              setSearchText={setSearchText}
            />
          </View>
          <TouchableOpacity onPress={navigateToCategory} style={[styles.moduleContainer, { backgroundColor: Colors.textInput}]}>
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
  );
}

export default DashboardClientScreen;