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

import styles from '../../assets/styles/documentManagement/SubCategoryScreenStyles';

type SubCategoryScreenProps = NativeStackScreenProps<IDashboardStackParams, 'SubCategoryScreen'>;

function SubCategoryScreen(props: SubCategoryScreenProps): React.JSX.Element {
  const { params } = props.route;
  const [searchText, setSearchText] = useState<string>('');
  
  const { t } = useTranslation();

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
    props.navigation.navigate('DocumentsScreen', { documents: 'processus' })
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
          <TouchableOpacity onPress={navigateToDocuments}>
            <View style={styles.subCategoryLineContainer}>
              <View style={styles.subCategoryLineRow}>
                <View style={styles.letterCircle}>
                  <Text>P</Text>
                </View>
                <View style={styles.subCategoryTextContainer}>
                  <Text>
                    {t('documents.processus.title')}
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
        <AppIcon style={styles.appIcon}/>
        <View>
          <View style={styles.navigationHistoryContainer}>
            <TouchableOpacity onPress={navigateToDashboard}>
              <Text style={styles.navigationHistory}>
                {t('dashboard.title')}
              </Text>
            </TouchableOpacity>
            <Image source={require('../../assets/images/chevron.right.png')}/>
            <TouchableOpacity onPress={navigateBack}>
              <Text style={styles.navigationHistory}>
                {t(`categories.${params.category}.title`)}
              </Text>
            </TouchableOpacity>
            <Image source={require('../../assets/images/chevron.right.png')}/>
          </View>
          <Text style={styles.currentPageTitle}>
            {t(`subCategories.${params.subCategory}.title`)}
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

export default SubCategoryScreen;