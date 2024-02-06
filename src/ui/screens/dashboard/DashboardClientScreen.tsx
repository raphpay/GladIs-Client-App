import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useColorScheme
} from 'react-native';
import { IDashboardStackParams } from '../../../navigation/Routes';

import { Colors } from '../../assets/colors/colors';
import AppIcon from '../../components/AppIcon';
import SearchTextInput from '../../components/SearchTextInput';

type DashboardClientScreenProps = NativeStackScreenProps<IDashboardStackParams, 'DashboardClientScreen'>;

function DashboardClientScreen(props: DashboardClientScreenProps): React.JSX.Element {
  const { params } = props.route;

  const [searchText,setSearchText] = useState<string>('');

  const isDarkMode = useColorScheme() === 'dark';
  const { t } = useTranslation();

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.dark : Colors.light,
  };

  function navigateToCategory() {
    props.navigation.navigate('CategoriesScreen', { isAdmin: params.isAdmin, category: 'documentManagement'})
  }

  return (
    <SafeAreaView style={[{ backgroundColor: Colors.primary }, styles.container]}>
      <View style={[styles.innerContainer, backgroundStyle]}>
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

// TODO: Find a way to separate styles from the file
const styles = StyleSheet.create({
  // Containers
  container: {
    flex: 1,
  },
  topContainer: {
    flexDirection: 'row',
    position: 'absolute',
    alignItems: 'flex-end',
  },
  innerContainer: {
    flex: 1,
    marginTop: 104,
    marginHorizontal: 16,
    marginBottom: 16,
  },
  innerComponentsContainer: {
    flex: 1,
    marginTop: 91,
    marginHorizontal: 16,
    marginBottom: 16
  },
  searchInputContainer: {
    width: '100%',
    flexDirection: 'row-reverse'
  },
  moduleContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 75,
    width: 190,
    borderRadius: 10
  },
  // Components
  appIcon: {
    marginLeft: 60,
    marginTop: 16,
  },
  navigationHistory: {
    paddingLeft: 8,
    fontSize: 20,
    fontWeight: '600'
  },
});

export default DashboardClientScreen;