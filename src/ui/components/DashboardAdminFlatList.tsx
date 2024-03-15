import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  FlatList
} from 'react-native';

import IUser from '../../business-logic/model/IUser';
import NavigationRoutes from '../../business-logic/model/enums/NavigationRoutes';
import UserService from '../../business-logic/services/UserService';
import { useAppDispatch } from '../../business-logic/store/hooks';
import { setCurrentClient } from '../../business-logic/store/slices/userReducer';

import ContentUnavailableView from './ContentUnavailableView';
import FlatListClientItem from './FlatListClientItem';

type DashboardAdminFlatListProps = {
  searchText: string;
};

function DashboardAdminFlatList(props: DashboardAdminFlatListProps): React.JSX.Element {
  const { searchText } = props;

  const clipboardIcon = require('../assets/images/list.clipboard.png');

  const [clients, setClients] = useState<IUser[]>([]);

  const clientsFiltered = clients.filter(client =>
    client.username?.toLowerCase().includes(searchText?.toLowerCase()),
  );

  const navigation = useNavigation();
  const dispatch = useAppDispatch();

  function navigateToClientDashboard(client: IUser) {
    dispatch(setCurrentClient(client));
    navigation.navigate(NavigationRoutes.ClientDashboardScreenFromAdmin)
  }

  const { t } = useTranslation();

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
      clientsFiltered.length === 0 ? (
        <ContentUnavailableView
          title={t('dashboard.noClients.title')}
          message={t('dashboard.noClients.message')}
          image={clipboardIcon}
        />
      ) : (
            <FlatList
              data={clientsFiltered}
              numColumns={4}
              renderItem={(renderItem) => 
                <FlatListClientItem 
                  client={renderItem.item} 
                  onPress={() => navigateToClientDashboard(renderItem.item)}
                />
              }
              keyExtractor={(item) => item.id}
            />
          )
        }
        </>
  );
}

export default DashboardAdminFlatList;