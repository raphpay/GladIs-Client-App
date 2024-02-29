import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';

import { IRootStackParams } from '../../../navigation/Routes';

import IArea from '../../../business-logic/model/IArea';
import INavigationHistoryItem from '../../../business-logic/model/INavigationHistoryItem';
import NavigationRoutes from '../../../business-logic/model/enums/NavigationRoutes';
import UserType from '../../../business-logic/model/enums/UserType';
import { useAppSelector } from '../../../business-logic/store/hooks';
import { RootState } from '../../../business-logic/store/store';

import AppContainer from '../../components/AppContainer';

import styles from '../../assets/styles/documentManagement/TechnicalDocumentationScreenStyles';

type TechnicalDocumentationScreenProps = NativeStackScreenProps<IRootStackParams, NavigationRoutes.TechnicalDocumentationScreen>;

// TODO: create translation
function TechnicalDocumentationScreen(props: TechnicalDocumentationScreenProps): React.JSX.Element {
  const [searchText, setSearchText] = useState<string>('');
  const { t } = useTranslation();
  const { navigation } = props;
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
  ];
  const areas: IArea[] = [
    {
      id: 'europeID',
      name: t('technicalDocumentation.areas.europe')
    },
    {
      id: 'usaID',
      name: t('technicalDocumentation.areas.usa')
    },
    {
      id: 'canadaID',
      name: t('technicalDocumentation.areas.canada')
    },
    {
      id: 'australiaID',
      name: t('technicalDocumentation.areas.australia')
    },
    {
      id: 'brasilID',
      name: t('technicalDocumentation.areas.brasil')
    }
  ];
  const areasFiltered = areas.filter(area =>
    area.name.toLowerCase().includes(searchText.toLowerCase()),
  );

  function navigateBack() {
    navigation.goBack();
  }

  function navigateToDashboard() {
    navigation.navigate(currentUser?.userType == UserType.Admin ? NavigationRoutes.ClientDashboardScreenFromAdmin : NavigationRoutes.DashboardScreen);
  }

  function navigateTo(item: IArea) {
    console.log('navigateTo', item );
    // if (item.id === 'qualityManualID') {
    //   navigation.navigate(NavigationRoutes.DocumentsScreen, {
    //     previousScreen: 'systemQuality',
    //     currentScreen: 'qualityManual',
    //     documentsPath: 'systemQuality/qualityManual',
    //     processNumber: undefined,
    //   })
    // } else {
    //   navigation.navigate(NavigationRoutes.ProcessesScreen, { processNumber: item.number ?? 1})
    // }
  }

  function AreaFlatListItem(item: IArea) {
    return (
      <TouchableOpacity onPress={() => navigateTo(item)}>
        <View style={styles.processusContainer}>
          <Text style={styles.categoryTitle}>{item.name}</Text>
        </View>
      </TouchableOpacity>
    )
  }

  return (
    <AppContainer 
      mainTitle={t('technicalDocumentation.title')}
      searchText={searchText}
      setSearchText={setSearchText}
      navigationHistoryItems={navigationHistoryItems}
    >
      <FlatList
        data={areasFiltered}
        numColumns={3}
        renderItem={(renderItem) => AreaFlatListItem(renderItem.item)}
        keyExtractor={(item) => item.id}
      />
    </AppContainer>
  );
}

export default TechnicalDocumentationScreen;