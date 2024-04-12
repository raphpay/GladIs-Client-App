import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Text,
  TouchableOpacity,
  View
} from 'react-native';

import { IRootStackParams } from '../../../navigation/Routes';

import NavigationRoutes from '../../../business-logic/model/enums/NavigationRoutes';
import IAction from '../../../business-logic/model/IAction';
import ISubCategory from '../../../business-logic/model/ISubCategory';
import { useAppSelector } from '../../../business-logic/store/hooks';
import { RootState } from '../../../business-logic/store/store';

import AppContainer from '../../components/AppContainer/AppContainer';
import ContentUnavailableView from '../../components/ContentUnavailableView';
import Grid from '../../components/Grid/Grid';

import styles from '../../assets/styles/documentManagement/DocumentManagementScreenStyles';

type DocumentManagementScreenProps = NativeStackScreenProps<IRootStackParams, NavigationRoutes.DocumentManagementScreen>;

function DocumentManagementScreen(props: DocumentManagementScreenProps): React.JSX.Element {
  const { navigation } = props;
  
  const clipboardIcon = require('../../assets/images/list.clipboard.png');

  const [searchText, setSearchText] = useState<string>('');

  const { t } = useTranslation();
  
  const { module } = useAppSelector((state: RootState) => state.appState);
  
  const subcategories: ISubCategory[] = [
    {
      id: 'systemQualityID',
      title: t('systemQuality.title'),
    },
    {
      id: 'technicalDocumentationID',
      title: t('technicalDocumentation.title'),
    },
  ];
  const subcategoriesFiltered = subcategories.filter(subCategory =>
    subCategory.title.toLowerCase().includes(searchText.toLowerCase()),
  );

  const navigationHistoryItems: IAction[] = [
    {
      title: t('dashboard.title'),
      onPress: () => navigateBack()
    }
  ];

  // Sync Methods
  function navigateBack() {
    navigation.goBack();
  }

  function navigateTo(subCategory: ISubCategory) {
    if (subCategory.id === 'systemQualityID') {
      navigation.navigate(NavigationRoutes.SystemQualityScreen)
    } else if (subCategory.id === 'technicalDocumentationID') {
      navigation.navigate(NavigationRoutes.TechnicalDocumentationScreen)
    }
  }

  // Components
  function SubCategoryGridItem(item: ISubCategory) {
    return (
      <TouchableOpacity onPress={() => navigateTo(item)}>
        <View style={styles.categoryContainer}>
          <View style={styles.categoryImageContainer} />
          <View style={styles.categoryTextsContainer}>
            <Text style={styles.categoryTitle}>{item.title}</Text>
          </View>
        </View>
      </TouchableOpacity>
    )
  }

  return (
    <AppContainer 
      mainTitle={t(`modules.${module?.name}`)}
      navigationHistoryItems={navigationHistoryItems}
      searchText={searchText}
      setSearchText={setSearchText}
      showBackButton={true}
      showSearchText={true}
      showSettings={true}
      navigateBack={navigateBack}
    >
      <>
        {
          subcategories && subcategories.length === 0 ? (
            <ContentUnavailableView
              title={t('documentManagement.noSubCategories.title')}
              message={t('documentManagement.noSubCategories.message')}
              image={clipboardIcon}
            />
          ) : (
            <Grid
              data={subcategoriesFiltered}
              renderItem={(renderItem) => SubCategoryGridItem(renderItem.item)}
            />
          )
        }
      </>
    </AppContainer>
  );
}

export default DocumentManagementScreen;