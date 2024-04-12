import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { IRootStackParams } from '../../../navigation/Routes';

import IAction from '../../../business-logic/model/IAction';
import NavigationRoutes from '../../../business-logic/model/enums/NavigationRoutes';
import { useAppDispatch } from '../../../business-logic/store/hooks';
import { removeCurrentClient } from '../../../business-logic/store/slices/userReducer';

import AppContainer from '../../components/AppContainer/AppContainer';
import DashboardClientGrid from '../../components/Dashboard/DashboardClientGrid';
import ErrorDialog from '../../components/ErrorDialog';

type ClientDashboardScreenFromAdminProps = NativeStackScreenProps<IRootStackParams, NavigationRoutes.ClientDashboardScreenFromAdmin>;

function ClientDashboardScreenFromAdmin(props: ClientDashboardScreenFromAdminProps): any {
  const [searchText,setSearchText] = useState<string>('');
  const [showErrorDialog, setShowErrorDialog] = useState<boolean>(false);
  const { navigation } = props;

  const { t } = useTranslation();

  const dispatch = useAppDispatch();

  const navigationHistoryItems: IAction[] = [
    {
      title: t('dashboard.adminTitle'),
      onPress: () => navigateBack()
    }
  ]

  // Sync Methods
  function navigateBack() {
    dispatch(removeCurrentClient());
    navigation.goBack();
  }

  // Components
  return (
    <>
      <AppContainer
        mainTitle={t('dashboard.title')}
        navigationHistoryItems={navigationHistoryItems}
        searchText={searchText}
        setSearchText={setSearchText}
        showBackButton={true}
        showSearchText={true}
        navigateBack={navigateBack}
        dialogIsShown={showErrorDialog}
        showSettings={true}
      >
        <DashboardClientGrid searchText={searchText} setShowErrorDialog={setShowErrorDialog} />
      </AppContainer>
      {
        showErrorDialog && (
          <ErrorDialog
            title={t('errors.modules.title')}
            description={t('errors.modules.description')}
            cancelTitle={t('errors.modules.cancelButton')}
            onCancel={() => setShowErrorDialog(false)}
          />
        )
      }
    </>
  )
}

export default ClientDashboardScreenFromAdmin;