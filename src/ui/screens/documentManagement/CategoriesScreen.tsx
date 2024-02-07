import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Image,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { IDashboardStackParams } from '../../../navigation/Routes';

import AppIcon from '../../components/AppIcon';
import SearchTextInput from '../../components/SearchTextInput';
import TextButton from '../../components/TextButton';

import styles from '../../assets/styles/documentManagement/CategoriesScreenStyles';

type CategoriesScreenProps = NativeStackScreenProps<IDashboardStackParams, 'CategoriesScreen'>;

function CategoriesScreen(props: CategoriesScreenProps): React.JSX.Element {
  const { params } = props.route;
  const [searchText,setSearchText] = useState<string>('');
  
  const { t } = useTranslation();

  function navigateBack() {
    props.navigation.goBack();
  }

  function navigateToSubCategory() {
    props.navigation.navigate('SubCategoryScreen',
    {
      isAdmin: params.isAdmin,
      category: params.category,
      subCategory: 'systemQuality'
    });
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
            <TouchableOpacity onPress={navigateToSubCategory}>
              <View style={styles.categoryContainer}>
                <View style={styles.categoryImageContainer} />
                <View style={styles.categoryTextsContainer}>
                  <Text style={styles.categoryTitle}>{t('subCategories.systemQuality.title')}</Text>
                  <Text style={styles.categoryDescription}>{t('categories.description')}</Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>
          <View style={styles.backButtonContainer}>
            <TextButton title={t('components.buttons.back')} onPress={navigateBack}/>
          </View>
        </View>
        <View style={styles.topContainer}>
          <AppIcon style={styles.appIcon} />
          <View>
            <View style={styles.navigationHistoryContainer}>
              <TouchableOpacity onPress={navigateBack}>
                <Text style={styles.navigationHistory}>
                  {t('dashboard.title')}
                </Text>
              </TouchableOpacity>
              <Image source={require('../../assets/images/chevron.right.png')}/>
            </View>
            <Text style={styles.currentPageTitle}>
              {t(`categories.${params.category}.title`)}
            </Text>
          </View>
        </View>
    </SafeAreaView>
  );
}

export default CategoriesScreen;