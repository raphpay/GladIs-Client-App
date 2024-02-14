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

import AppIcon from '../../components/AppIcon';
import SearchTextInput from '../../components/SearchTextInput';
import TextButton from '../../components/TextButton';

import NavigationRoutes from '../../../business-logic/model/enums/NavigationRoutes';
import styles from '../../assets/styles/documentManagement/DocumentsScreenStyles';

type DocumentsScreenProps = NativeStackScreenProps<IRootStackParams, NavigationRoutes.DocumentsScreen>;

function DocumentsScreen(props: DocumentsScreenProps): React.JSX.Element {
  const [searchText, setSearchText] = useState<string>('');

  const { t } = useTranslation();

  const { navigation } = props;
  const { params } = props.route;

  function navigateToDashboard() {
    navigation.navigate(NavigationRoutes.DashboardScreen)
  }

  function navigateToCategories() {
    navigation.navigate(NavigationRoutes.CategoriesScreen, { category: params.category });
  }

  function navigateBack() {
    // Back to subcategories
    navigation.goBack();
  }

  function navigateToDocument() {

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
            <TouchableOpacity onPress={navigateToDocument}>
              <View style={styles.subCategoryLineContainer}>
                <View style={styles.subCategoryLineRow}>
                  <Image source={require('../../assets/images/PDF_file_icon.png')}/>
                  <View style={styles.subCategoryTextContainer}>
                    <Text>
                      {t('documents.document.management')}
                    </Text>
                  </View>
                  <Image source={require('../../assets/images/ellipsis.png')}/>
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
          <AppIcon style={styles.appIcon} />
          <View>
            <View style={styles.navigationHistoryContainer}>
              <TouchableOpacity onPress={navigateToDashboard}>
                <Text style={styles.navigationHistory}>
                  {t('dashboard.title')}
                </Text>
              </TouchableOpacity>
              <Image source={require('../../assets/images/chevron.right.png')}/>
              <TouchableOpacity onPress={navigateToCategories}>
                <Text style={styles.navigationHistory}>
                  {t(`categories.${params.category}.title`)}
                </Text>
              </TouchableOpacity>
              <Image source={require('../../assets/images/chevron.right.png')}/>
              <TouchableOpacity onPress={navigateBack}>
                <Text style={styles.navigationHistory}>
                  {t(`subCategories.${params.subCategory}.title`)}
                </Text>
              </TouchableOpacity>
              <Image source={require('../../assets/images/chevron.right.png')}/>
            </View>
            <Text style={styles.currentPageTitle}>
            {t(`documents.${params.documents}.title`)}
            </Text>
          </View>
        </View>
      </SafeAreaView>
  );
}

export default DocumentsScreen;
