import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Text,
  View
} from 'react-native';

import IModule from '../../../../business-logic/model/IModule';
import NavigationRoutes from '../../../../business-logic/model/enums/NavigationRoutes';

import Grid from '../../Grid';
import GridModuleItem from '../../GridModuleItem';

import styles from '../../../assets/styles/components/DashboardAdminGridStyles';

function ModuleSection(): React.JSX.Element {

  const navigation = useNavigation();
  const { t } = useTranslation();

  const modules: IModule[] = [
    {
      id: '1',
      name: 'reminders',
      index: 1,
    },
    {
      id: '2',
      name: 'chat',
      index: 2,
    },
  ];

  // Sync Method
  function navigateToModule(module: IModule) {
    switch (module.name) {
      case 'reminders':
        navigation.navigate(NavigationRoutes.RemindersScreen);
        break;
      case 'chat':
        navigation.navigate(NavigationRoutes.MessagesScreen);
        break;
      default:
        break;
    }
  }

  // Component
  return (
    <View style={styles.clientSectionContainer}>
      <Text style={styles.sectionTitle}>{t('dashboard.sections.modules')}</Text>
      <View style={styles.separator}/>
      <Grid
        data={modules}
        scrollEnabled={false}
        renderItem={(renderItem) => 
          <GridModuleItem
            module={renderItem.item}
            onPress={navigateToModule}
          />
        }
      />
    </View>
  );
}

export default ModuleSection;
