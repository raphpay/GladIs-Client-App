import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { IRootStackParams } from '../../../navigation/Routes';

import INavigationHistoryItem from '../../../business-logic/model/INavigationHistoryItem';
import NavigationRoutes from '../../../business-logic/model/enums/NavigationRoutes';

import AppContainer from '../../components/AppContainer';
import DashboardClientFlatList from '../../components/DashboardClientFlatList';
import ErrorDialog from '../../components/ErrorDialog';

type ClientDashboardScreenFromAdminProps = NativeStackScreenProps<IRootStackParams, NavigationRoutes.ClientDashboardScreenFromAdmin>;

function ClientDashboardScreenFromAdmin(props: ClientDashboardScreenFromAdminProps): any {
  const [searchText,setSearchText] = useState<string>('');
  const [showDialog, setShowDialog] = useState<boolean>(false);
  const { navigation } = props;
  const { t } = useTranslation();
  const navigationHistoryItems: INavigationHistoryItem[] = [
    {
      title: t('dashboard.adminTitle'),
      action: () => navigateBack()
    }
  ]

  function navigateBack() {
    navigation.goBack();
  }

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
        dialogIsShown={showDialog}
        showSettings={true}
      >
        <DashboardClientFlatList searchText={searchText} setShowDialog={setShowDialog} />
      </AppContainer>
      {
        showDialog && (
          <ErrorDialog
            title={t('errors.modules.title')}
            description={t('errors.modules.description')}
            cancelTitle={t('errors.modules.cancelButton')}
            onCancel={() => setShowDialog(false)}
          />
        )
      }
    </>
  )
}

export default ClientDashboardScreenFromAdmin;