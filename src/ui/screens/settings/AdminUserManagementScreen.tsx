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
import Toast from '../../components/Toast';

function AdminUserManagementScreen(): React.JSX.Element {

  // TODO: Filter admins for search
  const [admins, setAdmins] = useState<IUser[]>([]);
  // Toast
  const [showToast, setShowToast] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string>('');
  const [toastIsShowingError, setToastIsShowingError] = useState<boolean>(false);

  const { token } = useAppSelector((state: RootState) => state.tokens);

  const { t } = useTranslation();

  // Sync Methods
  function displayToast(message: string, isError: boolean = false) {
    setShowToast(true);
    setToastIsShowingError(isError);
    setToastMessage(message);
  }

  // Async Methods
  async function loadAdmins() {
    try {
      const apiAdmins = await UserService.getInstance().getAdmins(token);
      setAdmins(apiAdmins);
    } catch (error) {
      const errorMessage = (error as Error).message;
      displayToast(errorMessage, true);
    }
  }

  // Lyfecycle Methods
  useEffect(() => {
    async function init() {
      await loadAdmins();
    }
    init();
  }, []);

  // Components
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

  function ToastContent() {
    return (
      <>
        {
          showToast && (
            <Toast
              message={toastMessage}
              isVisible={showToast}
              setIsVisible={setShowToast}
              isShowingError={toastIsShowingError}
            />
          )
        }
      </>
    )
  }

  return (
    <>
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
      {ToastContent()}
    </>
  );
}

export default AdminUserManagementScreen;
