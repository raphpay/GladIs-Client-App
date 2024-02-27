import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  FlatList,
  SafeAreaView,
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

import IconButton from '../../components/IconButton';
import SearchTextInput from '../../components/SearchTextInput';
import TopAppBar from '../../components/TopAppBar';

import backIcon from '../../assets/images/arrow.uturn.left.png';
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
    <SafeAreaView style={styles.container}>
      <View style={styles.innerContainer}>
          <View style={styles.innerComponentsContainer}>
            <View style={styles.searchInputContainer}>
              <SearchTextInput 
                searchText={searchText}
                setSearchText={setSearchText}
              />
            </View>
            <FlatList
              data={subcategories}
              numColumns={2}
              renderItem={(renderItem) => SubCategoryFlatListItem(renderItem.item)}
              keyExtractor={(item) => item.id}
            />
          </View>
          <View style={styles.backButtonContainer}>
            <IconButton
              title={t('components.buttons.back')}
              icon={backIcon}
              onPress={navigateBack}
             />
          </View>
        </View>
        <TopAppBar mainTitle={t(`modules.${module?.name}`)} navigationHistoryItems={navigationHistoryItems}/>
    </SafeAreaView>
  );
}

export default DocumentManagementScreen;