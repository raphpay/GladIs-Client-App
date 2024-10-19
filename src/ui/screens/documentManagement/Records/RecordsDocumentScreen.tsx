import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ActivityIndicator,
  NativeModules,
  Text,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
const { FilePickerModule } = NativeModules;

import DocumentLogAction from '../../../../business-logic/model/enums/DocumentLogAction';
import NavigationRoutes from '../../../../business-logic/model/enums/NavigationRoutes';
import { Orientation } from '../../../../business-logic/model/enums/PlatformName';
import UserType from '../../../../business-logic/model/enums/UserType';
import IAction from '../../../../business-logic/model/IAction';
import IDocument from '../../../../business-logic/model/IDocument';
import { IDocumentActivityLogInput } from '../../../../business-logic/model/IDocumentActivityLog';
import IFolder, {
  IFolderInput,
  IFolderUpdateInput,
  IFolderUserRecordInput,
  Sleeve,
} from '../../../../business-logic/model/IFolder';
import CacheService from '../../../../business-logic/services/CacheService';
import DocumentActivityLogsService from '../../../../business-logic/services/DocumentActivityLogsService';
import DocumentServiceDelete from '../../../../business-logic/services/DocumentService/DocumentService.delete';
import DocumentServiceGet from '../../../../business-logic/services/DocumentService/DocumentService.get';
import DocumentServicePost from '../../../../business-logic/services/DocumentService/DocumentService.post';
import FolderService from '../../../../business-logic/services/FolderService';
import UserServicePost from '../../../../business-logic/services/UserService/UserService.post';
import {
  useAppDispatch,
  useAppSelector,
} from '../../../../business-logic/store/hooks';
import { setDocumentListCount } from '../../../../business-logic/store/slices/appStateReducer';
import {
  setIsUpdatingSurvey,
  setSMQScreenSource,
} from '../../../../business-logic/store/slices/smqReducer';
import { RootState } from '../../../../business-logic/store/store';
import Utils from '../../../../business-logic/utils/Utils';

import { IRootStackParams } from '../../../../navigation/Routes';

import AppContainer from '../../../components/AppContainer/AppContainer';
import IconButton from '../../../components/Buttons/IconButton';
import Dialog from '../../../components/Dialogs/Dialog';
import Grid from '../../../components/Grid/Grid';
import Pagination from '../../../components/Pagination';
import GladisTextInput from '../../../components/TextInputs/GladisTextInput';
import Toast from '../../../components/Toast';
import TooltipAction from '../../../components/TooltipAction';
import DocumentGrid from '../DocumentScreen/DocumentGrid';

import { Colors } from '../../../assets/colors/colors';
import styles from '../../../assets/styles/documentManagement/Records/RecordsDocumentScreenStyles';
import RecordsDocumentScreenManager from './RecordsDocumentScreenManager';

type RecordsDocumentScreenProps = NativeStackScreenProps<
  IRootStackParams,
  NavigationRoutes.RecordsDocumentScreen
>;

