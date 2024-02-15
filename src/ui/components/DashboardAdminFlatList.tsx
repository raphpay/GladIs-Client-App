import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  FlatList,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

import IUser from '../../business-logic/model/IUser';
import UserService from '../../business-logic/services/UserService';

import ContentUnavailableView from './ContentUnavailableView';

import styles from '../assets/styles/components/DashboardAdminFlatListStyles';

function DashboardAdminFlatList(): React.JSX.Element {

  const [clients, setClients] = useState<IUser[]>([]);

  function navigateToClientDashboard(client: IUser) {
    //
  }

  const { t } = useTranslation();

  function FlatListClientItem(client: IUser) {
    return (
      <TouchableOpacity onPress={() => navigateToClientDashboard(client)} style={styles.clientContainer}>
        <View style={styles.clientLogo}>
          <Text style={styles.clientNameText}>Client logo</Text>
        </View>
        <View style={styles.nameContainer}>
          <Text style={styles.clientNameText}>{client.username}</Text>
        </View>
      </TouchableOpacity>
    )
  }

  useEffect(() => {
    async function init() {
      const apiClients = await UserService.getInstance().getClients();
      setClients(apiClients);
    }
    init();
  }, []);

  return (
    <>
    {
      clients.length === 0 ? (
        <ContentUnavailableView />
      ) : (
        <FlatList
          data={clients}
          numColumns={4}
          renderItem={(renderItem) => FlatListClientItem(renderItem.item)}
          keyExtractor={(item) => item.id}
        />
      )
    }
    </>
  );
}

export default DashboardAdminFlatList;