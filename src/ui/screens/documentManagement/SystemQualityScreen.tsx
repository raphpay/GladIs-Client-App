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
import IFolder, { IFolderInput, IFolderMultipleInput, IFolderUpdateInput, Sleeve } from '../../../business-logic/model/IFolder';
import NavigationRoutes from '../../../business-logic/model/enums/NavigationRoutes';
import PlatformName, { Orientation } from '../../../business-logic/model/enums/PlatformName';
import UserType from '../../../business-logic/model/enums/UserType';
import FolderService from '../../../business-logic/services/FolderService';
import UserServiceGet from '../../../business-logic/services/UserService/UserService.get';
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
import Toast from '../../components/Toast';

type SystemQualityScreenProps = NativeStackScreenProps<IRootStackParams, NavigationRoutes.SystemQualityScreen>;

function SystemQualityScreen(props: SystemQualityScreenProps): React.JSX.Element {
  // General
  const [searchText, setSearchText] = useState<string>('');
  const [orientation, setOrientation] = useState<string>(Orientation.Landscape);
  // Dialogs
  const [showDialog, setShowDialog] = useState<boolean>(false);
  const [showCreateFolderDialog, setShowCreateFolderDialog] = useState<boolean>(false);
  // Folder
  const [folderNewName, setFolderNewName] = useState<string>('');
  const [folderNumber, setFolderNumber] = useState<number>(0);
  const [folderID, setFolderID] = useState<string>('');
  // Toast
  const [showToast, setShowToast] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string>('');
  const [toastIsShowingError, setToastIsShowingError] = useState<boolean>(false);

  const clipboardIcon = require('../../assets/images/list.clipboard.png');
  const plusIcon = require('../../assets/images/plus.png');
  
  const { t } = useTranslation();
  
  const { navigation } = props;

  const { isAdmin, currentUser, currentClient } = useAppSelector((state: RootState) => state.users);
  const { token } = useAppSelector((state: RootState) => state.tokens);
  const { documentListCount } = useAppSelector((state: RootState) => state.appState);
  const dispatch = useAppDispatch();

  const baseFolderItems: IFolder[] = [
    {
      id: 'qualityManualID',
      title: t('systemQuality.qualityManual'),
      number: 0,
      sleeve: Sleeve.SystemQuality,
      userID: currentClient?.id as string,
    },
    {
      id: 'folder1ID',
      title: `${t('folder.title.single')} 1`,
      number: 1,
      sleeve: Sleeve.SystemQuality,
      userID: currentClient?.id as string,
    },
    {
      id: 'folder2ID',
      title: `${t('folder.title.single')} 2`,
      number: 2,
      sleeve: Sleeve.SystemQuality,
      userID: currentClient?.id as string,
    },
    {
      id: 'folder3ID',
      title: `${t('folder.title.single')} 3`,
      number: 3,
      sleeve: Sleeve.SystemQuality,
      userID: currentClient?.id as string,
    },
    {
      id: 'folder4ID',
      title: `${t('folder.title.single')} 4`,
      number: 4,
      sleeve: Sleeve.SystemQuality,
      userID: currentClient?.id as string,
    },
    {
      id: 'folder5ID',
      title: `${t('folder.title.single')} 5`,
      number: 5,
      sleeve: Sleeve.SystemQuality,
      userID: currentClient?.id as string,
    },
    {
      id: 'folder6ID',
      title: `${t('folder.title.single')} 6`,
      number: 6,
      sleeve: Sleeve.SystemQuality,
      userID: currentClient?.id as string,
    },
    {
      id: 'folder7ID',
      title: `${t('folder.title.single')} 7`,
      number: 7,
      sleeve: Sleeve.SystemQuality,
      userID: currentClient?.id as string,
    }
  ];
  const [folderItems, setFolderItems] = useState<IFolder[]>([]);

  const folderItemsFiltered = folderItems.filter(folderItem =>
    folderItem.title.toLowerCase().includes(searchText.toLowerCase()),
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

  function navigateTo(item: IFolder) {
    if (item.id === 'qualityManualID') {
      dispatch(setDocumentListCount(documentListCount + 1));
      navigation.navigate(NavigationRoutes.DocumentsScreen, {
        previousScreen: t('systemQuality.title'),
        currentScreen: t('systemQuality.qualityManual'),
        documentsPath: 'systemQuality/qualityManual',
        folderNumber: undefined,
      });
    } else {
      navigation.navigate(NavigationRoutes.ProcessesScreen, { currentFolder: item})
    }
  }

  function displayModificationFolderDialog(item: IFolder) {
    if (currentUser?.userType === UserType.Admin) {
      setShowDialog(true);
      setFolderNewName(item.title);
      setFolderNumber(item.number ?? 1);
      setFolderID(item.id as string);
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

  function displayToast(message: string, isError: boolean = false) {
    setShowToast(true);
    setToastIsShowingError(isError);
    setToastMessage(message);
  }

  function closeDialogs() {
    setShowCreateFolderDialog(false);
    setShowDialog(false);
    setFolderNewName('');
  }
  
  // Async Methods
  async function navigateToSMQGeneral() {
    dispatch(setSMQScreenSource(NavigationRoutes.SystemQualityScreen));
    SMQManager.getInstance().setClientID(currentClient?.id as string);
    navigation.navigate(NavigationRoutes.SMQSurveyStack);
  }

  async function createFolder() {
    if (folderNewName) {
      // TODO: Let the admin choose the placement of the folder
      setFolderNumber(1);
      try {
        const input: IFolderInput = {
          title: folderNewName,
          number: folderNumber,
          sleeve: Sleeve.SystemQuality,
          userID: currentClient?.id as string,
        };
        const folder = await FolderService.getInstance().create(input, token);
        setFolderItems(prevItems => {
          const newItems = [...prevItems, folder];
          return newItems.sort((a, b) => a.number - b.number);
        });
        closeDialogs();
        displayToast(t('systemQuality.create.success'));
      } catch (error) {
        const errorMessage = (error as Error).message;
        displayToast(t(`errors.api.${errorMessage}`), true);
      }
    }
  }

  async function modifyFolderName() {
    try {
      const updateInput: IFolderUpdateInput = {
        title: folderNewName,
        number: folderNumber,
      };
      const updatedFolder = await FolderService.getInstance().update(updateInput, folderID, token);
      setFolderItems(prevItems =>
        prevItems.map(item =>
          item.number === updatedFolder.number ? { ...item, title: updatedFolder.title } : item
        )
      );
      closeDialogs();
      displayToast(t('systemQuality.modifyFolder.success'));
    } catch (error) {
      const errorMessage = (error as Error).message;
      displayToast(t(`errors.api.${errorMessage}`), true);
    }
  }

  async function createInitialFolder() {
    setFolderItems(baseFolderItems);
    try {
      const input: IFolderMultipleInput = {
        inputs: baseFolderItems,
        userID: currentClient?.id as string,
      };
      await FolderService.getInstance().createMultiple(input, token);
    } catch (error) {
      const errorMessage = (error as Error).message;
      displayToast(t(`errors.api.${errorMessage}`), true);
    }
  }

  async function deleteFolder() {
    try {
      await FolderService.getInstance().delete(folderID, token);
      setFolderItems(prevItems => prevItems.filter(item => item.id !== folderID));
      closeDialogs();
      displayToast(t('systemQuality.delete.success'));
    } catch (error) {
      const errorMessage = (error as Error).message;
      displayToast(t(`errors.api.${errorMessage}`), true);
    }
  }

  // Lifecycle Methods
  useEffect(() => {
    async function init() {
      try {
        const userID = currentClient?.id as string;
        const folder = await UserServiceGet.getSystemQualityFolders(userID, token);
        if (folder.length === 0) {
          await createInitialFolder();
        } else {
          setFolderItems(folder);
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
  function FolderGridItem(item: IFolder) {
    return (
      <TouchableOpacity
        key={item.id}
        onPress={() => navigateTo(item)}
        onLongPress={() => displayModificationFolderDialog(item)}
        >
        <View style={styles.folderContainer}>
          <Text style={styles.categoryTitle}>{item.title}</Text>
        </View>
      </TouchableOpacity>
    )
  }

  function ModifyFolderNameDialog() {
    return (
      <>{
        showDialog && (
          <Dialog
            title={t('systemQuality.modifyFolder.title')}
            description={t('systemQuality.modifyFolder.description')}
            confirmTitle={t('components.buttons.save')}
            cancelTitle={t('components.dialog.cancel')}
            extraConfirmButtonTitle={t('components.buttons.delete')}
            isConfirmAvailable={true}
            isCancelAvailable={true}
            onConfirm={modifyFolderName}
            onCancel={closeDialogs}
            extraConfirmButtonAction={deleteFolder}
          >
            <GladisTextInput
              value={folderNewName}
              onValueChange={setFolderNewName}
              placeholder={t('systemQuality.modifyFolder.placeholder')}
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
            onConfirm={createFolder}
            onCancel={closeDialogs}
          >
            <GladisTextInput
              value={folderNewName}
              onValueChange={setFolderNewName}
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
              title={t('systemQuality.create.button')}
              onPress={() => setShowCreateFolderDialog(true)}
              icon={plusIcon}
              style={styles.adminButton}
            />
          )
        }
      </View>
    )
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
          folderItemsFiltered && folderItemsFiltered.length === 0 ? (
            <ContentUnavailableView
              title={t('systemQuality.noItems.title')}
              message={t('systemQuality.noItems.message')}
              image={clipboardIcon}
            />
          ) : (
            <Grid
              data={folderItemsFiltered}
              renderItem={({ item }) => FolderGridItem(item)}
            />
          )
        }
      </AppContainer>
      {ModifyFolderNameDialog()}
      {CreateFolderDialog()}
      {ToastContent()}
    </>
  );
}

export default SystemQualityScreen;