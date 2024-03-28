import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';

import IUser from '../../business-logic/model/IUser';
import NavigationRoutes from '../../business-logic/model/enums/NavigationRoutes';
import PasswordResetService from '../../business-logic/services/PasswordResetService';
import UserService from '../../business-logic/services/UserService';
import { useAppDispatch, useAppSelector } from '../../business-logic/store/hooks';
import { setCurrentClient } from '../../business-logic/store/slices/userReducer';
import { RootState } from '../../business-logic/store/store';

import ContentUnavailableView from './ContentUnavailableView';
import Grid from './Grid';
import GridClientItem from './GridClientItem';

import { Colors } from '../assets/colors/colors';
import styles from '../assets/styles/components/DashboardAdminGridStyles';

type DashboardAdminGridProps = {
  searchText: string;
};

interface IActionItem {
  id: string;
  number: number;
  name: string;
  color?: string;
  screenDestination?: string;
}

function DashboardAdminGrid(props: DashboardAdminGridProps): React.JSX.Element {
  const { searchText } = props;

  const clipboardIcon = require('../assets/images/list.clipboard.png');

  const [clients, setClients] = useState<IUser[]>([]);
  const [passwordResetAction, setPasswordResetAction] = useState<IActionItem>();

  const clientsFiltered = clients.filter(client =>
    client.username?.toLowerCase().includes(searchText?.toLowerCase()),
  );

  const navigation = useNavigation();
  const { token } = useAppSelector((state: RootState) => state.tokens);
  const { clientListCount } = useAppSelector((state: RootState) => state.appState);
  const dispatch = useAppDispatch();

  function navigateToClientDashboard(client: IUser) {
    dispatch(setCurrentClient(client));
    navigation.navigate(NavigationRoutes.ClientDashboardScreenFromAdmin)
  }

  const { t } = useTranslation();

  async function loadClients() {
    const apiClients = await UserService.getInstance().getClients(token);
    setClients(apiClients);
  }

  async function loadActions() {
    // TODO: Load events too
    try {
      const passwordsToReset = await PasswordResetService.getInstance().getAll(token);
      if (passwordsToReset.length === 0) {
        setPasswordResetAction(undefined);
      } else {
        const resetAction: IActionItem = {
          id: '1',
          number: passwordsToReset.length,
          name: t('dashboard.sections.actions.passwordsToReset'),
          screenDestination: 'NavigationRoutes.PasswordResetScreen',
        }
        setPasswordResetAction(resetAction);
      }
    } catch (error) {
      console.log('Error loading password reset tokens', error);
    }
  }

  useEffect(() => {
    async function init() {
      await loadClients();
      await loadActions();
    }
    init();
  }, []);

  useEffect(() => {
    async function init() {
      await loadClients();
    }
    init();
  }, [clientListCount]);

  function ActionGridItem(item?: IActionItem) {
    function navigateTo() {
      if (item?.screenDestination) {
        navigation.navigate(item.screenDestination);
      }
    }

    return (
      <>
        {
          item && (
            <TouchableOpacity onPress={navigateTo} style={styles.actionRow}>
              <View style={{...styles.circle, borderColor: item.color ? item.color : Colors.primary}}>
                <Text style={styles.circleNumber}>{item.number}</Text>
              </View>
              <Text>{item.name}</Text>
            </TouchableOpacity>
          )
        }
      </>
    )
  }

  function ActionSection() {
    return (
      <>
        {
          passwordResetAction && (
            <View style={styles.actionSectionContainer}>
              <Text style={styles.sectionTitle}>{t('dashboard.sections.actions.title')}</Text>
              <ScrollView horizontal={true}>
                {ActionGridItem(passwordResetAction)}
              </ScrollView>
            </View>
          )
        }
      </>
    )
  }

  // TODO: Add translations
  function ClientSection() {
    return (
      <View style={styles.clientSectionContainer}>
        <Text style={styles.sectionTitle}>{t('dashboard.sections.clients')}</Text>
        <View style={styles.separator}/>
        {
          clientsFiltered.length === 0 ? (
            <ContentUnavailableView
              title={t('dashboard.noClients.title')}
              message={t('dashboard.noClients.message')}
              image={clipboardIcon}
            />
            ) : (
            <Grid
              data={clientsFiltered}
              renderItem={(renderItem) => 
                <GridClientItem
                  client={renderItem.item} 
                  onPress={() => navigateToClientDashboard(renderItem.item)}
                />
              }
            />
          )
        }
      </View>
    )
  }

  return (
    <View style={styles.container}>
      {ActionSection()}
      {ClientSection()}
    </View>
  );
}

export default DashboardAdminGrid;