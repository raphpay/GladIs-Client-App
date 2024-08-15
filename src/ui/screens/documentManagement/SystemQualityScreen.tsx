import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Text,
  TouchableOpacity,
  View
} from 'react-native';

import { IRootStackParams } from '../../../navigation/Routes';

import SMQManager from '../../../business-logic/manager/SMQManager';
import IAction from '../../../business-logic/model/IAction';
import NavigationRoutes from '../../../business-logic/model/enums/NavigationRoutes';
import UserType from '../../../business-logic/model/enums/UserType';
import UserServiceRead from '../../../business-logic/services/UserService.read';
import { useAppDispatch, useAppSelector } from '../../../business-logic/store/hooks';
import { setDocumentListCount } from '../../../business-logic/store/slices/appStateReducer';
import { setSMQScreenSource } from '../../../business-logic/store/slices/smqReducer';
import { RootState } from '../../../business-logic/store/store';

import AppContainer from '../../components/AppContainer/AppContainer';
import ContentUnavailableView from '../../components/ContentUnavailableView';
import Dialog from '../../components/Dialogs/Dialog';
import Grid from '../../components/Grid/Grid';
import GladisTextInput from '../../components/TextInputs/GladisTextInput';

import styles from '../../assets/styles/documentManagement/SystemQualityScreenStyles';
import IconButton from '../../components/Buttons/IconButton';

interface ISystemQualityItem {
  id: string,
  title: string,
  number?: number,
}

type SystemQualityScreenProps = NativeStackScreenProps<IRootStackParams, NavigationRoutes.SystemQualityScreen>;

function SystemQualityScreen(props: SystemQualityScreenProps): React.JSX.Element {
  const [searchText, setSearchText] = useState<string>('');
  const [showDialog, setShowDialog] = useState<boolean>(false);
  const [processNewName, setProcessNewName] = useState<string>('');
  const clipboardIcon = require('../../assets/images/list.clipboard.png');
  const plusIcon = require('../../assets/images/plus.png');
  
  const { t } = useTranslation();
  
  const { navigation } = props;

  const { isAdmin, currentUser, currentClient } = useAppSelector((state: RootState) => state.users);
  const { token } = useAppSelector((state: RootState) => state.tokens);
  const { documentListCount } = useAppSelector((state: RootState) => state.appState);
  const dispatch = useAppDispatch();

  const systemQualityItems: ISystemQualityItem[] = [
    {
      id: 'qualityManualID',
      title: t('systemQuality.qualityManual'),
    },
    {
      id: 'processus1ID',
      title: `${t('process.title.single')} 1`,
      number: 1,
    },
    {
      id: 'processus2ID',
      title: `${t('process.title.single')} 2`,
      number: 2,
    },
    {
      id: 'processus3ID',
      title: `${t('process.title.single')} 3`,
      number: 3,
    },
    {
      id: 'processus4ID',
      title: `${t('process.title.single')} 4`,
      number: 4,
    },
    {
      id: 'processus5ID',
      title: `${t('process.title.single')} 5`,
      number: 5,
    },
    {
      id: 'processus6ID',
      title: `${t('process.title.single')} 6`,
      number: 6,
    },
    {
      id: 'processus7ID',
      title: `${t('process.title.single')} 7`,
      number: 7,
    },
  ];
  const systemQualityItemsFiltered = systemQualityItems.filter(systemQualityItem =>
    systemQualityItem.title.toLowerCase().includes(searchText.toLowerCase()),
  );

  const navigationHistoryItems: IAction[] = [
    {
      title: t('dashboard.title'),
      onPress: () => navigateToDashboard(),
    },
    {
      title: t('documentManagement.title'),
      onPress: () => navigateBack(),
    },
  ];

  // Sync Methods
  function navigateBack() {
    navigation.goBack();
  }

  function navigateToDashboard() {
    navigation.navigate(isAdmin ? NavigationRoutes.ClientDashboardScreenFromAdmin : NavigationRoutes.DashboardScreen);
  }

  function navigateTo(item: ISystemQualityItem) {
    if (item.id === 'qualityManualID') {
      dispatch(setDocumentListCount(documentListCount + 1));
      navigation.navigate(NavigationRoutes.DocumentsScreen, {
        previousScreen: t('systemQuality.title'),
        currentScreen: t('systemQuality.qualityManual'),
        documentsPath: 'systemQuality/qualityManual',
        processNumber: undefined,
      });
    } else {
      navigation.navigate(NavigationRoutes.ProcessesScreen, { processNumber: item.number ?? 1})
    }
  }

  function displayModificationProcessDialog(item: ISystemQualityItem) {
    if (currentUser?.userType === UserType.Admin) {
      setShowDialog(true);
      setProcessNewName(item.title);
    }
  }
  
  // Async Methods
  async function navigateToSMQGeneral() {
    dispatch(setSMQScreenSource(NavigationRoutes.SystemQualityScreen));
    SMQManager.getInstance().setClientID(currentClient?.id as string);
    navigation.navigate(NavigationRoutes.SMQSurveyStack);
  }

  async function saveProcessName() {}

  // Lifecycle Methods
  useEffect(() => {
    async function init() {
      try {
        const userID = currentUser?.id as string;
        const processes = await UserServiceRead.getSystemQualityFolders(userID, token);
        console.log('Processes:', processes);
      } catch (error) {
        console.log('Error getting system quality folders:', error);
      }
    }
    init();
  }, []);

  // Components
  function SystemQualityGridItem(item: ISystemQualityItem) {
    return (
      <TouchableOpacity
        key={item.id}
        onPress={() => navigateTo(item)}
        onLongPress={() => displayModificationProcessDialog(item)}
        >
        <View style={styles.processusContainer}>
          <Text style={styles.categoryTitle}>{item.title}</Text>
        </View>
      </TouchableOpacity>
    )
  }

  function CreateSMQDocButton() {
    return (
      <>
        {
          currentUser?.userType !== UserType.Employee && (
            <IconButton 
              title={t('systemQuality.createSMQDoc.button')}
              onPress={navigateToSMQGeneral}
              icon={plusIcon}
            />
          )
        }
      </>
    );
  }

  function ModifyProcessNameDialog() {
    return (
      <>{
        showDialog && (
          <Dialog
            title='Modify Process Name'
            description='Enter the new name for the process'
            confirmTitle='Save'
            cancelTitle='Cancel'
            isConfirmAvailable={true}
            isCancelAvailable={true}
            onConfirm={() => console.log('Save')}
            onCancel={() => console.log('Cancel')}
          >
            <GladisTextInput
              value={processNewName}
              onValueChange={setProcessNewName}
              placeholder='New Process Name'
              autoCapitalize='words'
            />
          </Dialog>
        )
      }
      </>
    )
  }

  return (
    <>
      <AppContainer
        mainTitle={t('systemQuality.title')}
        navigationHistoryItems={navigationHistoryItems}
        searchText={searchText}
        setSearchText={setSearchText}
        showBackButton={true}
        showSearchText={true}
        showSettings={true}
        navigateBack={navigateBack}
        adminButton={CreateSMQDocButton()}
      >
        {
          systemQualityItemsFiltered && systemQualityItemsFiltered.length === 0 ? (
            <ContentUnavailableView
              title={t('systemQuality.noItems.title')}
              message={t('systemQuality.noItems.message')}
              image={clipboardIcon}
            />
          ) : (
            <Grid
              data={systemQualityItemsFiltered}
              renderItem={({ item }) => SystemQualityGridItem(item)}
            />
          )
        }
      </AppContainer>
      {ModifyProcessNameDialog()}
    </>
  );
}

export default SystemQualityScreen;