function RecordsDocumentScreen(
  props: RecordsDocumentScreenProps,
): React.JSX.Element {
  // General
  const [searchText, setSearchText] = useState<string>('');
  const [folders, setFolders] = useState<IFolder[]>([]);
  const [orientation, setOrientation] = useState<string>(Orientation.Landscape);
  // Documents
  const [documents, setDocuments] = useState<IDocument[]>([]);
  const [selectedDocument, setSelectedDocument] = useState<IDocument>();
  const [documentName, setDocumentName] = useState<string>('');
  // Dialog
  const [showAddDocumentDialog, setShowAddDocumentDialog] =
    useState<boolean>(false);
  const [showFolderModificationDialog, setShowFolderModificationDialog] =
    useState<boolean>(false);
  const [showCreateFolderDialog, setShowCreateFolderDialog] =
    useState<boolean>(false);
  const [showDocumentActionDialog, setShowDocumentActionDialog] =
    useState<boolean>(false);
  const [showDeleteConfimationDialog, setShowDeleteConfimationDialog] =
    useState<boolean>(false);
  // Toast
  const [showToast, setShowToast] = useState<boolean>(false);
  const [toastIsShowingError, setToastIsShowingError] =
    useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string>('');
  // Pagination
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  // Folders
  const [folderNewName, setFolderNewName] = useState<string>('');
  const [folderNumber, setFolderNumber] = useState<number>(0);
  const [folderID, setFolderID] = useState<string>('');

  const { navigation } = props;
  const { currentFolder, currentScreen, documentsPath } = props.route.params;

  const { currentUser, currentClient } = useAppSelector(
    (state: RootState) => state.users,
  );
  const { documentListCount } = useAppSelector(
    (state: RootState) => state.appState,
  );
  const { token } = useAppSelector((state: RootState) => state.tokens);
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const { width } = useWindowDimensions();

  const documentsFiltered = documents.filter(doc =>
    doc.name.toLowerCase().includes(searchText.toLowerCase()),
  );
  const documentDestinationPath = Utils.removeWhitespace(
    `${currentClient?.companyName ?? 'noCompany'}/${documentsPath}/`,
  );
  const docsPerPage = 8;
  const plusIcon = require('../../../assets/images/plus.png');

  const popoverActions: IAction[] = [
    {
      title: t('components.dialog.documentActions.open'),
      onPress: () => navigateToDocument(selectedDocument as IDocument),
    },
    {
      title: t('components.dialog.documentActions.download'),
      onPress: () => download(selectedDocument as IDocument),
    },
    {
      title: t('components.dialog.documentActions.delete'),
      onPress: () => openDeleteDialog(),
      isDisabled: currentUser?.userType !== UserType.Admin,
      isDestructive: true,
    },
  ];

  const navigationHistoryItems: IAction[] = [
    {
      title: t('dashboard.title'),
      onPress: () => navigateToDashboard(),
    },
    {
      title: t('documentManagement.title'),
      onPress: () => navigateToDocumentManagement(),
    },
    {
      title: t('systemQuality.title'),
      onPress: () => navigateToSystemQuality(),
    },
    {
      title: currentFolder.title,
      onPress: () => navigateBack(),
    },
  ];

  // Sync Methods
  function navigateBack() {
    // Back to subcategories
    navigation.goBack();
  }

  function navigateToDashboard() {
    navigation.navigate(
      currentUser?.userType === UserType.Admin
        ? NavigationRoutes.ClientDashboardScreenFromAdmin
        : NavigationRoutes.DashboardScreen,
    );
  }

  function navigateToDocumentManagement() {
    navigation.navigate(NavigationRoutes.DocumentManagementScreen);
  }

  function navigateToSystemQuality() {
    navigation.navigate(NavigationRoutes.SystemQualityScreen);
  }

  function navigateTo(item: IFolder) {
    navigation.navigate(NavigationRoutes.DocumentsScreen, {
      previousScreen: 'Records',
      processNumber: currentFolder.number,
      currentScreen: item.title,
      documentsPath: `${currentFolder.title}/records/${item.title}`,
    });
    dispatch(setDocumentListCount(documentListCount + 1));
  }

  function navigateToSMQSurvey() {
    dispatch(setSMQScreenSource(t(currentScreen)));
    dispatch(setIsUpdatingSurvey(false));
    navigation.navigate(NavigationRoutes.SMQSurveyStack);
  }

  function showDocumentDialog(item: IDocument) {
    setSelectedDocument(item);
    setShowDocumentActionDialog(true);
  }

  function displayToast(message: string, isError: boolean = false) {
    setShowToast(true);
    setToastIsShowingError(isError);
    setToastMessage(message);
  }

  function displayModificationProcessDialog(item: IFolder) {
    if (currentUser?.userType === UserType.Admin) {
      setShowFolderModificationDialog(true);
      setFolderNewName(item.title);
      setFolderNumber(item.number ?? 1);
      setFolderID(item.id as string);
    }
  }

  function closeDialogs() {
    setShowAddDocumentDialog(false);
    setShowFolderModificationDialog(false);
    setShowCreateFolderDialog(false);
    setShowDocumentActionDialog(false);
    setShowDeleteConfimationDialog(false);
    setFolderNewName('');
  }

  function openDeleteDialog() {
    closeDialogs();
    setShowDeleteConfimationDialog(true);
  }

  // Async Methods
  async function navigateToDocument(doc: IDocument) {
    try {
      const logInput: IDocumentActivityLogInput = {
        action: DocumentLogAction.Visualisation,
        actorIsAdmin: currentUser?.userType == UserType.Admin,
        actorID: currentUser?.id as string,
        clientID: currentClient?.id as string,
        documentID: doc.id,
      };
      await DocumentActivityLogsService.getInstance().recordLog(
        logInput,
        token,
      );
      navigation.navigate(NavigationRoutes.PDFScreen, {
        documentInputs: [doc],
      });
    } catch (error) {
      console.log('Error recording log for document:', doc.id, error);
    }
  }

  async function download(document: IDocument) {
    try {
      const cachedData = await CacheService.getInstance().retrieveValue<string>(
        document.id as string,
      );
      if (cachedData === null || cachedData == undefined) {
        let docData = await DocumentServiceGet.download(document.id, token);
        docData = Utils.changeMimeType(docData, 'application/pdf');
        await CacheService.getInstance().storeValue(
          document.id as string,
          docData,
        );
        const logInput: IDocumentActivityLogInput = {
          action: DocumentLogAction.Loaded,
          actorIsAdmin: true,
          actorID: currentUser?.id as string,
          clientID: currentClient?.id as string,
          documentID: document.id,
        };
        await DocumentActivityLogsService.getInstance().recordLog(
          logInput,
          token,
        );
        displayToast(t('documentsScreen.downloadSuccess'));
      } else {
        displayToast(t('documentsScreen.alreadyDownloaded'));
      }
      setShowDocumentActionDialog(false);
    } catch (error) {
      displayToast(t(`errors.api.${error}`), true);
    }
  }

  async function loadPaginatedDocuments() {
    try {
      setIsLoading(true);
      const paginatedOutput =
        await DocumentServicePost.getPaginatedDocumentsAtPath(
          documentDestinationPath,
          token,
          currentPage,
          docsPerPage,
        );
      setDocuments(paginatedOutput.documents);
      setTotalPages(paginatedOutput.pageCount);
      setIsLoading(false);
    } catch (error) {
      console.log('Error getting paginated documents:', error);
    }
  }

  async function loadFolders() {
    try {
      const userID = currentClient?.id as string;
      const pathInput: IFolderUserRecordInput = {
        path: documentDestinationPath,
      };
      const folders = await UserServicePost.getRecordsFolders(
        userID,
        token,
        pathInput,
      );
      if (folders.length !== 0) {
        setFolders(folders);
      }
    } catch (error) {
      console.log('Error getting records folders:', error);
    }
  }

  async function pickAFile() {
    // Pick file
    const fileName = `${documentName.replace(/\s/g, '_')}.pdf`;
    const originPath =
      await RecordsDocumentScreenManager.getInstance().pickFile();
    // Upload
    const createdDocuments =
      await RecordsDocumentScreenManager.getInstance().uploadFileToAPI(
        fileName,
        originPath,
        documentDestinationPath,
        token,
      );
    // Record log
    await RecordsDocumentScreenManager.getInstance().recordLog(
      currentUser,
      currentClient,
      createdDocuments[0],
      token,
    ); // TODO: Should be the original document
    // Update states
    setDocumentName('');
    setShowAddDocumentDialog(false);
    await loadPaginatedDocuments();
  }

  async function createFolder() {
    if (folderNewName) {
      // TODO: Let the admin choose the placement of the folder
      setFolderNumber(1);
      try {
        const input: IFolderInput = {
          title: folderNewName,
          number: folderNumber,
          sleeve: Sleeve.Record,
          userID: currentClient?.id as string,
          path: documentDestinationPath,
        };
        const folder = await FolderService.getInstance().create(input, token);
        setFolders(prevItems => {
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
      const updatedFolder = await FolderService.getInstance().update(
        updateInput,
        folderID,
        token,
      );
      setFolders(prevItems =>
        prevItems.map(item =>
          item.number === updatedFolder.number
            ? { ...item, title: updatedFolder.title }
            : item,
        ),
      );
      closeDialogs();
      displayToast(t('systemQuality.modifyProcess.success'));
    } catch (error) {
      const errorMessage = (error as Error).message;
      displayToast(t(`errors.api.${errorMessage}`), true);
    }
  }

  async function deleteFolder() {
    try {
      await FolderService.getInstance().delete(folderID, token);
      setFolders(prevItems => prevItems.filter(item => item.id !== folderID));
      closeDialogs();
      displayToast(t('systemQuality.delete.success'));
    } catch (error) {
      const errorMessage = (error as Error).message;
      displayToast(t(`errors.api.${errorMessage}`), true);
    }
  }

  async function deleteDocument() {
    try {
      const documentID = selectedDocument?.id as string;
      await recordDocumentDeletionActivity(documentID);
      await DocumentServiceDelete.delete(documentID, token);
      closeDialogs();
      await loadPaginatedDocuments();
    } catch (error) {
      displayToast(t(`errors.api.${error}`), true);
    }
  }

  async function recordDocumentDeletionActivity(documentID: string) {
    const logInput: IDocumentActivityLogInput = {
      action: DocumentLogAction.Deletion,
      actorIsAdmin: currentUser?.userType == UserType.Admin,
      actorID: currentUser?.id as string,
      clientID: currentClient?.id as string,
      documentID,
    };
    await DocumentActivityLogsService.getInstance().recordLog(logInput, token);
  }

  // Lifecycle Methods
  useEffect(() => {
    async function init() {
      await loadFolders();
    }
    init();
  }, []);

  useEffect(() => {
    async function init() {
      await loadPaginatedDocuments();
    }
    init();
  }, []);

  useEffect(() => {
    async function init() {
      await loadPaginatedDocuments();
    }
    init();
  }, [currentPage]);

  useEffect(() => {
    async function init() {
      await loadPaginatedDocuments();
    }
    init();
  }, [documentListCount]);

  // Components
  function ToastContent() {
    return (
      <>
        {showToast && (
          <Toast
            message={toastMessage}
            isVisible={showToast}
            setIsVisible={setShowToast}
            isShowingError={toastIsShowingError}
          />
        )}
      </>
    );
  }

  function FolderGridItem(item: IFolder) {
    return (
      <TouchableOpacity
        onPress={() => navigateTo(item)}
        onLongPress={() => displayModificationProcessDialog(item)}>
        <View style={styles.folderContainer}>
          <Text style={styles.categoryTitle}>{item.title}</Text>
        </View>
      </TouchableOpacity>
    );
  }

  function CreateFolderDialog() {
    return (
      <>
        {showCreateFolderDialog && (
          <Dialog
            title={t('systemQuality.create.title')}
            description={t('systemQuality.create.description')}
            confirmTitle={t('systemQuality.create.confirm')}
            cancelTitle={t('components.dialog.cancel')}
            isConfirmAvailable={true}
            isCancelAvailable={true}
            onConfirm={createFolder}
            onCancel={closeDialogs}>
            <GladisTextInput
              value={folderNewName}
              onValueChange={setFolderNewName}
              placeholder={t('systemQuality.create.placeholder')}
              autoCapitalize="words"
            />
          </Dialog>
        )}
      </>
    );
  }

  function AddDocumentDialog() {
    return (
      <>
        {showAddDocumentDialog && (
          <Dialog
            title={t('components.dialog.addDocument.title')}
            confirmTitle={t('components.dialog.addDocument.confirmButton')}
            onConfirm={pickAFile}
            isCancelAvailable={true}
            onCancel={() => setShowAddDocumentDialog(false)}
            isConfirmDisabled={documentName.length === 0}>
            <TextInput
              value={documentName}
              onChangeText={setDocumentName}
              placeholder={t('components.dialog.addDocument.placeholder')}
              style={styles.dialogInput}
            />
          </Dialog>
        )}
      </>
    );
  }

  function ModifyProcessNameDialog() {
    return (
      <>
        {showFolderModificationDialog && (
          <Dialog
            title={t('systemQuality.modifyProcess.title')}
            description={t('systemQuality.modifyProcess.description')}
            confirmTitle={t('components.buttons.save')}
            cancelTitle={t('components.dialog.cancel')}
            extraConfirmButtonTitle={t('components.buttons.delete')}
            isConfirmAvailable={true}
            isCancelAvailable={true}
            onConfirm={modifyFolderName}
            onCancel={closeDialogs}
            extraConfirmButtonAction={deleteFolder}>
            <GladisTextInput
              value={folderNewName}
              onValueChange={setFolderNewName}
              placeholder={t('systemQuality.modifyProcess.placeholder')}
              autoCapitalize="words"
            />
          </Dialog>
        )}
      </>
    );
  }

  function DeleteConfirmationDialog() {
    return (
      <>
        {showDeleteConfimationDialog && (
          <Dialog
            title={`${t('components.dialog.deleteDocument.title')} ${
              selectedDocument?.name
            }`}
            description={t('components.dialog.deleteDocument.description')}
            confirmTitle={t('components.dialog.deleteDocument.confirmButton')}
            onConfirm={deleteDocument}
            onCancel={closeDialogs}
            isConfirmAvailable={true}
            isCancelAvailable={true}
          />
        )}
      </>
    );
  }

  function CreateSMQDocButton() {
    return (
      <>
        {currentUser?.userType !== UserType.Employee && (
          <IconButton
            title={t('systemQuality.createSMQDoc.button')}
            onPress={navigateToSMQSurvey}
            icon={plusIcon}
            style={styles.adminButton}
          />
        )}
      </>
    );
  }

  function AddDocumentButton() {
    return (
      <>
        {currentUser?.userType == UserType.Admin && (
          <IconButton
            title={t('components.buttons.addDocument')}
            icon={plusIcon}
            onPress={() => setShowAddDocumentDialog(true)}
            style={styles.adminButton}
          />
        )}
      </>
    );
  }

  function AddFolderButton() {
    return (
      <>
        {currentUser?.userType === UserType.Admin && (
          <IconButton
            title={t('systemQuality.create.button')}
            onPress={() => setShowCreateFolderDialog(true)}
            icon={plusIcon}
            style={styles.adminButton}
          />
        )}
      </>
    );
  }

  function AdminButtons() {
    const shouldHaveColumn = width < 1100;

    return (
      <View style={{ flexDirection: shouldHaveColumn ? 'column' : 'row' }}>
        {CreateSMQDocButton()}
        {AddDocumentButton()}
        {AddFolderButton()}
      </View>
    );
  }

  return (
    <>
      <AppContainer
        mainTitle={t('process.items.records')}
        searchText={searchText}
        setSearchText={setSearchText}
        showBackButton={true}
        showSearchText={true}
        navigateBack={navigateBack}
        showSettings={true}
        navigationHistoryItems={navigationHistoryItems}
        additionalComponent={
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page: number) => setCurrentPage(page)}
          />
        }
        adminButton={AdminButtons()}>
        <>
          {folders && folders.length !== 0 && (
            <Grid
              data={folders}
              renderItem={renderItem => FolderGridItem(renderItem.item)}
            />
          )}
          {isLoading ? (
            <ActivityIndicator size="large" color={Colors.primary} />
          ) : (
            <DocumentGrid
              documentsFiltered={documentsFiltered}
              showDocumentDialog={showDocumentDialog}
            />
          )}
        </>
      </AppContainer>
      <TooltipAction
        showDialog={showDocumentActionDialog}
        title={`${t('components.dialog.documentActions.title')} ${
          selectedDocument?.name
        }`}
        isConfirmAvailable={false}
        isCancelAvailable={true}
        onConfirm={() => {}}
        onCancel={() => setShowDocumentActionDialog(false)}
        popoverActions={popoverActions}
      />
      {ToastContent()}
      {AddDocumentDialog()}
      {CreateFolderDialog()}
      {ModifyProcessNameDialog()}
      {DeleteConfirmationDialog()}
    </>
  );
}

export default RecordsDocumentScreen;
