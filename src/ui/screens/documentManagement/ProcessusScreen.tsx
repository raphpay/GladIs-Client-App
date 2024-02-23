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

import AppIcon from '../../components/AppIcon';
import IconButton from '../../components/IconButton';
import SearchTextInput from '../../components/SearchTextInput';

import backIcon from '../../assets/images/arrow.uturn.left.png';
import styles from '../../assets/styles/documentManagement/ProcessusScreenStyles';

interface ISystemQualityItem {
  id: string,
  title: string,
}

type ProcessusProps = NativeStackScreenProps<IRootStackParams, NavigationRoutes.ProcessusScreen>;

function ProcessusScreen(props: ProcessusProps): React.JSX.Element {
  const [searchText, setSearchText] = useState<string>('');
  const { t } = useTranslation();
  const { navigation } = props;
  const { client, module, processusNumber } = props.route.params;

  function navigateToDashboard() {
    navigation.navigate(NavigationRoutes.DashboardScreen)
  }

  function navigateToCategories() {
    navigation.navigate(NavigationRoutes.DocumentManagementScreen, { module: module });
  }

  function navigateBack() {
    navigation.goBack();
  }

  function navigateToDocumentManagement() {
    navigation.navigate(NavigationRoutes.DocumentManagementScreen, { module });
  }

  function navigateTo(item: ISystemQualityItem) {
    // if (item.id === 'qualityManualID') {
    //   navigation.navigate(NavigationRoutes.DocumentsScreen, {
    //     client,
    //     module,
    //     previousScreen: t('categories.systemQuality.title'),
    //     currentScreen: t('systemQuality.qualityManual')
    //   })
    // }
  }

  function ProcessusFlatListItem(item: ISystemQualityItem) {
    return (
      <TouchableOpacity onPress={() => navigateTo(item)}>
        <View style={styles.processusContainer}>
          <Text style={styles.categoryTitle}>{item.title}</Text>
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
              data={[]}
              numColumns={3}
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
        <View style={styles.topContainer}>
          <AppIcon style={styles.appIcon} />
          <View>
            <View style={styles.navigationHistoryContainer}>
              <TouchableOpacity onPress={navigateToDashboard}>
                <Text style={styles.navigationHistory}>
                  {t('dashboard.title')}
                </Text>
              </TouchableOpacity>
              <Image source={require('../../assets/images/chevron.right.png')}/>
              <TouchableOpacity onPress={navigateToCategories}>
                <Text style={styles.navigationHistory}>
                  {t('categories.documentManagement.title')}
                </Text>
              </TouchableOpacity>
              <Image source={require('../../assets/images/chevron.right.png')}/>
              <TouchableOpacity onPress={navigateBack}>
                <Text style={styles.navigationHistory}>
                  {t('subCategories.systemQuality.title')}
                </Text>
              </TouchableOpacity>
              <Image source={require('../../assets/images/chevron.right.png')}/>
            </View>
            <Text style={styles.currentPageTitle}>
              {`${t('systemQuality.processus')} ${processusNumber}`}
            </Text>
          </View>
        </View>
    </SafeAreaView>
  );
}

export default ProcessusScreen;