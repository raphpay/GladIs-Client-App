import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Text, TouchableOpacity, View } from 'react-native';

import { IRootStackParams } from '../../../navigation/Routes';

import NavigationRoutes from '../../../business-logic/model/enums/NavigationRoutes';
import IAction from '../../../business-logic/model/IAction';
import { useAppDispatch, useAppSelector } from '../../../business-logic/store/hooks';
import { setDocumentListCount } from '../../../business-logic/store/slices/appStateReducer';
import { RootState } from '../../../business-logic/store/store';

import AppContainer from '../../components/AppContainer/AppContainer';
import ContentUnavailableView from '../../components/ContentUnavailableView';
import Grid from '../../components/Grid/Grid';

import styles from '../../assets/styles/documentManagement/ProcessesScreenStyles';

interface IProcessItem {
  id: string,
  title: string,
}

type ProcessesProps = NativeStackScreenProps<IRootStackParams, NavigationRoutes.ProcessesScreen>;

function ProcessesScreen(props: ProcessesProps): React.JSX.Element {
  const [searchText, setSearchText] = useState<string>('');
  const clipboardIcon = require('../../assets/images/list.clipboard.png');
  
  const { t } = useTranslation();
  const { documentListCount } = useAppSelector((state: RootState) => state.appState);
  const dispatch = useAppDispatch();

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

  const navigationHistoryItems: IAction[] = [
    {
      title: t('dashboard.title'),
      onPress: () => navigateToDashboard()
    },
    {
      title: t('documentManagement.title'),
      onPress: () => navigateToDocumentManagement()
    },
    {
      title: t('systemQuality.title'),
      onPress: () => navigateBack()
    }
  ]

  // Sync Methods
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
    dispatch(setDocumentListCount(documentListCount + 1));
    console.log('itel', item );
    if (item.id === 'formsID') {
      navigation.navigate(NavigationRoutes.FormsDocumentScreen, { documentPath: `process${processNumber}/${item.title}` });
    } else {
      navigation.navigate(NavigationRoutes.DocumentsScreen, {
        previousScreen: 'process',
        processNumber: processNumber,
        currentScreen: item.title,
        documentsPath: `process${processNumber}/${item.title}`
      });
    }
  }

  // Components
  function ProcessusGridItem(item: IProcessItem) {
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
      showSettings={true}
      navigateBack={navigateBack}
    >
      {
        processesFiltered && processesFiltered.length === 0 ? (
          <ContentUnavailableView
            title={t('process.noItems.title')}
            message={t('process.noItems.message')}
            image={clipboardIcon}
          />
        ) : (
          <Grid
            data={processesFiltered}
            renderItem={(renderItem) => ProcessusGridItem(renderItem.item)}
          />
        )
      }
    </AppContainer>
  );
}

export default ProcessesScreen;