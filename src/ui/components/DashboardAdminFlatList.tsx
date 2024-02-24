import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  FlatList,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

import IUser from '../../business-logic/model/IUser';
import NavigationRoutes from '../../business-logic/model/enums/NavigationRoutes';
import UserService from '../../business-logic/services/UserService';
import { useAppDispatch } from '../../business-logic/store/hooks';
import { setCurrentClient } from '../../business-logic/store/slices/userReducer';

import ContentUnavailableView from './ContentUnavailableView';

import styles from '../assets/styles/components/DashboardAdminFlatListStyles';

function DashboardAdminFlatList(): React.JSX.Element {

  const [clients, setClients] = useState<IUser[]>([]);

  const navigation = useNavigation();
  const dispatch = useAppDispatch();

  function navigateToClientDashboard(client: IUser) {
    dispatch(setCurrentClient(client));
    navigation.navigate(NavigationRoutes.ClientDashboardScreenFromAdmin)
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
    );
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