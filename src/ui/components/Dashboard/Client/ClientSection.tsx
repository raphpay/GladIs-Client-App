import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Text,
  View
} from 'react-native';
import IUser from '../../../../business-logic/model/IUser';
import NavigationRoutes from '../../../../business-logic/model/enums/NavigationRoutes';
import { useAppDispatch } from '../../../../business-logic/store/hooks';
import { setCurrentClient } from '../../../../business-logic/store/slices/userReducer';
import styles from '../../../assets/styles/components/DashboardAdminGridStyles';
import ContentUnavailableView from '../../ContentUnavailableView';
import Grid from '../../Grid';
import GridClientItem from '../../GridClientItem';

type ClientSectionProps = {
  clientsFiltered: IUser[];
};

function ClientSection(props: ClientSectionProps): React.JSX.Element {

  const { clientsFiltered } = props;

  const clipboardIcon = require('../../../assets/images/list.clipboard.png');
  
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const navigation = useNavigation();

  // Sync Methods
  function navigateToClientDashboard(client: IUser) {
    dispatch(setCurrentClient(client));
    navigation.navigate(NavigationRoutes.ClientDashboardScreenFromAdmin)
  }

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
            scrollEnabled={false}
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

export default ClientSection;
