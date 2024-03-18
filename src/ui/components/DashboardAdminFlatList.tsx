import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import IUser from '../../business-logic/model/IUser';
import NavigationRoutes from '../../business-logic/model/enums/NavigationRoutes';
import UserService from '../../business-logic/services/UserService';
import { useAppDispatch, useAppSelector } from '../../business-logic/store/hooks';
import { setCurrentClient } from '../../business-logic/store/slices/userReducer';
import { RootState } from '../../business-logic/store/store';

import ContentUnavailableView from './ContentUnavailableView';
import Grid from './Grid';
import GridClientItem from './GridClientItem';

type DashboardAdminGridProps = {
  searchText: string;
};

function DashboardAdminGrid(props: DashboardAdminGridProps): React.JSX.Element {
  const { searchText } = props;

  const clipboardIcon = require('../assets/images/list.clipboard.png');

  const [clients, setClients] = useState<IUser[]>([]);

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

  useEffect(() => {
    async function init() {
      loadClients();
    }
    init();
  }, []);

  useEffect(() => {
    async function init() {
      loadClients();
    }
    init();
  }, [clientListCount]);

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
        </>
  );
}

export default DashboardAdminGrid;