import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';

import { IRootStackParams } from '../../../navigation/Routes';

import NavigationRoutes from '../../../business-logic/model/enums/NavigationRoutes';
import { useAppSelector } from '../../../business-logic/store/hooks';
import { RootState } from '../../../business-logic/store/store';

import AppContainer from '../../components/AppContainer';
import ErrorDialog from '../../components/ErrorDialog';

import styles from '../../assets/styles/settings/SettingsScreenStyles';

type ClientSettingsScreenFromAdminProps = NativeStackScreenProps<IRootStackParams, NavigationRoutes.ClientSettingsScreenFromAdmin>;

interface ISettingsAction {
  id: string;
  title: string;
  action: () => void;
  isActionDisabled: boolean;
}

function ClientSettingsScreenFromAdmin(props: ClientSettingsScreenFromAdminProps): React.JSX.Element {
  const { t } = useTranslation();
  const { navigation } = props;
  const { currentUser, currentClient } = useAppSelector((state: RootState) => state.users);
  const [showErrorDialog, setShowErrorDialog] = useState<boolean>(false);

  const settingsActions: ISettingsAction[] = [
    {
      id: 'userInfos',
      title: `${t('settings.userInfos')} ${currentUser?.username}`,
      action: () => {},
      isActionDisabled: true,
    },
    {
      id: 'clientInfos',
      title: `${t('settings.clientSettings.clientInfos')} ${currentClient?.username}`,
      action: () => {},
      isActionDisabled: true,
    },
    {
      id: 'billListID',
      title: t('settings.clientSettings.bills'),
      action: () => navigateToBills(),
      isActionDisabled: false,
    },
    {
      id: 'employeesID',
      title: t('settings.clientSettings.employees'),
      action: () => navigateToEmployees(),
      isActionDisabled: false,
    },
    {
      id: 'modulesID',
      title: t('settings.clientSettings.modules'),
      action: () => navigateToModules(),
      isActionDisabled: false,
    },
  ];

  function navigateBack() {
    navigation.goBack()
  }

  function navigateToBills() {
    navigation.navigate(NavigationRoutes.DocumentsScreen, {
      previousScreen: t('settings.title'),
      currentScreen: t('settings.clientSettings.bills'),
      documentsPath: 'bills',
      processNumber: undefined,
      hideModulesRoute: true,
    });
  }

  function navigateToEmployees() {
    navigation.navigate(NavigationRoutes.ClientEmployees);
  }

  function navigateToModules() {
    navigation.navigate(NavigationRoutes.ClientModules);
  }

  function additionalMentions() {
    // TODO: Add app version number to API
    return (
      <View style={styles.additionalMentions}>
        <Text style={styles.mentionText}>{t('legal.appName')} v 0.1.0</Text>
        <Text style={styles.mentionText}>{t('legal.developer')}</Text>
      </View>
    )
  }

  function errorDialog() {
    return (
      <>
        {
          showErrorDialog && (
            <ErrorDialog
              title={t('errors.logout.title')}
              description={t('errors.logout.message')}
              cancelTitle={t('errors.modules.cancelButton')}
              onCancel={() => setShowErrorDialog(false)}
            />
          )
        }
      </>
    )
  }

  function SettingsActionFlatListItem(item: ISettingsAction) {
    return (
      <TouchableOpacity
        disabled={item.isActionDisabled}
        style={styles.actionContainer}
        onPress={item.action}
      >
        <Text style={item.isActionDisabled ? styles.text : styles.actionText}>{item.title}</Text>
        <View style={styles.separator} />
      </TouchableOpacity>
    )
  }

  return (
    <>
      <AppContainer
        mainTitle={t('settings.title')}
        showSearchText={false}
        showSettings={false}
        showBackButton={true}
        navigateBack={navigateBack}
        additionalComponent={additionalMentions()}
      >
        <FlatList
          data={settingsActions}
          renderItem={(renderItem) => SettingsActionFlatListItem(renderItem.item)}
          keyExtractor={(item) => item.id}
        />
      </AppContainer>
      {errorDialog()}
    </>
  );
}

export default ClientSettingsScreenFromAdmin;