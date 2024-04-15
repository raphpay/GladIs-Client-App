import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';

import IUser from '../../../business-logic/model/IUser';
import UserService from '../../../business-logic/services/UserService';
import { useAppSelector } from '../../../business-logic/store/hooks';
import { RootState } from '../../../business-logic/store/store';

import AppContainer from '../../components/AppContainer/AppContainer';
import Grid from '../../components/Grid/Grid';
import Tooltip from '../../components/Tooltip';

import styles from '../../assets/styles/settings/AdminUserManagementScreenStyles';

function AdminUserManagementScreen(): React.JSX.Element {

  // TODO: Filter admins for search
  const [admins, setAdmins] = useState<IUser[]>([]);

  const { token } = useAppSelector((state: RootState) => state.tokens);

  const { t } = useTranslation();

  // Async Methods
  async function loadAdmins() {
    try {
      const apiAdmins = await UserService.getInstance().getAdmins(token);
      setAdmins(apiAdmins);
    } catch (error) {
      // Display toast
    }
  }

  // Lyfecycle Methods
  useEffect(() => {
    async function init() {
      await loadAdmins();
    }
    init();
  }, []);

  function AdminRow(item: IUser) {
    return (
      <View style={styles.lineContainer}>
        <View style={styles.lineRow}>
          <View style={styles.button}>
            <View style={styles.textContainer}>
              <Text style={styles.text}>
                {item.firstName} {item.lastName}
              </Text>
            </View>
          </View>
          <Tooltip action={() => {}} />
        </View>
        <View style={styles.separator}/>
      </View>
    );
  }

  // Components
  return (
    <AppContainer
      mainTitle={t('settings.adminUserManagement.title')}
      showSearchText={true}
      showSettings={false}
    >
      <Grid
        data={admins}
        renderItem={(renderItem) => AdminRow(renderItem.item)}
      />
    </AppContainer>
  );
}

export default AdminUserManagementScreen;
