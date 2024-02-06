import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useColorScheme
} from 'react-native';
import { IDashboardStackParams } from '../../navigation/Routes';

import { Colors } from '../assets/colors/colors';
import AppIcon from '../components/AppIcon';
import SearchTextInput from '../components/SearchTextInput';
import TextButton from '../components/TextButton';

type SubCategoryScreenProps = NativeStackScreenProps<IDashboardStackParams, 'SubCategoryScreen'>;

function SubCategoryScreen(props: SubCategoryScreenProps): React.JSX.Element {
  const { params } = props.route;
  const [searchText, setSearchText] = useState<string>('');
  
  const { t } = useTranslation();
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.dark : Colors.light,
  };

  function navigateToDashboard() {
    if (params.isAdmin) {
      props.navigation.navigate('DashboardAdminScreen', { isAdmin: true})
    } else {
      props.navigation.navigate('DashboardClientScreen', { isAdmin: false})
    }
  }

  function navigateBack() {
    props.navigation.goBack();
  }

  function navigateToDocuments() {
    props.navigation.navigate('DocumentsScreen', {
      isAdmin: params.isAdmin,
      category: params.category,
      subCategory: params.subCategory,
      documents: 'processus'
    })
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
          <TouchableOpacity onPress={navigateToDocuments}>
            <View style={styles.subCategoryLineContainer}>
              <View style={styles.subCategoryLineRow}>
                <View style={[styles.letterCircle, { backgroundColor: Colors.textInput }]}>
                  <Text>P</Text>
                </View>
                <View style={styles.subCategoryTextContainer}>
                  <Text>
                    {t('documents.processus.title')}
                  </Text>
                </View>
                <Image source={require('../assets/images/ellipsis.png')}/>
              </View>
              <View style={styles.separator}/>
            </View>
          </TouchableOpacity>
        </View>
        <View style={styles.backButtonContainer}>
          <TextButton title={t('components.buttons.back')} onPress={navigateBack}/>
        </View>
      </View>
      <View style={styles.topContainer}>
        <AppIcon style={styles.appIcon}/>
        <View>
          <View style={styles.navigationHistoryContainer}>
            <TouchableOpacity onPress={navigateToDashboard}>
              <Text style={styles.navigationHistory}>
                {t('dashboard.title')}
              </Text>
            </TouchableOpacity>
            <Image source={require('../assets/images/chevron.right.png')}/>
            <TouchableOpacity onPress={navigateBack}>
              <Text style={styles.navigationHistory}>
                {t(`categories.${params.category}.title`)}
              </Text>
            </TouchableOpacity>
            <Image source={require('../assets/images/chevron.right.png')}/>
          </View>
          <Text style={styles.currentPageTitle}>
            {t(`subCategories.${params.subCategory}.title`)}
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

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
  backButtonContainer: {
    width: '100%',
    flexDirection: 'row-reverse',
    padding: 16
  },
  navigationHistoryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryContainer: {
    borderRadius: 10,
    width: 148,
    height: 228,
    borderWidth: 1,
    borderColor: 'black'
  },
  categoryImageContainer: {
    height: '75%'
  },
  categoryTextsContainer: {
    height: '25%',
    borderBottomStartRadius: 10,
    borderBottomEndRadius: 10,
    padding: 4,
  },
  subCategoryLineContainer: {
    height: 55,
    width: '100%',
  },
  subCategoryLineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  subCategoryTextContainer: {
    flex: 1,
    paddingLeft: 8
  },
  // Components
  appIcon: {
    marginLeft: 60,
    marginTop: 16,
  },
  navigationHistory: {
    paddingLeft: 8,
    fontSize: 12,
    fontWeight: '400',
    paddingRight: 4
  },
  currentPageTitle: {
    paddingLeft: 8,
    fontSize: 20,
    fontWeight: '600'
  },
  textInput: {
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 10,
    width: '30%',
    padding: 10,
    margin: 8,
  },
  categoryTitle: {
    fontSize: 12
  },
  categoryDescription: {
    fontSize: 10
  },
  letterCircle: {
    width: 25,
    height: 25,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center'
  },
  separator: {
    width: '100%',
    height: 1,
    backgroundColor: 'black',
    margin: 4
  },
});

export default SubCategoryScreen;