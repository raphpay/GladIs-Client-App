import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  FlatList,
  Image,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { IRootStackParams } from '../../../navigation/Routes';

import NavigationRoutes from '../../../business-logic/model/enums/NavigationRoutes';
import { ISubCategory } from '../../../business-logic/model/IModule';

import AppIcon from '../../components/AppIcon';
import IconButton from '../../components/IconButton';
import SearchTextInput from '../../components/SearchTextInput';

import backIcon from '../../assets/images/arrow.uturn.left.png';
import styles from '../../assets/styles/documentManagement/DocumentManagementScreenStyles';

type DocumentManagementScreenProps = NativeStackScreenProps<IRootStackParams, NavigationRoutes.DocumentManagementScreen>;

function DocumentManagementScreen(props: DocumentManagementScreenProps): React.JSX.Element {
  const { navigation } = props;
  const { client, module } = props.route.params;
  const [searchText,setSearchText] = useState<string>('');
  const { t } = useTranslation();

  console.log('client', client, module );
  const subcategories: ISubCategory[] = [
    {
      id: 'systemQualityID',
      title: t('systemQuality.title'),
    },
    {
      id: 'technicalDocumentationID',
      title: t('technicalDocumentation.title'),
    },
  ]

  function navigateBack() {
    navigation.goBack();
  }

  function navigateTo(subCategory: ISubCategory) {
    if (subCategory.id === 'systemQualityID') {
      navigation.navigate(NavigationRoutes.SystemQualityScreen, { client, module })
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

export default DocumentManagementScreen;