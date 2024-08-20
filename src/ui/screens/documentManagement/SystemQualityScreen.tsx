import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Dimensions,
  Platform,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

import { IRootStackParams } from '../../../navigation/Routes';

import SMQManager from '../../../business-logic/manager/SMQManager';
import IAction from '../../../business-logic/model/IAction';
import IProcessus, { Folder, IProcessusInput, IProcessusUpdateInput } from '../../../business-logic/model/IProcessus';
import NavigationRoutes from '../../../business-logic/model/enums/NavigationRoutes';
import PlatformName, { Orientation } from '../../../business-logic/model/enums/PlatformName';
import UserType from '../../../business-logic/model/enums/UserType';
import ProcessusService from '../../../business-logic/services/ProcessusService';
import UserServiceRead from '../../../business-logic/services/UserService.read';
import { useAppDispatch, useAppSelector } from '../../../business-logic/store/hooks';
import { setDocumentListCount } from '../../../business-logic/store/slices/appStateReducer';
import { setSMQScreenSource } from '../../../business-logic/store/slices/smqReducer';
import { RootState } from '../../../business-logic/store/store';

import AppContainer from '../../components/AppContainer/AppContainer';
import IconButton from '../../components/Buttons/IconButton';
import ContentUnavailableView from '../../components/ContentUnavailableView';
import Dialog from '../../components/Dialogs/Dialog';
import Grid from '../../components/Grid/Grid';
import GladisTextInput from '../../components/TextInputs/GladisTextInput';

import styles from '../../assets/styles/documentManagement/SystemQualityScreenStyles';

type SystemQualityScreenProps = NativeStackScreenProps<IRootStackParams, NavigationRoutes.SystemQualityScreen>;

