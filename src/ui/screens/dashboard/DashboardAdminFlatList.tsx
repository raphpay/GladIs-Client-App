import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

import IUser from '../../../business-logic/model/IUser';
import UserService from '../../../business-logic/services/UserService';
import { Colors } from '../../assets/colors/colors';

function DashboardAdminFlatList(): React.JSX.Element {

  const [clients, setClients] = useState<IUser[]>([]);

  function navigateToClientDashboard(client: IUser) {
    //
  }

  const { t } = useTranslation();

  function FlatListClientItem(client: IUser) {
    return (
      <TouchableOpacity onPress={() => navigateToClientDashboard(client)} style={styles.clientContainer}>
        <Text>{client.username}</Text>
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
        <View style={styles.emptyViewContainer}>
          <Text>No clients</Text>
        </View>
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

const styles = StyleSheet.create({
  emptyViewContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'red'
  },
  clientContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 75,
    width: 190,
    borderRadius: 10,
    backgroundColor: Colors.inactive,
    margin: 8
  },
});

export default DashboardAdminFlatList;