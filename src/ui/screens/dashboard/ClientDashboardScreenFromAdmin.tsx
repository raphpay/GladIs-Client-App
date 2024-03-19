import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { IRootStackParams } from '../../../navigation/Routes';

import IAction from '../../../business-logic/model/IAction';
import NavigationRoutes from '../../../business-logic/model/enums/NavigationRoutes';
import { useAppDispatch } from '../../../business-logic/store/hooks';
import { removeCurrentClient } from '../../../business-logic/store/slices/userReducer';

import AppContainer from '../../components/AppContainer';
import DashboardClientGrid from '../../components/DashboardClientGrid';
import ErrorDialog from '../../components/ErrorDialog';

type ClientDashboardScreenFromAdminProps = NativeStackScreenProps<IRootStackParams, NavigationRoutes.ClientDashboardScreenFromAdmin>;

function ClientDashboardScreenFromAdmin(props: ClientDashboardScreenFromAdminProps): any {
  const [searchText,setSearchText] = useState<string>('');
  const [showDialog, setShowDialog] = useState<boolean>(false);
  const { navigation } = props;

  const { t } = useTranslation();

  const dispatch = useAppDispatch();

  const navigationHistoryItems: IAction[] = [
    {
      title: t('dashboard.adminTitle'),
      action: () => navigateBack()
    }
  ]

  function navigateBack() {
    dispatch(removeCurrentClient());
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
        <DashboardClientGrid searchText={searchText} setShowDialog={setShowDialog} />
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