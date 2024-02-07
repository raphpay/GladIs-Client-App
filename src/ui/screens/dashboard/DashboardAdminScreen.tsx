import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  SafeAreaView,
  Text,
  View
} from 'react-native';

import AppIcon from '../../components/AppIcon';
import IconButton from '../../components/IconButton';
import SearchTextInput from '../../components/SearchTextInput';

import plusIcon from '../../assets/images/plus.png';
import styles from '../../assets/styles/dashboard/DashboardAdminScreenStyles';

function DashboardAdminScreen(): React.JSX.Element {

  const [searchText,setSearchText] = useState<string>('');

  const { t } = useTranslation();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.innerContainer}>
        <View style={styles.innerComponentsContainer}>
          <View style={styles.searchInputContainer}>
            <IconButton
              title={t('dashboard.buttons.addClient')}
              icon={plusIcon}
              onPress={() => { console.log('hello')}}
            />
            <SearchTextInput
              searchText={searchText}
              setSearchText={setSearchText}
            />
          </View>
          <View style={styles.clientContainer}>
            <View style={styles.innerTopClientContainer}>
              <Text>Client A</Text>
            </View>
            <View style={styles.innerBottomClientContainer}>
              <Text>{t('dashboard.modules.documentManagement')}</Text>
            </View>
          </View>
        </View>
      </View>
      <View style={styles.topContainer}>
        <AppIcon style={styles.appIcon} />
        <Text style={styles.navigationHistory}>
          {t('dashboard.title')}
        </Text>
      </View>
    </SafeAreaView>
  );
}

export default DashboardAdminScreen;