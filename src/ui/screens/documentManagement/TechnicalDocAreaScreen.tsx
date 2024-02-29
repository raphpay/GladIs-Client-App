import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';

import { IRootStackParams } from '../../../navigation/Routes';

import INavigationHistoryItem from '../../../business-logic/model/INavigationHistoryItem';
import ISubCategory from '../../../business-logic/model/ISubCategory';
import NavigationRoutes from '../../../business-logic/model/enums/NavigationRoutes';
import UserType from '../../../business-logic/model/enums/UserType';
import { useAppSelector } from '../../../business-logic/store/hooks';
import { RootState } from '../../../business-logic/store/store';

import AppContainer from '../../components/AppContainer';

import styles from '../../assets/styles/documentManagement/TechnicalDocumentationScreenStyles';

type TechnicalDocAreaScreenProps = NativeStackScreenProps<IRootStackParams, NavigationRoutes.TechnicalDocAreaScreen>;

function TechnicalDocAreaScreen(props: TechnicalDocAreaScreenProps): React.JSX.Element {
  const [searchText, setSearchText] = useState<string>('');
  const { navigation } = props;
  const { area } = props.route.params;
  const { t } = useTranslation();
  const { currentUser } = useAppSelector((state: RootState) => state.users);
  const navigationHistoryItems: INavigationHistoryItem[] = [
    {
      title: t('dashboard.title'),
      action: () => navigateToDashboard(),
    },
    {
      title: t('documentManagement.title'),
      action: () => navigateBack(),
    },
    {
      title: t('technicalDocumentation.title'),
      action: () => navigateToTechnicalDocumentation(),
    }
  ];
  const subCategories: ISubCategory[] = [
    {
      id: 'regionalAdministrationID',
      title: t('technicalDocumentation.subCategories.regionalAdministration')
    },
    {
      id: 'submissionContextID',
      title: t('technicalDocumentation.subCategories.submissionContext')
    },
    {
      id: 'nonClinicalProofID',
      title: t('technicalDocumentation.subCategories.nonClinicalProof')
    },
    {
      id: 'clinicalProofID',
      title: t('technicalDocumentation.subCategories.clinicalProof')
    },
    {
      id: 'labellingID',
      title: t('technicalDocumentation.subCategories.labelling')
    },
  ];
  const subCategoriesFiltered = subCategories.filter(subCategory =>
    subCategory.title.toLowerCase().includes(searchText.toLowerCase()),
  );

  function navigateBack() {
    navigation.goBack();
  }

  function navigateToTechnicalDocumentation() {
    navigation.navigate(NavigationRoutes.TechnicalDocumentationScreen);
  }

  function navigateToDashboard() {
    navigation.navigate(currentUser?.userType == UserType.Admin ? NavigationRoutes.ClientDashboardScreenFromAdmin : NavigationRoutes.DashboardScreen);
  }

  function navigateTo(item: ISubCategory) {
    // navigation.navigate(NavigationRoutes.TechnicalDocAreaScreen, { area: item })
  }

  // TODO: refactor this ( present in other screens )
  function SubCategoryFlatListItem(item: ISubCategory) {
    return (
      <TouchableOpacity onPress={() => navigateTo(item)}>
        <View style={styles.processusContainer}>
          <Text style={styles.categoryTitle}>{item.title}</Text>
        </View>
      </TouchableOpacity>
    )
  }

  return (
    <AppContainer 
      mainTitle={area.name}
      searchText={searchText}
      setSearchText={setSearchText}
      showBackButton={true}
      navigateBack={navigateBack}
      navigationHistoryItems={navigationHistoryItems}
    >
      <FlatList
        data={subCategoriesFiltered}
        numColumns={3}
        renderItem={(renderItem) => SubCategoryFlatListItem(renderItem.item)}
        keyExtractor={(item) => item.id}
      />
    </AppContainer>
  );
}

export default TechnicalDocAreaScreen;