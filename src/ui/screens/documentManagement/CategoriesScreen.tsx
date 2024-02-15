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
import { IRootStackParams } from '../../../navigation/Routes';

import NavigationRoutes from '../../../business-logic/model/enums/NavigationRoutes';

import AppIcon from '../../components/AppIcon';
import IconButton from '../../components/IconButton';
import SearchTextInput from '../../components/SearchTextInput';

import backIcon from '../../assets/images/arrow.uturn.left.png';
import styles from '../../assets/styles/documentManagement/CategoriesScreenStyles';

type CategoriesScreenProps = NativeStackScreenProps<IRootStackParams, NavigationRoutes.CategoriesScreen>;

function CategoriesScreen(props: CategoriesScreenProps): React.JSX.Element {
  const { module } = props.route.params;
  const [searchText,setSearchText] = useState<string>('');
  
  const { t } = useTranslation();

  function navigateBack() {
    props.navigation.goBack();
  }

  function navigateToSubCategory() {
    props.navigation.navigate(NavigationRoutes.SubCategoryScreen, {
      module: module,
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
            <IconButton
              title={t('components.buttons.back')}
              icon={backIcon}
              onPress={navigateBack}
             />
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
              {t(`modules.${module.name}`)}
            </Text>
          </View>
        </View>
    </SafeAreaView>
  );
}

export default CategoriesScreen;