function SystemQualityScreen(props: SystemQualityScreenProps): React.JSX.Element {
  const [searchText, setSearchText] = useState<string>('');
  const [showDialog, setShowDialog] = useState<boolean>(false);
  const [processNewName, setProcessNewName] = useState<string>('');
  const [processNumber, setProcessNumber] = useState<number>(0);
  const [processID, setProcessID] = useState<string>('');
  const [orientation, setOrientation] = useState<string>(Orientation.Landscape);
  const [showCreateFolderDialog, setShowCreateFolderDialog] = useState<boolean>(false);

  const clipboardIcon = require('../../assets/images/list.clipboard.png');
  const plusIcon = require('../../assets/images/plus.png');
  
  const { t } = useTranslation();
  
  const { navigation } = props;

  const { isAdmin, currentUser, currentClient } = useAppSelector((state: RootState) => state.users);
  const { token } = useAppSelector((state: RootState) => state.tokens);
  const { documentListCount } = useAppSelector((state: RootState) => state.appState);
  const dispatch = useAppDispatch();

  const [processusItems, setProcessusItems] = useState<IProcessus[]>([
    {
      id: 'qualityManualID',
      title: t('systemQuality.qualityManual'),
      number: 0,
      folder: Folder.SystemQuality,
      userID: { id: currentUser?.id as string },
    },
    {
      id: 'processus1ID',
      title: `${t('process.title.single')} 1`,
      number: 1,
      folder: Folder.SystemQuality,
      userID: { id: currentUser?.id as string },
    },
    {
      id: 'processus2ID',
      title: `${t('process.title.single')} 2`,
      number: 2,
      folder: Folder.SystemQuality,
      userID: { id: currentUser?.id as string },
    },
    {
      id: 'processus3ID',
      title: `${t('process.title.single')} 3`,
      number: 3,
      folder: Folder.SystemQuality,
      userID: { id: currentUser?.id as string },
    },
    {
      id: 'processus4ID',
      title: `${t('process.title.single')} 4`,
      number: 4,
      folder: Folder.SystemQuality,
      userID: { id: currentUser?.id as string },
    },
    {
      id: 'processus5ID',
      title: `${t('process.title.single')} 5`,
      number: 5,
      folder: Folder.SystemQuality,
      userID: { id: currentUser?.id as string },
    },
    {
      id: 'processus6ID',
      title: `${t('process.title.single')} 6`,
      number: 6,
      folder: Folder.SystemQuality,
      userID: { id: currentUser?.id as string },
    },
    {
      id: 'processus7ID',
      title: `${t('process.title.single')} 7`,
      number: 7,
      folder: Folder.SystemQuality,
      userID: { id: currentUser?.id as string },
    }
  ]);

  const processusItemsFiltered = processusItems.filter(processusItem =>
    processusItem.title.toLowerCase().includes(searchText.toLowerCase()),
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

  function navigateTo(item: IProcessus) {
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

  function displayModificationProcessDialog(item: IProcessus) {
    if (currentUser?.userType === UserType.Admin) {
      setShowDialog(true);
      setProcessNewName(item.title);
      setProcessNumber(item.number ?? 1);
      setProcessID(item.id as string);
    }
  }

  function determineAndSetOrientation() {
    let width = Dimensions.get('window').width;
    let height = Dimensions.get('window').height;

    if (width < height) {
      setOrientation(Orientation.Portrait);
    } else {
      setOrientation(Orientation.Landscape);
    }
  }
  
  // Async Methods
  async function navigateToSMQGeneral() {
    dispatch(setSMQScreenSource(NavigationRoutes.SystemQualityScreen));
    SMQManager.getInstance().setClientID(currentClient?.id as string);
    navigation.navigate(NavigationRoutes.SMQSurveyStack);
  }

  async function createProcessus() {
    if (processNewName) {
      // TODO: Let the admin choose the placement of the processus
      setProcessNumber(processusItems.length + 1);
      try {
        const input: IProcessusInput = {
          title: processNewName,
          number: processNumber,
          folder: Folder.SystemQuality,
          userID: currentUser?.id as string,
        };
        const processus = await ProcessusService.getInstance().create(input, token);
        setProcessusItems(prevItems => {
          const newItems = [...prevItems, processus];
          return newItems.sort((a, b) => a.number - b.number);
        });
        setShowCreateFolderDialog(false);
      } catch (error) {
        console.log('error', error);
      }
    }
  }

  async function modifyProcessName() {
    try {
      const updateInput: IProcessusUpdateInput = {
        title: processNewName,
        number: processNumber,
      };
      const updatedProcessus = await ProcessusService.getInstance().update(updateInput, processID, token);
      setProcessusItems(prevItems =>
        prevItems.map(item =>
          item.number === updatedProcessus.number ? { ...item, title: updatedProcessus.title } : item
        )
      );
      setShowDialog(false);
    } catch (error) { }
  }

  async function createInitialProcessus() {
    for (const process of processusItems) {
      try {
        const processNumber = process.number as number;
        const currentUserID = currentUser?.id as string;
        const processus: IProcessusInput = {
          title: process.title,
          number: processNumber,
          folder: Folder.SystemQuality,
          userID: currentUserID
        };
        await ProcessusService.getInstance().create(processus, token);
      } catch (error) {
        console.log('error', error);
      }
    }
  }

  async function deleteProcessus() {
    try {
      await ProcessusService.getInstance().delete(processID, token);
      setProcessusItems(prevItems => prevItems.filter(item => item.id !== processID));
      setShowDialog(false);
      // TODO: Display toast
    } catch (error) {
      console.log('error', error);
    }
  }

  // Lifecycle Methods
  useEffect(() => {
    async function init() {
      try {
        const userID = currentUser?.id as string;
        const processus = await UserServiceRead.getSystemQualityFolders(userID, token);
        if (processus.length === 0) {
          await createInitialProcessus();
        } else {
          setProcessusItems(processus);
        }
      } catch (error) {
        console.log('Error getting system quality folders:', error);
      }
    }
    init();
  }, []);

  useEffect(() => {
    determineAndSetOrientation();
    Dimensions.addEventListener('change', determineAndSetOrientation);
    return () => {}
  }, []);

  // Components
  function ProcessusGridItem(item: IProcessus) {
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

  function ModifyProcessNameDialog() {
    return (
      <>{
        showDialog && (
          <Dialog
            title={t('systemQuality.modifyProcess.title')}
            description={t('systemQuality.modifyProcess.description')}
            confirmTitle={t('components.buttons.save')}
            cancelTitle={t('components.cancel')}
            extraConfirmButtonTitle={t('components.buttons.delete')}
            isConfirmAvailable={true}
            isCancelAvailable={true}
            onConfirm={() => modifyProcessName()}
            onCancel={() => setShowDialog(false)}
            extraConfirmButtonAction={() => deleteProcessus()}
          >
            <GladisTextInput
              value={processNewName}
              onValueChange={setProcessNewName}
              placeholder={t('systemQuality.modifyProcess.placeholder')}
              autoCapitalize='words'
            />
          </Dialog>
        )
      }
      </>
    )
  }

  function CreateFolderDialog() {
    return (
      <>{
        showCreateFolderDialog && (
          <Dialog
            title={t('systemQuality.create.title')}
            description={t('systemQuality.create.description')}
            confirmTitle={t('systemQuality.create.confirm')}
            cancelTitle={t('components.dialog.cancel')}
            isConfirmAvailable={true}
            isCancelAvailable={true}
            onConfirm={createProcessus}
            onCancel={() => setShowCreateFolderDialog(false)}
          >
            <GladisTextInput
              value={processNewName}
              onValueChange={setProcessNewName}
              placeholder={t('systemQuality.create.placeholder')}
              autoCapitalize='words'
            />
          </Dialog>
        )
      }
      </>
    )
  }

  function AdminButtons() {
    const shouldHaveColumn = (
        Platform.OS === PlatformName.Android ||
        Platform.OS === PlatformName.IOS
      ) && orientation === Orientation.Portrait;
    
    return (
      <View style={{ flexDirection: shouldHaveColumn ? 'column' : 'row' }}>
        {
          currentUser?.userType !== UserType.Employee && (
            <IconButton 
              title={t('systemQuality.createSMQDoc.button')}
              onPress={navigateToSMQGeneral}
              icon={plusIcon}
              style={styles.adminButton}
            />
          )
        }
        {
          currentUser?.userType === UserType.Admin && (
            <IconButton 
              title={t('systemQuality.createFolder.button')}
              onPress={() => setShowCreateFolderDialog(true)}
              icon={plusIcon}
              style={styles.adminButton}
            />
          )
        }
      </View>
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
        adminButton={AdminButtons()}
      >
        {
          processusItemsFiltered && processusItemsFiltered.length === 0 ? (
            <ContentUnavailableView
              title={t('systemQuality.noItems.title')}
              message={t('systemQuality.noItems.message')}
              image={clipboardIcon}
            />
          ) : (
            <Grid
              data={processusItemsFiltered}
              renderItem={({ item }) => ProcessusGridItem(item)}
            />
          )
        }
      </AppContainer>
      {ModifyProcessNameDialog()}
      {CreateFolderDialog()}
    </>
  );
}

export default SystemQualityScreen;