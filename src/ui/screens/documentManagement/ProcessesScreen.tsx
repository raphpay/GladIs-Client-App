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

import AppContainer from '../../components/AppContainer';

import styles from '../../assets/styles/documentManagement/ProcessesScreenStyles';

interface IProcessItem {
  id: string,
  title: string,
}

type ProcessesProps = NativeStackScreenProps<IRootStackParams, NavigationRoutes.ProcessesScreen>;

function ProcessesScreen(props: ProcessesProps): React.JSX.Element {
  const [searchText, setSearchText] = useState<string>('');
  const { t } = useTranslation();
  const { navigation } = props;
  const { processNumber } = props.route.params;
  const processes: IProcessItem[] = [
    {
      id: 'processesID',
      title: t('documentsScreen.processes')
    },
    {
      id: 'proceduresID',
      title: t('documentsScreen.procedures')
    },
    {
      id: 'formsID',
      title: t('documentsScreen.forms')
    },
    {
      id: 'recordsID',
      title: t('documentsScreen.records')
    },
  ];
  const processesFiltered = processes.filter(process =>
    process.title.toLowerCase().includes(searchText.toLowerCase()),
  );

  const navigationHistoryItems: INavigationHistoryItem[] = [
    {
      title: t('dashboard.title'),
      action: () => navigateToDashboard()
    },
    {
      title: t('documentManagement.title'),
      action: () => navigateToDocumentManagement()
    },
    {
      title: t('systemQuality.title'),
      action: () => navigateBack()
    }
  ]

  function navigateToDashboard() {
    navigation.navigate(NavigationRoutes.DashboardScreen)
  }

  function navigateBack() {
    navigation.goBack();
  }

  function navigateToDocumentManagement() {
    navigation.navigate(NavigationRoutes.DocumentManagementScreen);
  }

  function navigateTo(item: IProcessItem) {
    navigation.navigate(NavigationRoutes.DocumentsScreen, {
      previousScreen: 'process',
      processNumber: processNumber,
      currentScreen: item.title,
      documentsPath: `process${processNumber}/${item.title}`
    });
  }

  function ProcessusFlatListItem(item: IProcessItem) {
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
      mainTitle={`${t('process.title.single')} ${processNumber}`}
      navigationHistoryItems={navigationHistoryItems}
      searchText={searchText}
      setSearchText={setSearchText}
      showBackButton={true}
      showSearchText={true}
      navigateBack={navigateBack}
    >
      <FlatList
        data={processesFiltered}
        numColumns={2}
        renderItem={(renderItem) => ProcessusFlatListItem(renderItem.item)}
        keyExtractor={(item) => item.id}
      />
    </AppContainer>
  );
}

export default ProcessesScreen;