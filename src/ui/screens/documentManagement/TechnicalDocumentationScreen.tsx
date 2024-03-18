import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Text, TouchableOpacity, View } from 'react-native';

import { IRootStackParams } from '../../../navigation/Routes';

import IArea from '../../../business-logic/model/IArea';
import INavigationHistoryItem from '../../../business-logic/model/INavigationHistoryItem';
import NavigationRoutes from '../../../business-logic/model/enums/NavigationRoutes';
import UserType from '../../../business-logic/model/enums/UserType';
import { useAppSelector } from '../../../business-logic/store/hooks';
import { RootState } from '../../../business-logic/store/store';
import ContentUnavailableView from '../../components/ContentUnavailableView';

import AppContainer from '../../components/AppContainer';
import Grid from '../../components/Grid';

import styles from '../../assets/styles/documentManagement/TechnicalDocumentationScreenStyles';

type TechnicalDocumentationScreenProps = NativeStackScreenProps<IRootStackParams, NavigationRoutes.TechnicalDocumentationScreen>;

function TechnicalDocumentationScreen(props: TechnicalDocumentationScreenProps): React.JSX.Element {
  const [searchText, setSearchText] = useState<string>('');
  const { t } = useTranslation();
  const { navigation } = props;
  const { currentUser } = useAppSelector((state: RootState) => state.users);
  const clipboardIcon = require('../../assets/images/list.clipboard.png');

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
      id: 'europe',
      name: t('technicalDocumentation.areas.europe')
    },
    {
      id: 'usa',
      name: t('technicalDocumentation.areas.usa')
    },
    {
      id: 'canada',
      name: t('technicalDocumentation.areas.canada')
    },
    {
      id: 'australia',
      name: t('technicalDocumentation.areas.australia')
    },
    {
      id: 'brasil',
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
    navigation.navigate(NavigationRoutes.TechnicalDocAreaScreen, { area: item })
  }

  function AreaGridItem(item: IArea) {
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
      showBackButton={true}
      showSearchText={true}
      showSettings={true}
      navigateBack={navigateBack}
    >
      {
        areasFiltered.length === 0 ? (
          <ContentUnavailableView
            title={t('technicalDocumentation.noAreas.title')}
            message={t('technicalDocumentation.noAreas.message')}
            image={clipboardIcon}
          />
        ) : (
          <Grid
            data={areasFiltered}
            renderItem={(renderItem) => AreaGridItem(renderItem.item)}
          />
        )
      }
    </AppContainer>
  );
}

export default TechnicalDocumentationScreen;