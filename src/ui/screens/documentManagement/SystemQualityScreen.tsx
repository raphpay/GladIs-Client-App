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
import styles from '../../assets/styles/documentManagement/SystemQualityScreenStyles';

interface ISystemQualityItem {
  id: string,
  title: string,
  number?: number,
}

type SystemQualityScreenProps = NativeStackScreenProps<IRootStackParams, NavigationRoutes.SystemQualityScreen>;

function SystemQualityScreen(props: SystemQualityScreenProps): React.JSX.Element {
  const [searchText, setSearchText] = useState<string>('');
  const { t } = useTranslation();
  const { navigation } = props;
  const { client, module } = props.route.params;

  const systemQualityItems: ISystemQualityItem[] = [
    {
      id: 'qualityManualID',
      title: t('systemQuality.qualityManual'),
    },
    {
      id: 'processus1ID',
      title: `${t('process.title.single')} 1`,
      number: 1,
    },
    {
      id: 'processus2ID',
      title: `${t('process.title.single')} 2`,
      number: 2,
    },
    {
      id: 'processus3ID',
      title: `${t('process.title.single')} 3`,
      number: 3,
    },
    {
      id: 'processus4ID',
      title: `${t('process.title.single')} 4`,
      number: 4,
    },
    {
      id: 'processus5ID',
      title: `${t('process.title.single')} 5`,
      number: 5,
    },
    {
      id: 'processus6ID',
      title: `${t('process.title.single')} 6`,
      number: 6,
    },
    {
      id: 'processus7ID',
      title: `${t('process.title.single')} 7`,
      number: 7,
    },
  ]

  function navigateBack() {
    navigation.goBack();
  }

  function navigateToDocumentManagement() {
    navigation.navigate(NavigationRoutes.DocumentManagementScreen, { module });
  }

  function navigateTo(item: ISystemQualityItem) {
    if (item.id === 'qualityManualID') {
      navigation.navigate(NavigationRoutes.DocumentsScreen, {
        client,
        module,
        previousScreen: t('systemQuality.title'),
        currentScreen: t('systemQuality.qualityManual')
      })
    } else {
      navigation.navigate(NavigationRoutes.ProcessusScreen, { client, module, processusNumber: item.number ?? 1})
    }
  }

  function SystemQualityFlatListItem(item: ISystemQualityItem) {
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
              data={systemQualityItems}
              numColumns={3}
              renderItem={(renderItem) => SystemQualityFlatListItem(renderItem.item)}
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
              <TouchableOpacity onPress={navigateToDocumentManagement}>
                <Text style={styles.navigationHistory}>
                  {t('documentManagement.title')}
                </Text>
              </TouchableOpacity>
              <Image source={require('../../assets/images/chevron.right.png')}/>
            </View>
            <Text style={styles.currentPageTitle}>
              {t('systemQuality.title')}
            </Text>
          </View>
        </View>
    </SafeAreaView>
  );
}

export default SystemQualityScreen;