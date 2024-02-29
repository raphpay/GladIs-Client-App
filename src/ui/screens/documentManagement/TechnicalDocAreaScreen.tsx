import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, Image, Text, TouchableOpacity, View } from 'react-native';

import { IRootStackParams } from '../../../navigation/Routes';

import INavigationHistoryItem from '../../../business-logic/model/INavigationHistoryItem';
import ITechnicalDocTab from '../../../business-logic/model/ITechnicalDocumentationTab';
import NavigationRoutes from '../../../business-logic/model/enums/NavigationRoutes';
import UserType from '../../../business-logic/model/enums/UserType';
import UserService from '../../../business-logic/services/UserService';
import { useAppSelector } from '../../../business-logic/store/hooks';
import { RootState } from '../../../business-logic/store/store';

import AppContainer from '../../components/AppContainer';
import ContentUnavailableView from '../../components/ContentUnavailableView';

import styles from '../../assets/styles/documentManagement/TechnicalDocumentationScreenStyles';

type TechnicalDocAreaScreenProps = NativeStackScreenProps<IRootStackParams, NavigationRoutes.TechnicalDocAreaScreen>;

function TechnicalDocAreaScreen(props: TechnicalDocAreaScreenProps): React.JSX.Element {
  const [searchText, setSearchText] = useState<string>('');
  const [technicalTabs, setTechnicalTabs] = useState<ITechnicalDocTab[]>([]);
  const { navigation } = props;
  const { area } = props.route.params;
  const { t } = useTranslation();
  const { currentUser, currentClient } = useAppSelector((state: RootState) => state.users);
  const { token } = useAppSelector((state: RootState) => state.tokens);
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
  const technicalTabsFiltered = technicalTabs.filter(technicalTab =>
    technicalTab.name.toLowerCase().includes(searchText.toLowerCase()),
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

  function navigateTo(item: ITechnicalDocTab) {
    navigation.navigate(NavigationRoutes.DocumentsScreen, {
      previousScreen: area.name,
      currentScreen: item.name,
      processNumber: undefined,
      documentsPath: `technicalDocumentation/${area.name}/${item.name}`
    });
  }

  useEffect(() => {
    async function init() {
      const tabs = await UserService.getInstance().getUsersTabs(currentClient?.id, token)
      const areaTabs = tabs.filter(tab => {
        return tab.area === area.id.toLowerCase();
      })
      setTechnicalTabs(areaTabs);
    }
    init();
  }, []);

  // TODO: refactor this ( present in other screens )
  function TabFlatListItem(item: ITechnicalDocTab) {
    return (
      <TouchableOpacity onPress={() => navigateTo(item)}>
        <View style={styles.processusContainer}>
          <Text style={styles.categoryTitle}>{t(`technicalDocumentation.tab.${item.name}`)}</Text>
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
      <>
        {
          technicalTabsFiltered.length === 0 ? (
            <ContentUnavailableView
              title={t('technicalDocumentation.noTabs.title')}
              message={
                currentUser?.userType === UserType.Admin ?
                  t('technicalDocumentation.noTabs.admin') :
                  t('technicalDocumentation.noTabs.client')
              }
              image={(
                <Image source={require('../../assets/images/list.clipboard.png')}/>
              )}
            />
          ) : (
            <FlatList
              data={technicalTabsFiltered}
              numColumns={3}
              renderItem={(renderItem) => TabFlatListItem(renderItem.item)}
              keyExtractor={(item) => item.id}
            />
          )
        }
      </>
    </AppContainer>
  );
}

export default TechnicalDocAreaScreen;