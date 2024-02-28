import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  FlatList,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

import { IRootStackParams } from '../../../navigation/Routes';

import NavigationRoutes from '../../../business-logic/model/enums/NavigationRoutes';
import INavigationHistoryItem from '../../../business-logic/model/INavigationHistoryItem';
import ISubCategory from '../../../business-logic/model/ISubCategory';
import { useAppSelector } from '../../../business-logic/store/hooks';
import { RootState } from '../../../business-logic/store/store';

import AppContainer from '../../components/AppContainer';

import styles from '../../assets/styles/documentManagement/DocumentManagementScreenStyles';

type DocumentManagementScreenProps = NativeStackScreenProps<IRootStackParams, NavigationRoutes.DocumentManagementScreen>;

function DocumentManagementScreen(props: DocumentManagementScreenProps): React.JSX.Element {
  const { navigation } = props;
  const [searchText,setSearchText] = useState<string>('');
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

  const navigationHistoryItems: INavigationHistoryItem[] = [
    {
      title: t('dashboard.title'),
      action: () => navigateBack()
    }
  ]

  function navigateBack() {
    navigation.goBack();
  }

  function navigateTo(subCategory: ISubCategory) {
    if (subCategory.id === 'systemQualityID') {
      navigation.navigate(NavigationRoutes.SystemQualityScreen)
    }
  }

  function SubCategoryFlatListItem(item: ISubCategory) {
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
      children={(
        <FlatList
          data={subcategories}
          numColumns={2}
          renderItem={(renderItem) => SubCategoryFlatListItem(renderItem.item)}
          keyExtractor={(item) => item.id}
        />
      )}
      showBackButton={true}
      navigateBack={navigateBack}
    />
  );
}

export default DocumentManagementScreen;