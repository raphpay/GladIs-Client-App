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

import IconButton from '../../components/IconButton';
import SearchTextInput from '../../components/SearchTextInput';
import TopAppBar from '../../components/TopAppBar';

import backIcon from '../../assets/images/arrow.uturn.left.png';
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
      title: 'processes'
    },
    {
      id: 'proceduresID',
      title: 'procedures'
    },
    {
      id: 'formsID',
      title: 'forms'
    },
    {
      id: 'recordsID',
      title: 'records'
    },
  ];

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
          <Text style={styles.categoryTitle}>{t(`documentsScreen.${item.title}`)}</Text>
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
              data={processes}
              numColumns={2}
              renderItem={(renderItem) => ProcessusFlatListItem(renderItem.item)}
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
        <TopAppBar
          mainTitle={`${t('process.title.single')} ${processNumber}`}
          navigationHistoryItems={navigationHistoryItems}
        />
    </SafeAreaView>
  );
}

export default ProcessesScreen;